import React, { Component } from 'react';

import Status from '../containers/AppStatus';
import Config from '../containers/AppConfig';
import EditEvents from '../containers/AppEditEvents';
import styles from './toolbar.scss';

import { relay } from '../index';
import ButtonBar from './ButtonBar';
import Button from './Button';

import { APP_HEIGHT, APP_WIDTH, APP_EXTENDED_HEIGHT } from '../constants';

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
    const height = currentTool ? (
      APP_EXTENDED_HEIGHT
    ) : (
      APP_HEIGHT
    );
    win.setSize(APP_WIDTH, height, true);

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

  handleOnClickEditEvents = () => {
    this.setState({ currentTool: 'events' });
  }

  handleOnClickConfig = () => {
    this.setState({ currentTool: 'config' });
  }

  render() {
    const { runScoreServerConnected } = this.props;
    const { currentTool } = this.state;

    return (
      <div>
        <ButtonBar>
          <Button
            name="runScoreServer"
            className={runScoreServerConnected ? styles.connected : styles.disconnected}
            title={`${runScoreServerConnected ? 'Connected' : 'Not connected'} to RunScore Server`}
            onClick={this.retryServerConnection}
            isLeftButton
          >
            <i className="fa fa-flash" />
          </Button>
          <Button
            name="rfidServer"
            title="Restart the RFID Reader Server"
            onClick={this.restartRfidServer}
            isLeftButton
          >
            <i className="fa fa-refresh" />
          </Button>
          <Button name="status" onClick={this.toggleTool}>
            <i className="fa fa-align-justify" />
          </Button>
          <Button name="config" onClick={this.toggleTool}>
            <i className="fa fa-wrench" />
          </Button>
        </ButtonBar>
        <div className={styles.toolbar_panel_container}>
          { currentTool && (
            <div className="tool">
              { currentTool === 'status' && <Status />}
              { currentTool === 'config' && <Config onClickEditEvents={this.handleOnClickEditEvents} />}
              { currentTool === 'events' && <EditEvents onClickConfig={this.handleOnClickConfig} />}
            </div>
          )}
        </div>
      </div>
    );
  }
}
