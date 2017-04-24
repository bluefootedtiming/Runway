// @flow
import React, { Component } from 'react';
import styles from './Home.css';

import TimerContainer from '../containers/TimerContainer';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <TimerContainer />
        </div>
      </div>
    );
  }
}
