import React from 'react';
import PropTypes from 'prop-types';
import telnet from 'telnet-client';

import { notify } from '../Config';
import Button from '../Button';
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
  const readerConfigs = (event: string) => ({
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
  });

  let error = false;

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
      if (!reader.isLLRP) {
        nonLLRPSetup(reader, readerConfigs(reader.event));
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
