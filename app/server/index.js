import net from 'net';
import moment from 'moment';
import { addMessage } from '../actions/status';

const MAX_ATTEMPTS = 5;
export const log = {
  store: null,
  info(message: string) {
    this.store.dispatch(addMessage(message, 0));
  },
  error(message: string) {
    this.store.dispatch(addMessage(message, 1));
  }
};

export default class RfidRelay {
  store;
  rfidListener: net.Server;
  runScoreConn: net.Socket;

  constructor(store) {
    this.store = store;
    log.store = this.store;
  }

  start() {
    this._startRfidListener(); // eslint-disable-line
    this._connectToRunScore(); // eslint-disable-line
  }

  stop() {
    this.rfidListener.close();
    this.runScoreConn.destroy();
  }

  _startRfidListener() {
    const { listenPort } = this.store.getState().config;

    this.rfidListener = net.createServer();
    this.rfidListener.on('connection', this.handleConnection);

    this.rfidListener.on('error', (error) => {
      log.error(error.message);
    });

    this.rfidListener.on('close', () => {
      log.info('RFID listener stopped.');
    });

    this.rfidListener.listen(listenPort, () => {
      log.info('RFID listener started!');
    });
  }

  _connectToRunScore() {
    const { runScoreAddress, runScorePort } = this.store.getState().config;
    const serverInfo = {
      host: runScoreAddress,
      port: runScorePort
    };
    let currentAttempts = 0;

    this.runScore = new net.Socket();
    this.runScore.setTimeout(1000);

    this.attemptRSServerConnection(serverInfo);

    this.runScore.on('error', () => {
      currentAttempts += 1;
      log.error('Failed to connect to RSServer.');
      log.error(`(${MAX_ATTEMPTS - currentAttempts}) reconnect attempts left.`);
      if (MAX_ATTEMPTS <= currentAttempts) {
        log.error(`Cannot connect to RSServer on: ${serverInfo.host}:${serverInfo.port}`);
        log.error('Please review server setup.');
      } else {
        this.attemptRSServerConnection(serverInfo);
      }
    });

    // this.runScore.on('close', () => {
    //   if (currentAttempts === maxAttempts) console.log('done');
    // });
  }

  attemptRSServerConnection = (serverInfo: { host: string, port: number }) => {
    log.info('Attempting to connect to RSServer...');
    this.runScore.connect(serverInfo, (conn) => {
      log.info('Connected to RSServer!');
      this.runScoreConn = conn;
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
        log.error(`Unmapped address: ${readerAddress}`);
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


