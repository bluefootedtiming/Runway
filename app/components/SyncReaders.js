import React from 'react';
import PropTypes from 'prop-types';
import telnet from 'telnet-client';
import { notify } from './Config';

/**
  * SyncReaders
  *
  * Sets the readers with configurations necessary to
  * work with Alien Runway using the telnet-client.
  *
  * @memberOf Configuration
  */
const SyncReaders = ({ listenAddress, listenPort, readerMap, addMessage }) => {
  const readerConfigs = (name) => ({
    username: 'alien',
    password: 'password',
    ReaderName: name,
    AutoMode: 'On',
    NotifyMode: 'Off',
    StreamHeader: 'Off',
    TagStreamFormat: 'Custom',
    TagStreamAddress: `${listenAddress}:${listenPort}`,
    TagStreamCustomFormat: 'RSBI,%i,%T,%N',
  });

  const sync = () => {
    let error = false;
    Object.keys(readerMap).forEach(address => {
      if (!readerMap[address]) return;

      const {
        username,
        password,
        ...configs
      } = readerConfigs(readerMap[address]);

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
          Object.keys(configs).forEach(key => (
            conn.exec(`set ${key}=${configs[key]}`)
          ));
          return conn.exec('Save');
        })
        .then(() => conn.end())
      ))
      .catch(() => {
        error = true;
      });
    });
    if (!error) notify('Reader sync complete');
  };

  return (
    <button onClick={sync} style={{ background: 'blue' }}> Sync Readers </button>
  );
};

const { string, number, shape, func } = PropTypes;

SyncReaders.propTypes = {
  listenAddress: string.isRequired,
  listenPort: number.isRequired,
  readerMap: shape({ [string]: string }).isRequired,
  addMessage: func.isRequired
};

export default SyncReaders;
