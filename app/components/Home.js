// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

import TimerContainer from '../containers/TimerContainer';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <TimerContainer />
          <Link to="/counter">to Counter</Link>
        </div>
      </div>
    );
  }
}
