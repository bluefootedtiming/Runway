// @flow
import React, { Component } from 'react';
import styles from './Home.css';

import TimerPanel from '../containers/TimerPanel';
import Toolbar from '../containers/AppToolbar';

export default class Home extends Component {

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <TimerPanel />
        <Toolbar />
      </div>
    );
  }
}
