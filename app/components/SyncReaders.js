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
const SyncReaders = ({ listenAddress, listenPort, readerMap }) => {
  const readerConfigs = (name) => ({
    username: 'alien',
    password: 'password',
    ReaderName: name,
    AutoMode: 'On',
    NotifyMode: 'Off',
    StreamHeader: 'Off',
    TagStreamFormat: 'Custom',
    TagStreamAddress: `${listenAddress}:${listenPort}`,
    TagStreamCustomFormat: 'RSBI,%I,%T,%N',
  });

  const sync = () => {
    Object.keys(readerMap).forEach(address => {
      if (!readerMap[address]) return;

      const {
        username,
        password,
        ...configs
      } = readerConfigs(readerMap[address]);

      const conn = new telnet(); // eslint-disable-line
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
        notify(`Could not sync reader on: ${address}`);
      });
    });
    notify('Reader Sync Complete');
  };

  return (
    <button onClick={sync} style={{ background: 'blue' }}> Sync Readers </button>
  );
};

const { string, number, shape } = PropTypes;

SyncReaders.propTypes = {
  listenAddress: string.isRequired,
  listenPort: number.isRequired,
  readerMap: shape({ [string]: string }).isRequired
};

export default SyncReaders;
