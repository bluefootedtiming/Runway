import React from 'react';
import PropTypes from 'prop-types';

import net from 'net';
import telnet from 'telnet-client';
import { Buffer } from 'buffer';

import { notify } from '../Config';

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
    * TODO: Figure out how to use AcquireMode in order to filter out
    *       valid tags to send to Runway to reduce "noise data", such
    *       as car RFID tags and tags that haven't been programmed
    *       correctly.
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
    <button onClick={sync} style={{ background: 'blue' }}> Sync Readers </button>
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
