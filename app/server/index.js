import net from 'net';
import moment from 'moment';
import path from 'path';
import jetpack from 'fs-jetpack';

import { addMessage, setRSServerConnection } from '../actions/status';
import * as llrpMessages from '../lib/LLRP/messages';
import * as llrpConstants from '../lib/LLRP/messageConstants';

const { app } = require('electron').remote;

export const MAX_CONNECT_ATTEMPTS = 5;
export const DOCUMENTS_PATH = app.getPath('documents');
export const LOCAL_FOLDER = 'AlienRunwayData';
export const LOGS_PATH = `${DOCUMENTS_PATH}/${LOCAL_FOLDER}`;
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
    this.connectToLLRPReaders();
  }

  stop() {
    this.rfidListener.close();
    this.runScore.end();
  }

  restartRfidConnections() {
    this.startRfidListener();
    this.connectToLLRPReaders();
    log.info('Reconnecting to LLRP Readers.');
  }

  /**
    * startRfidListener
    *
    * Starts the RFID Listener server. This is what the Alien readers write to.
    * Connections/Writes are handled via `handleConnection`.
    *
    * @memberOf RfidRelay
    *
    */
  startRfidListener() {
    const { listenAddress, listenPort } = this.store.getState().config;
    if (this.rfidListener) this.rfidListener.close();

    this.rfidListener = net.createServer();
    this.rfidListener.on('connection', this.handleConnection);

    this.rfidListener.on('error', () => {
      log.error(`Error starting server on: ${listenAddress}:${listenPort}`);
    });

    this.rfidListener.on('close', () => {
      log.info('Alien Runway Server stopped.');
    });

    this.rfidListener.listen(listenPort, listenAddress, () => {
      log.info(`Alien Runway Server started on: ${listenAddress}:${listenPort}`);
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
    if (this.runScore && this.runScore.connecting) {
      log.info('Currently attempting connection.');
      return;
    }

    const serverInfo = this.serverInfo();
    this.runScore = new net.Socket();

    const attemptRSServerConnection = (info: { host: string, port: number }) => {
      log.info(`Connecting to RSServer on: ${serverInfo.host}:${serverInfo.port}`);
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
      log.error(`(${currentAttempts}) reconnect attempts.`);
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
    * We want to reject any rows where the length of the comma separated array isn't 4,
    * the first index isn't RSBI, and the second index isnt a number, is a number
    * greater than 6 digits, or is a negative number
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
    conn.setEncoding('utf8');
    conn.on('data', (rawReaderData) => {
      const { running } = this.store.getState().timer;
      if (!running) return;

      const readerDataArray = rawReaderData
        .split(/[\0\r\n]/)
        .filter(str => str !== '');

      readerDataArray.forEach(row => {
        const subArray = row.split(/,/);
        if (subArray.length !== 4
          || subArray[0] !== 'RSBI'
          || subArray[1].match(/^(\d){1,6}$/) === null) return;

        this.writeData(subArray);
      });
    });
  }

  writeData = (data, conn) => {
    const {
      timer: { startTime },
      status: { runScoreServerConnected }
    } = this.store.getState();
    const formattedArray = this.getFormattedReaderData(data, conn);
    if (runScoreServerConnected) this.runScore.write(`${formattedArray.join(',')}\r`);

    jetpack.appendAsync(
      path.join(
        LOGS_PATH,
        moment(startTime).format('YYYYMMDDhhmmss'),
        `${formattedArray[3]}.csv`
      ),
      `${formattedArray.concat(data[2]).join(',')}\r`
    );
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
    *    ex: data => RSBI,0542,20:09:07.394,Finish
    *             => ['RSBI','0542','20:09:07.394','Finish']
    *        bib = data[0]
    *
    * 3. Replace alien's time (time of day) with elasped time (currentTime - startTime)
    *
    * 4. Add RSBI to the front of the string
    *    so RSServer knows how to format
    *
    * @param {Array<string>}  - This is the data from the reader
    *                           ex: [RSBI, <bib#>, <time>, <event>]
    *                            => ['RSBI', '0452', '08:01:20.324', 'Start']
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

    const index = readerMap.find(({ address }) => address === readerAddress);
    if (index >= 0 && readerMap[index]) newData[3] = readerMap[index].event;
    newData[2] = `${elapsed.hours()}:${elapsed.minutes()}:${elapsed.seconds()}.${elapsed.milliseconds()}`;
    newData[1] = parseInt(readerDataArray[1], 10);
    return newData;
  }

  /**
    * connectToLLRPReaders
    *
    * Starts a connection to the list of available LLRP Connections
    *
    * @memberOf RfidRelay
    */
  connectToLLRPReaders = () => {
    const { config: { readerMap } } = this.store.getState();
    const conns = [];
    console.log('connectToLLRPReaders');

    readerMap.filter(({ isLLRP }) => isLLRP).forEach((reader, i) => {
      const { address: host, port } = reader;
      conns[i] = new net.Socket();
      conns[i].on('connect', () => console.log(port, 'connected'));
      conns[i].on('error', () => console.log(port, 'couldn\'t connect'));
      conns[i].on('end', () => console.log(port, 'connection ended'));
      conns[i].on('data', (data) => {
        console.log('received: ', data);
        switch (data[1]) {
          case llrpConstants.SET_READER_CONFIG_RESPONSE: {
            conns[i].write(llrpMessages.addROSpec());
            break;
          }
          case llrpConstants.ADD_ROSPEC_RESPONSE: {
            conns[i].write(llrpMessages.enableROSpec());
            break;
          }
          case llrpConstants.ENABLE_ROSPEC_RESPONSE: {
            conns[i].write(llrpMessages.startROSpec());
            break;
          }
          case llrpConstants.KEEPALIVE: {
            conns[i].write(llrpMessages.keepAliveAck());
            break;
          }
          case llrpConstants.RO_ACCESS_REPORT: {
            log.info('Tag found!');
            break;
          }
          default:
            console.log(port, data[1]);
        }
      });
      conns[i].connect({ host, port });
    });
  }
}
