import React, { Component } from 'react';

import Status from '../containers/AppStatus';
import Config from '../containers/AppConfig';
import styles from './toolbar.scss';

const { BrowserWindow } = require('electron').remote;

// import * as ConfigureActions from '../actions/configure';

export default class Tools extends Component {
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
    const tool = e.currentTarget.name;
    const { currentTool: previousTool } = this.state;
    const currentTool = tool === previousTool ? null : tool;

    const win = BrowserWindow.fromId(1);
    const width = currentTool ? 500 : 200;
    win.setSize(400, width, true);

    this.setState({ currentTool });
  }

  render() {
    const { currentTool } = this.state;

    return (
      <div className={styles.container} >
        <div className={styles.buttons}>
          <button name="status" onClick={this.toggleTool}>
            <i className="fa fa-align-justify" />
          </button>
          <button name="config" onClick={this.toggleTool}>
            <i className="fa fa-wrench" />
          </button>
        </div>

        { currentTool && (
          <div className="tool">
            { currentTool === 'status' && <Status />}
            { currentTool === 'config' && <Config />}
          </div>
        )}
      </div>
    );
  }
}
