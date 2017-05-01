import net from 'net';
import moment from 'moment';
import { addMessage, setRSServerConnection } from '../actions/status';

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
  connected: boolean;

  constructor(store) {
    this.store = store;
    log.store = this.store;
    this.connected = false;
  }

  start() {
    this.startRfidListener();
    this.connectToRSServer();
  }

  stop() {
    this.rfidListener.close();
    this.runScoreConn.destroy();
  }

  startRfidListener() {
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

  serverInfo = () => ({
    host: this.store.getState().config.runScoreAddress,
    port: this.store.getState().config.runScorePort
  })

  connectToRSServer() {
    const serverInfo = this.serverInfo();
    this.runScore = new net.Socket();

    const attemptRSServerConnection = (info: { host: string, port: number }) => {
      log.info('Attempting to connect to RSServer...');
      this.runScore.connect(info, (conn) => {
        log.info('Connected to RSServer!');
        this.runScoreConn = conn;
        this.store.dispatch(setRSServerConnection(true));
      });
    };

    attemptRSServerConnection(serverInfo);

    let currentAttempts = 0;
    this.runScore.on('error', () => {
      this.store.dispatch(setRSServerConnection(false));
      currentAttempts += 1;
      log.error('Failed to connect to RSServer.');
      log.error(`(${MAX_ATTEMPTS - currentAttempts}) reconnect attempts left.`);
      if (MAX_ATTEMPTS <= currentAttempts) {
        log.error(`Cannot connect to RSServer on: ${serverInfo.host}:${serverInfo.port}`);
        log.error('Please review server setup.');
      } else {
        setTimeout(() => (attemptRSServerConnection(serverInfo)), 5000);
      }
    });

    // this.runScore.on('close', () => {
    //   if (currentAttempts === maxAttempts) console.log('done');
    // });
  }

  // TODO: There needs Alien timestamps need to be appended
  //    to the end of the formatted string sent to RSServer
  //    when we save the string to the csv log files.
  handleConnection = (conn) => {
    const runScore = this.runScore;
    if (!runScore) return;

    conn.setEncoding('utf8');
    conn.on('data', (rawReaderData) => {
      const { timer: { running } } = this.store.getState();

      if (!running) return;

      const readerDataArray = rawReaderData.split(/[,\0\r\n]/).filter(str => str !== '');
      for (let i = 0; i < readerDataArray.length; i += 3) {
        const subArray = readerDataArray.slice(i, i + 3);
        const formattedData = this.getFormattedReaderData(subArray, conn);
        runScore.write(formattedData);
        // Debugging
        // console.log(subArray);
        // console.log(formattedData);
      }
    });
  }

  getFormattedReaderData = (readerDataArray, conn) => {
    const { config: { readerMap }, timer: { startTime } } = this.store.getState();
    const newData = readerDataArray;
    // Obtain the route mapped to the reader's address
    // ex: conn.remoteAddress => '::ffff:192.168.1.100'
    //      => ['','','ffff','','192.168.1.100']
    //      => '192.168.1.100'
    const readerAddress = conn.remoteAddress.split(':').pop();
    if (readerMap[readerAddress]) {
      newData[2] = readerMap[readerAddress];
    }

    // Remove any leading zeros on the bib
    // ex: data => 0542,20:09:07.394,Finish
    //          => ['0542','20:09:07.394','Finish']
    //     bib = data[0]
    newData[0] = parseInt(readerDataArray[0], 10);
    // Replace alien's time with elasped time
    // Difference between current & start
    const elapsed = moment.duration(moment.now() - startTime);
    newData[1] = `${elapsed.hours()}:${elapsed.minutes()}:${elapsed.seconds()}.${elapsed.milliseconds()}`;
    // Add RSBI to the front of the string
    // so RSServer knows how to format
    newData.unshift('RSBI');
    return `${readerDataArray.join(',')}\r`;
  }
}


