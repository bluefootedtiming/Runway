import React, { Component } from 'react';

import Status from '../containers/AppStatus';
import Config from '../containers/AppConfig';
import styles from './toolbar.scss';
import { relay } from '../index';

const { BrowserWindow } = require('electron').remote;

// import * as ConfigureActions from '../actions/configure';

export default class Tools extends Component {
  props: {
    runScoreServerConnected?: boolean
  }

  state: {
    currentTool?: string
  }

  static defaultProps = {
    runScoreServerConnected: false
  }

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
    const height = currentTool ? 500 : 200;
    win.setSize(400, height, true);

    this.setState({ currentTool });
  }

  retryServerConnection = () => {
    if (!this.props.runScoreServerConnected) {
      relay.connectToRSServer();
    }
  }

  restartRfidServer = () => {
    relay.startRfidListener();
  }

  render() {
    const { runScoreServerConnected } = this.props;
    const { currentTool } = this.state;

    return (
      <div>
        <div className={styles.toolbar_button_container} >
          <div className={styles.left_buttons}>
            <button
              name="runScoreServer"
              className={runScoreServerConnected ? styles.connected : styles.disconnected}
              title={`${runScoreServerConnected ? 'Connected' : 'Not connected'} to RunScore Server`}
              onClick={this.retryServerConnection}
            >
              <i className="fa fa-flash" />
            </button>
            <button
              name="rfidServer"
              title="Restart the RFID Reader Server"
              onClick={this.restartRfidServer}
            >
              <i className="fa fa-refresh" />
            </button>
          </div>
          <div>
            <button name="status" onClick={this.toggleTool}>
              <i className="fa fa-align-justify" />
            </button>
            <button name="config" onClick={this.toggleTool}>
              <i className="fa fa-wrench" />
            </button>
          </div>
        </div>
        <div className={styles.toolbar_panel_container}>
          { currentTool && (
            <div className="tool">
              { currentTool === 'status' && <Status />}
              { currentTool === 'config' && <Config />}
            </div>
          )}
        </div>
      </div>
    );
  }
}
