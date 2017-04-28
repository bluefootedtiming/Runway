import net from 'net';
import moment from 'moment';
import { addMessage } from '../actions/status';

const RSSERVER_CONNECTION_ATTEMPTS = 5;
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
    this.store.dispatch(addMessage('Stopping...'));
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

    this.attemptRSServerConnection(serverInfo, RSSERVER_CONNECTION_ATTEMPTS);

    this.runScore.on('close', () => {
      this.store.dispatch(addMessage('Disconnected from RSServer'));
      this.runScoreConn = null;
    });
  }

  /**
   * attemptRSServerConnection
   *
   * Recursive function to attempt connection to the RSServer.
   * This function will only call recursively if it fails.
   *
   * @param {Server}          - Address and Port information
   * @param {Number} attempts - Number of attempts left to retry connection
   * @memberOf RfidRelay
   */
  attemptRSServerConnection = (serverInfo: { host: string, port: number }, attempts: number) => {
    if (attempts === 0) {
      this.store.dispatch(addMessage(`
        Please review server setup.
      `));
      return;
    }

    this.store.dispatch(addMessage('Attempting connection to RSServer...'));
    this.runScore = net.connect(serverInfo, (conn) => {
      this.store.dispatch(addMessage('Connected to RSServer!'));
      this.runScoreConn = conn;
    });

    this.runScore.on('error', (error) => {
      this.store.dispatch(addMessage(`
        Failed to connect to RSServer: ${error.message}
        (${attempts}) attempts left
      `));
      this.attemptRSServerConnection(serverInfo, attempts - 1);
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


