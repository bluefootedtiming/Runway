import net from 'net';
import moment from 'moment';
import path from 'path';
import jetpack from 'fs-jetpack';

import { addMessage, setRSServerConnection } from '../actions/status';
import { LOGS_PATH, MAX_CONNECT_ATTEMPTS } from '../constants';

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
  runScore: net.Socket;
  rfidListener: net.Server;

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
    this.runScore.end();
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

  /**
    * connectToRSServer
    *
    * Connects to the RunScoreServer using the server info. It will attempt
    * connection at a maximum of MAX_CONNECT_ATTEMPTS before quitting. Connection can
    * be manually started via the connect button.
    *
    * TODO: There needs to be a way to kill previous connection attempts before
    *       trying any new connecitons. Currently, pressing that button starts
    *       up as many attempts as desired, which can cause the server to crash(?)
    *       and spam the logs.
    *
    * @memberOf RfidRelay
    */
  connectToRSServer() {
    const serverInfo = this.serverInfo();
    this.runScore = new net.Socket();

    const attemptRSServerConnection = (info: { host: string, port: number }) => {
      log.info('Attempting to connect to RSServer...');
      this.runScore.connect(info, () => {
        log.info('Connected to RSServer!');
        this.store.dispatch(setRSServerConnection(true));
      });
    };

    attemptRSServerConnection(serverInfo);

    let currentAttempts = 0;
    this.runScore.on('error', () => {
      this.store.dispatch(setRSServerConnection(false));
      currentAttempts += 1;
      log.error('Failed to connect to RSServer.');
      log.error(`(${MAX_CONNECT_ATTEMPTS - currentAttempts}) reconnect attempts left.`);
      if (MAX_CONNECT_ATTEMPTS <= currentAttempts) {
        log.error(`Cannot connect to RSServer on: ${serverInfo.host}:${serverInfo.port}`);
        log.error('Please review server setup.');
      } else {
        setTimeout(() => (attemptRSServerConnection(serverInfo)), 5000);
      }
    });

    this.runScore.on('end', () => {
      log.info('Ending RSServer connection.');
      this.store.dispatch(setRSServerConnection(false));
    });
  }

  /**
    * handleConnection
    *
    * Handles Rfid writes to the RfidListener. The handler writes to both the csv
    * file (/<dirname>/<timestamp>/<event>.csv) and--optionally--to RunScore Server.
    * It's optional to write to the RunScoreServer due to the possibility of it
    * crashing/losing connection.
    *
    * When writing to the csv, the reader's timestamp is appended to the end of the row.
    * This is a backup time that may or may not be useful due to readers often having
    * incorrect timing.
    *
    * @param {object} - Connection information about the Rfid connected
    *
    * @memberOf RfidRelay
    */
  handleConnection = (conn) => {
    const runScore = this.runScore;

    conn.setEncoding('utf8');
    conn.on('data', (rawReaderData) => {
      const { startTime, running } = this.store.getState().timer;
      if (!running) return;

      const readerDataArray = rawReaderData
        .split(/[,\0\r\n]/)
        .filter(str => str !== '');

      for (let i = 0; i < readerDataArray.length; i += 3) {
        const formattedArray = this.getFormattedReaderData(readerDataArray.slice(i, i + 3), conn);
        if (runScore) runScore.write(`${formattedArray.join(',')}\r`);

        // Debug message
        // log.info(path.join(
        //   ABS_PATH,
        //   DIR_NAME,
        //   moment(startTime).format('YYYYMMDDhhmmss'),
        //   `${formattedArray[3]}.csv`
        // ));

        jetpack.appendAsync(
          path.join(LOGS_PATH, moment(startTime).format('YYYYMMDDhhmmss'), `${formattedArray[3]}.csv`),
          `${formattedArray.join(',')}\r`
        );
      }
    });
  }

  /**
    * getFormattedReaderData
    *
    * The purpose of this function is to take the array of reader data
    * and return an array that, joined as a string, can be imported by runScore.
    *
    * The changes that need to occur to the original array are as follows:
    *
    * 1. Obtain the route mapped to the reader's address. If this address is mapped,
    *    then use the value as the event. Otherwise, default to the reader's name.
    *    ex: conn.remoteAddress => '::ffff:192.168.1.100'
    *         => ['','','ffff','','192.168.1.100']
    *         => '192.168.1.100'
    *
    * 2. Remove any leading zeros on the bib
    *    ex: data => 0542,20:09:07.394,Finish
    *             => ['0542','20:09:07.394','Finish']
    *        bib = data[0]
    *
    * 3. Replace alien's time (time of day) with elasped time (currentTime - startTime)
    *
    * 4. Add RSBI to the front of the string
    *    so RSServer knows how to format
    *
    * @param {Array<string>}  - This is the data from the reader
    *                           ex: [<bib#>, <time>, <event>]
    *                            => ['0452', '08:01:20.324', 'Start']
    * @param {object}         - Connection information about the Rfid connected
    * @return {Array<string>} - When joined, this should be able to be
    *                           imported by RunScore Server
    *                           ex: ['RSBI', <bib#>, <time>, <event>]
    *                            => ['RSBI', '452', '00:01:20.002', 'Start']
    * @memberOf RfidRelay
    */
  getFormattedReaderData = (readerDataArray: Array<string>, conn: any) => {
    const { config: { readerMap }, timer: { startTime } } = this.store.getState();
    const readerAddress = conn && conn.remoteAddress.split(':').pop();
    const elapsed = moment.duration(moment.now() - startTime);
    const newData = readerDataArray.slice();

    if (readerMap[readerAddress]) newData[2] = readerMap[readerAddress];
    newData[1] = `${elapsed.hours()}:${elapsed.minutes()}:${elapsed.seconds()}.${elapsed.milliseconds()}`;
    newData[0] = !isNaN(readerDataArray[0]) ? parseInt(readerDataArray[0], 10) : readerDataArray[0];
    newData.unshift('RSBI');
    return newData;
  }
}


