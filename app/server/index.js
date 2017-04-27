import net from 'net';
import moment from 'moment';
// import { bindActionCreators } from 'redux';

export default class RfidRelay {
  store;
  rfidListener: net.Server;
  port: number = 3988;
  runScoreConn: net.Socket;

  constructor(store) {
    this.store = store;
  }

  start() {
    this._startRfidListener(); // eslint-disable-line
    this._connectToRunScore(); // eslint-disable-line
  }

  stop() {
    console.log('Stopping');
    this.rfidListener.close();
    this.runScoreConn.destroy();
  }

  _startRfidListener() {
    this.rfidListener = net.createServer();
    this.rfidListener.on('connection', this.handleConnection);

    this.rfidListener.listen(3988, () => {
      // this.store.dispatch(CounterActions.decrement());
      console.log('RFID listener started');
    });
  }

  _connectToRunScore() {
    this.runScore = net.connect({
      host: '192.168.1.4',
      port: 3988
    });

    this.runScore.on('connect', (conn) => {
      console.log('Connected to RunScore');
      // this.store.dispatch(CounterActions.decrement());
      this.runScoreConn = conn;
    });

    this.runScore.on('close', () => {
      console.log('Disconnected from RunScore');
      this.runScoreConn = null;
    });
  }

  // TODO: There needs Alien timestamps need to be appended
  //    to the end of the formatted string sent to RSServer
  //    when we save the string to the csv log files.
  handleConnection = (conn) => {
    // const dispatch = this.store.dispatch;
    const runScore = this.runScore;
    if (!runScore) return;

    conn.setEncoding('utf8');
    conn.on('data', (data) => {
      // Need to remove any leading zeros on the bib
      // ex: data => 0542,20:09:07.394,Finish
      //          => ['0542','20:09:07.394','Finish']
      //     bib = data[0]
      const array = data.split(',');
      array[0] = parseInt(array[0], 10);
      // Need to replace alien's time with elasped time
      // Difference between current & start
      const elapsed = moment.duration(moment.now() - this.store.getState().timer.startTime);
      array[1] = `${elapsed.hours()}:${elapsed.minutes()}:${elapsed.seconds()}.${elapsed.milliseconds()}`;
      // Add RSBI to the front of the string
      // so RSServer knows how to format
      array.unshift('RSBI');
      runScore.write(`${array.join(',')}\r`);
    });
  };

}


