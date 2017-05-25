// @flow
import React, { Component } from 'react';
import jetpack from 'fs-jetpack';

import styles from './Home.scss';

import TimerPanel from '../../containers/TimerPanel';
import Toolbar from '../../containers/AppToolbar';

import { relay } from '../../index';
import { LOGS_PATH } from '../../server';

export const CONFIG_PATH = `${LOGS_PATH}/config.json`;

export default class Home extends Component {
  props: {
    loadConfigurations: () => void
  }

  // Load the configuration files
  componentWillMount() {
    const config = jetpack.read(CONFIG_PATH, 'json');
    if (config) {
      this.props.loadConfigurations({
        ...config,
        runScorePort: Number(config.runScorePort) || 0,
        listenPort: Number(config.listenPort) || 0
      });
    } else {
      jetpack.file(CONFIG_PATH, { content: {} });
    }

    relay.start();
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <TimerPanel />
        <Toolbar />
      </div>
    );
  }
}
