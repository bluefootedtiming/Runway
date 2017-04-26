import React, { Component } from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import StatusDisplay from '../components/StatusDisplay';
import Configuration from '../components/Configuration';
import styles from './toolbar.scss';

// import * as ConfigureActions from '../actions/configure';

class Tools extends Component {
  state: {
    currentTool?: string
  };

  constructor() {
    super();
    this.state = {
      currentTool: null
    };
  }

  toggleTool = e => {
    const tool = e.target.name;
    const { currentTool: previousTool } = this.state;
    const currentTool = tool === previousTool ? null : tool;
    if (currentTool) {
      // resize window
      // const electron = require('electron').remote; // eslint-disable-line global-require
      // electron
    }
    this.setState({ currentTool });
  }

  render() {
    const { currentTool } = this.state;

    return (
      <div className={styles.container} >
        <button name="status" onClick={this.toggleTool}>
          <i className="fa fa-align-justify" />
        </button>
        <button name="config" onClick={this.toggleTool}>
          <i className="fa fa-wrench" />
        </button>

        { currentTool && (
          <div className="tool">
            { currentTool === 'status' && <StatusDisplay messages={[]} />}
            { currentTool === 'config' && <Configuration config={[]} />}
          </div>
        )}
      </div>
    );
  }
}

export default connect()(Tools);

