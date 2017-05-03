// @flow
import React, { Component } from 'react';
import jetpack from 'fs-jetpack';

import styles from './Home.css';

import TimerPanel from '../containers/TimerPanel';
import Toolbar from '../containers/AppToolbar';

import { CONFIG_PATH } from '../constants';

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
