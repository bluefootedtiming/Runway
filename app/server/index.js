import net from 'net';
import path from 'path';
import moment from 'moment';

import { LLRP_TAG_REGEX, MAX_CONNECT_ATTEMPTS } from '../constants';
import { setRSServerConnection } from '../actions/status';
import * as llrpMessages from '../lib/LLRP/messages';
import decode from '../lib/LLRP/decode';
import log from '../lib/logger';


// ===============
// LLRP helper functions
// ===============
const nameOf = (obj) => Object.keys(obj)[0];
const read = (obj) => (
  parseInt(obj[0].LLRPStatus.value, 16) ? hexToText(obj[0].LLRPStatus.value) : 'Success!'
); // eslint-disable-line
const hexToText = (val: string) => {
  let str = '';
  for (let i = 0; i < val.length; i += 2) {
    str += String.fromCharCode(parseInt(val.slice(i, i + 2), 16));
  }
  return str;
};
const getTags = (str: string, reg: RegExp, ret: Array<string> = []) => {
  if (str.length < 1) { return undefined; }
  const arry = str.match(reg);
  if (arry && arry.index > 0) {
    getTags(str.slice(arry.index + 1), reg, ret);
  } else {
    return undefined;
  }
  ret.push(arry[2]);
  return ret;
};

export default class RfidRelay {
  store;
  runScore: net.Socket;
  rfidListener: net.Server;
  llrpConns: Array<net.Socket>;

  constructor(store) {
    this.store = store;
    log.store = this.store;
    this.llrpConns = [];
  }

  start() {
    this.startRfidListener();
    this.connectToRSServer();
    this.connectToLLRPReaders();
  }

  stop() {
    this.rfidListener.close();
    this.runScore.end();
    this.stopLLRPConnections();
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
      // log.info('Alien Runway Server stopped.');
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
      // log.info(`Connecting to RSServer on: ${serverInfo.host}:${serverInfo.port}`);
      this.runScore.connect(info, () => {
        log.info('Connected to RSServer!');
        this.store.dispatch(setRSServerConnection(true));
      });
    };

    attemptRSServerConnection(serverInfo);

    let currentAttempts = 0;
    this.runScore.on('error', () => {
      if (currentAttempts === 0) log.error('Failed to connect to RSServer. Retrying.');
      this.store.dispatch(setRSServerConnection(false));
      currentAttempts += 1;
      if (MAX_CONNECT_ATTEMPTS <= currentAttempts) {
        log.error(`Cannot connect to RSServer on: ${serverInfo.host}:${serverInfo.port}`);
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
      const readerAddress = conn && conn.remoteAddress.split(':').pop();
      const readerDataArray = rawReaderData
        .split(/[\0\r\n]/)
        .filter(str => str !== '');

      readerDataArray.forEach(row => {
        const subArray = row.split(/,/);
        if (subArray.length !== 4
          || subArray[0] !== 'RSBI'
          || subArray[1].match(/^(\d){1,6}$/) === null) return;

        this.writeData(subArray, readerAddress);
      });
    });
  }

  writeData = (data, readerAddress) => {
    const {
      timer: { startTime },
      status: { runScoreServerConnected }
    } = this.store.getState();
    const formattedArray = this.getFormattedReaderData(data, readerAddress);
    if (runScoreServerConnected) this.runScore.write(`${formattedArray.join(',')}\r`);
    log.file(
      formattedArray.join(','),
      path.join(`${moment(startTime).format('YYYYMMDDhhmmss')}`, `${formattedArray[3] || 'unmappedEvent'}.csv`)
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
  getFormattedReaderData = (readerDataArray: Array<string>, readerAddress: string) => {
    const { config: { readerMap }, timer: { startTime } } = this.store.getState();
    const elapsed = moment.duration(moment.now() - startTime);
    const newData = readerDataArray.slice();
    const reader = readerMap.find(({ address }) => address === readerAddress);
    if (reader) newData[3] = reader.event;
    newData[2] = `${elapsed.hours()}:${elapsed.minutes()}:${elapsed.seconds()}.${elapsed.milliseconds()}`;
    newData[1] = parseInt(readerDataArray[1], 10);
    return newData;
  }

  /**
    * stopLLRPConnections
    *
    * Destroys all current connections to LLRP Readers
    *
    * @memberOf RfidRelay
    */
  stopLLRPConnections = () => (
    this.llrpConns && this.llrpConns.forEach(conn => conn.destroy())
  )

  /**
    * connectToLLRPReaders
    *
    * Starts a connection to the list of available LLRP Connections
    *
    * @memberOf RfidRelay
    */
  connectToLLRPReaders = () => {
    const { config: { readerMap } } = this.store.getState();
    const { llrpConns } = this;
    if (llrpConns) { this.stopLLRPConnections(); }
    if (readerMap.length) {
      readerMap.filter(({ isLLRP }) => isLLRP).forEach((reader, i) => {
        const { address: host, port } = reader;
        llrpConns[i] = new net.Socket();
        llrpConns[i].on('data', (data) => this.handleLLRPData(llrpConns[i], data));
        llrpConns[i].on('error', () => log.error(`Could not connect to LLRP Server: ${host}:${port}`));
        llrpConns[i].on('end', () => log.info(`Connection ended: ${host}:${port}`));
        llrpConns[i].on('connect', () => log.info(`Connected to LLRP Server: ${host}:${port}`));
        llrpConns[i].connect({ host, port });
      });
    }
  }

  handleLLRPData = (conn, data) => {
    const { timer: { running } } = this.store.getState();
    const [[message, ...parameters], hexMsg] = decode(data); // eslint-disable-line
    switch (nameOf(message)) {
      case 'READER_EVENT_NOTIFICATION':
        // log.info(nameOf(message));
        conn.write(llrpMessages.getReaderConfig());
        break;
      case 'GET_READER_CONFIG_RESPONSE':
        // log.info(nameOf(message));
        conn.write(llrpMessages.setReaderConfig());
        break;
      case 'SET_READER_CONFIG_RESPONSE':
        // log.info(nameOf(message), read(parameters));
        conn.write(llrpMessages.deleteROSpec());
        break;
      case 'DELETE_ROSPEC_RESPONSE':
        // log.info(nameOf(message), read(parameters));
        conn.write(llrpMessages.addROSpec());
        break;
      case 'ADD_ROSPEC_RESPONSE':
        // log.info(nameOf(message), read(parameters));
        conn.write(llrpMessages.enableROSpec());
        break;
      case 'ENABLE_ROSPEC_RESPONSE':
        // log.info(nameOf(message), read(parameters));
        conn.write(llrpMessages.startROSpec());
        break;
      case 'START_ROSPEC_RESPONSE':
        // log.info(nameOf(message), read(parameters));
        log.info(`LLRP Server ready on: ${conn.remoteAddress}:${conn.remotePort}`);
        break;
      case 'KEEPALIVE':
        // log.info(nameOf(message), read(parameters));
        conn.write(llrpMessages.keepAliveAck());
        break;
      case 'RO_ACCESS_REPORT': {
        if (running) {
          // log.info(nameOf(message));
          const tags = getTags(hexMsg, LLRP_TAG_REGEX);
          if (tags) { tags.forEach(tag => this.writeData(['RSBI', tag, '', ''], conn.remoteAddress)); }
        }
        break;
      }
      default:
        // log.info(`${nameOf(message)}`);
    }
  }
}
