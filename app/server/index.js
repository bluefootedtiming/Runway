import net from 'net';
import moment from 'moment';
import { addMessage } from '../actions/status';

export default class RfidRelay {
  store;
  rfidListener: net.Server;
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
    const { listenPort } = this.store.getState().config;

    this.rfidListener = net.createServer();
    this.rfidListener.on('connection', this.handleConnection);

    this.rfidListener.on('error', (error) => {
      this.store.dispatch(addMessage(error.message));
    });

    this.rfidListener.listen(listenPort, () => {
      this.store.dispatch(addMessage('RFID listener started'));
    });
  }

  _connectToRunScore() {
    const { runScoreAddress, runScorePort } = this.store.getState().config;

    const serverInfo = {
      host: runScoreAddress,
      port: runScorePort
    };

    const attemptConnection = (conn) => {
      this.store.dispatch(addMessage('Connected to RSServer'));
      this.runScoreConn = conn;
    };

    this.runScore = net.connect(serverInfo, attemptConnection);

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
      const { readerMap, timer: { running, startTime } } = this.store.getState();
      if (!running || Object.keys(readerMap).length < 0) return;

      // Obtain the route mapped to the reader's address
      // ex: conn.remoteAddress => '::ffff:192.168.1.100'
      //      => ['','','ffff','','192.168.1.100']
      //      => '192.168.1.100'
      const readerAddress = conn.remoteAddress.split(':').pop();
      if (readerMap[readerAddress] === undefined) {
        this.store.dispatch(addMessage(`Unmapped address: ${readerAddress}`));
        return;
      }
      const readerDataArray = rawReaderData.split(',');
      readerDataArray[2] = readerMap[readerAddress];
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


