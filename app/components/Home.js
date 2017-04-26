// @flow
import React, { Component } from 'react';
import styles from './Home.css';

import TimerPanel from '../containers/TimerPanel';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <TimerPanel />
        </div>
      </div>
    );
  }
}
