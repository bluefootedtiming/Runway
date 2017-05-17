import React from 'react';
import PropTypes from 'prop-types';

import net from 'net';
import telnet from 'telnet-client';
import { Buffer } from 'buffer';

import { notify } from '../Config';
import Button from '../Button';

/**
  * createLLRPMessage
  *
  * Takes a message type and a list of parameters to create a hex string
  * that can be placed into a buffer and written to an LLRP server.
  *
  * Simply, first 2 octets describe the reserved and version,
  * next 2 octets describe the message type,
  * next 8 octets describe the message length (length of the message value, i.e. all parameters),
  * next 8 octets describe the message ID (this can be left blank unless specifed),
  * and the next variable amount of octets (described by the message length) describes
  * the message value
  *
  * For example, the following is a hex string for: SET_READER_CONFIG:
  * 040300000010000000000000e2000580
  *
  * - ['04'] => 0000 0100 => Version 1
  * - ['03'] => 0000 0010 => SET_READER_CONFIG: 3
  * - ['00000010'] => ... 0000 0001 0000 0000 => Message length = 64 bits/12 octets
  * - ['00000000'] => ... => Message ID 
  * - ['0000e2000580'] => Message Value which is:
  *   - ['00'] => Reserved
  *   - ['00e2000580'] => 0000 0000 1110 0010 0000 0000 0000 0101 1000 0000
  *   -                 => The ReaderEventNotificationSpecParameter which is:
  *     - ['00e2'] => This is the reserved bits and the type (226) EventsAndReports
  *     - ['0005'] => Length
  *     - ['8'] => HoldEventsAndReportsUponReconnect = true
  *
  *
  * @param {number}         type - Message PropTypes
  * @param {Array<string>}  parameters - A list of LLRPParameter hex strings
  *
  * @return {Buffer}
  */
const createLLRPMessage = (type: number, parameters: Array<string>, ...options) => {
  const fill = (total, len) => (len < total ? '0'.repeat(total - len) : '');
  // Initialize with ver 1
  let message = '04';

  // Concat the type
  const typeHex = type ? type.toString(16) : '';
  message += `${fill(2, typeHex.length)}${typeHex}`;

  // Concat the value length
  const valueHex = parameters.length ? (
    parameters.reduce((total, param) => (param.length + total), 0).toString(16)
  ) : '';
  message += `${fill(8, valueHex.length)}${valueHex}`;

  // Optional Message ID value (the 0s are necessary)
  const idHex = options.id ? options.id.toString(16) : '';
  message += `${fill(8, idHex.length)}${idHex}`;

  // Concat any and all params (assuming they are correct)
  parameters.forEach(param => { message += param; });
  return Buffer.from(message, 'hex');
};

/**
  * SyncReaders
  *
  * Sets the readers with configurations necessary to
  * work with Alien Runway using the telnet-client.
  *
  * @memberOf Configuration
  */
const SyncReaders = ({ listenAddress, listenPort, readerMap, addMessage }) => {
  /**
    * readerConfigs
    *
    * Hash of default configurations for Alien RFID Readers.
    *
    * @param {string} event
    */
  const readerConfigs = (event: string = '') => ({
    LLRP: {
      bSetReaderConfig: Buffer.from('040300000010000000000000e2000580', 'hex'),
      bEnableEventsAndReport: Buffer.from('04400000000a00000000', 'hex'),
      bAddRoSpec: Buffer.from('04140000005d0000000000b1005300000001000000b2001200b300050000b60009000000000000b700180001000000b8000901000003e800ba000700010100ed001f01000000ee000bffc0015c0005c003ff000d000067ba0000008e01', 'hex'),
      bEnableRoSpec: Buffer.from('04180000000e0000000000000001', 'hex'),
      bStartRoSpec: Buffer.from('04160000000e0000000000000001', 'hex'),
      bKeepaliveAck: Buffer.from('04480000000a00000000', 'hex'),
    },
    NON_LLRP: {
      username: 'alien',
      password: 'password',
      ReaderName: event,
      AutoMode: 'On',
      // AcquireMode: 'Inventory',
      // AcqG2Mask: '',
      NotifyMode: 'Off',
      StreamHeader: 'Off',
      TagStreamMode: 'On',
      TagStreamFormat: 'Custom',
      TagStreamAddress: `${listenAddress}:${listenPort}`,
      TagStreamCustomFormat: 'RSBI,%i,%T,%N',
    }
  });

  let error = false;

  const LLRPSetup = (reader, configs) => {
    console.log(`Connecting to: ${reader.address}:${reader.port}`);
    const conn = net.Socket();
    conn.connect({
      host: reader.address,
      port: reader.port
    }, () => {
      console.log(`Connected to: ${reader.address}:${reader.port}`);
      Object.entries(configs).forEach(([, buffer]) => conn.write(buffer));
    });

    conn.on('data', data => {
      console.log('Recieved:', data);
    });

    conn.on('error', () => { error = true; });
  };

  /**
    * nonLLRPSetup
    *
    * Connect to and setup a reader that is capable of using nonLLRP commands.
    * This was the original model that we worked with (ALR-9650) and has now
    * been set to the side as special case--swapped with the GS1Standard LLRP
    * Command set.
    *
    * @param {object} address - The address of the reader
    * @param {object} configs - Configurations for the reader
    */
  const nonLLRPSetup = ({ address }, { username, password, ...configs }) => {
    const conn = new telnet(); // eslint-disable-line
    conn.on('error', () => {
      addMessage(`Could not sync reader on: ${address}`, 1);
      notify('Issues occurred while syncing readers');
    });

    conn.connect({
      host: address,
      shellPrompt: '',
      loginPrompt: /Username(>?)/,
      passwordPrompt: /Password(>?)/,
    });

    // debug the telnet client
    // conn.on('data', (c) => console.log(`${c}`));

    conn.exec(username)
    .then(() => (
      conn.exec(password)
      .then(() => {
        Object.entries(configs).forEach(([key, value]) => conn.exec(`set ${key}=${value}`));
        return conn.exec('Save');
      })
      .then(() => conn.end())
    ))
    .catch(() => {
      error = true;
    });
  };

  const sync = () => {
    readerMap.forEach(reader => {
      if (reader.isLLRP) {
        LLRPSetup(reader, readerConfigs().LLRP);
      } else {
        nonLLRPSetup(reader, readerConfigs(reader.event).NON_LLRP);
      }
    });
    if (!error) notify('Reader sync complete');
  };

  return (
    <Button onClick={sync} style={{ background: 'blue' }}> Sync Readers </Button>
  );
};

const { arrayOf, string, number, shape, func } = PropTypes;

export const readerShape = {
  address: string,
  event: string
};

SyncReaders.propTypes = {
  listenAddress: string.isRequired,
  listenPort: number.isRequired,
  readerMap: arrayOf(shape(readerShape)).isRequired,
  addMessage: func.isRequired
};

export default SyncReaders;
