import net from 'net';
import moment from 'moment';
import { addMessage } from '../actions/status';

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

    this.rfidListener.on('error', (error) => {
      this.store.dispatch(addMessage(error.message));
    });

    this.rfidListener.listen(3988, () => {
      this.store.dispatch(addMessage('RFID listener started'));
    });
  }

  _connectToRunScore() {
    this.runScore = net.connect({
      host: '192.168.1.4',
      port: 3988
    });

    this.runScore.on('error', (error) => {
      this.store.dispatch(addMessage(`Unable to connect to RSServer: ${error.message}`));
    });

    this.runScore.on('close', () => {
      this.store.dispatch(addMessage('Disconnected from RSServer'));
      this.runScoreConn = null;
    });
  }

  // TODO: There needs Alien timestamps need to be appended
  //    to the end of the formatted string sent to RSServer
  //    when we save the string to the csv log files.
  handleConnection = (conn) => {
    const runScore = this.runScore;
    if (!runScore) return;

    conn.setEncoding('utf8');

    conn.on('data', (rawReaderData) => {
      const { running, startTime } = this.store.getState().timer;
      if (!running) return;

      const readerDataArray = rawReaderData.split(',');
      // Remove any leading zeros on the bib
      // ex: data => 0542,20:09:07.394,Finish
      //          => ['0542','20:09:07.394','Finish']
      //     bib = data[0]
      readerDataArray[0] = parseInt(readerDataArray[0], 10);
      // Replace alien's time with elasped time
      // Difference between current & start
      const elapsed = moment.duration(moment.now() - startTime);
      readerDataArray[1] = `${elapsed.hours()}:${elapsed.minutes()}:${elapsed.seconds()}.${elapsed.milliseconds()}`;
      // Add RSBI to the front of the string
      // so RSServer knows how to format
      readerDataArray.unshift('RSBI');
      const formattedData = `${readerDataArray.join(',')}\r`;
      console.log(formattedData);
      runScore.write(formattedData);
    });
  };

}


