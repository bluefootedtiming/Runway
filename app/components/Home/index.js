// @flow
import React, { Component } from 'react';
import jetpack from 'fs-jetpack';

import styles from './Home.scss';

import TimerPanel from '../../containers/TimerPanel';
import Toolbar from '../../containers/AppToolbar';

import { relay } from '../../index';
import log from '../../lib/logger';

export default class Home extends Component {
  props: {
    loadConfigurations: () => void
  }

  // Load the configuration files
  componentWillMount() {
    const config = jetpack.read(log.configPath(), 'json');
    if (config) {
      this.props.loadConfigurations({
        ...config,
        runScorePort: Number(config.runScorePort) || 0,
        listenPort: Number(config.listenPort) || 0
      });
    } else {
      jetpack.file(log.configPath(), { content: {} });
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
