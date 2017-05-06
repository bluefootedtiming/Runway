import React, { Component } from 'react';
import jetpack from 'fs-jetpack';
import os from 'os';

import { readerMapType, eventsType } from '../reducers/config';
import { CONFIG_PATH } from '../constants';

import DropdownSelect from './DropdownSelect';
import ReaderMapForm from './ReaderMapForm';
import SyncReaders from './SyncReaders';
import ButtonBar from './ButtonBar';
import Button from './Button';

const { BrowserWindow } = require('electron').remote;

export const notify = (message) => {
  // Unsupported OS
  if (!('Notification' in window)) alert(message); // eslint-disable-line 

  const notification = new Notification(message); // eslint-disable-line
  notification.onclick = () => notification.close();
};

class Configuration extends Component {
  props: {
    setRunScoreAddress: () => void,
    setRunScorePort: () => void,
    setListenAddress: () => void,
    setListenPort: () => void,
    addReader: () => void,
    delReader: () => void,
    runScoreAddress: string,
    runScorePort: number,
    listenAddress: string,
    listenPort: number,
    readerMap: readerMapType,
    events: eventsType
  }

  state: {
    readerMap: readerMapType,
    listenAddresses: Array<string>,
    listenAddress: string
  }

  constructor() {
    super();
    this.state = {
      readerMap: {},
      listenAddresses: [],
      listenAddress: ''
    };
  }

  /**
    * Grab the ipv4 addresses--except for the localhost. These values fill the
    * alien runway address dropdown.
    */
  componentWillMount() {
    const netInterfaces = os.networkInterfaces();
    const listenAddresses = [];
    Object.keys(netInterfaces).forEach(key => (
      netInterfaces[key].forEach(({ address, family }) => {
        if (address !== '127.0.0.1' && family === 'IPv4') {
          listenAddresses.push(address);
        }
      })
    ));
    const readerMap = Object.assign({}, this.props.readerMap);
    this.setState({
      listenAddress: this.props.listenAddress,
      listenAddresses,
      readerMap
    });
  }

  handleEditEvents = () => {
    let win = new BrowserWindow({ widht: 400, height: 400 });
    win.on('closed', () => {
      win = null;
    });

    // Load a remote URL
    win.loadURL('https://github.com');
  }

  handleAddReader = () => {
    if (!this.state.readerMap['']) {
      this.setState({
        readerMap: { ...this.state.readerMap, '': '' }
      });
    }
  }

  handleChangeAddress = (prevAddress, newAddress) => {
    const newReaderMap = Object.assign({}, this.state.readerMap);
    const event = newReaderMap[prevAddress];
    delete newReaderMap[prevAddress];
    this.setState({ readerMap: { ...newReaderMap, [`${newAddress}`]: event } });
  }

  handleChangeEvent = (address, event) => {
    this.setState({ readerMap: { ...this.state.readerMap, [`${address}`]: event } });
  }

  handleRemoveReader = (address) => {
    const { [`${address}`]: removedAddress, ...newReaderMap } = this.state.readerMap;
    this.setState({ readerMap: newReaderMap });
  }

  onSave = () => {
    const {
      runScoreAddress: { value: runScoreAddress },
      runScorePort: { value: runScorePort },
      listenPort: { value: listenPort },
      state: { listenAddress },
      props: { readerMap }
    } = this;

    if (runScoreAddress) { this.props.setRunScoreAddress(runScoreAddress); }
    if (runScorePort) { this.props.setRunScorePort(Number(runScorePort)); }
    if (listenPort) { this.props.setListenPort(Number(listenPort)); }
    if (listenAddress !== this.props.listenAddress) { this.props.setListenAddress(listenAddress); }

    // Delete removed readers
    Object.keys(readerMap).forEach(address => {
      this.props.delReader(address);
    });
    // Add new readers & save edited readers
    Object.entries(this.state.readerMap).forEach(([address, event]) => {
      if (!event || !address) return;
      this.props.addReader({ name: event, address });
    });
    this.setState({ readerMap: Object.assign({}, readerMap) });

    jetpack.write(
      CONFIG_PATH,
      {
        runScoreAddress,
        runScorePort,
        listenAddress,
        listenPort,
        readerMap
      }
    );
    notify('Conifgurations saved!');
  }

  render() {
    const { runScoreAddress, runScorePort, listenPort, listenAddress, events } = this.props;

    return (
      <section>
        <h1>Configuration</h1>

        <h2>RunScore</h2>
        <input placeholder="Address" name="runScoreAddress" defaultValue={runScoreAddress} ref={c => (this.runScoreAddress = c)} />
        <input placeholder="Port" name="runScorePort" defaultValue={runScorePort} ref={c => (this.runScorePort = c)} />

        <h2>Alien Runway</h2>
        <aside>
          RFID Readers should use the IP address of this
          computer and the port listed below in as <b>TagStreamAddress</b>
        </aside>
        <DropdownSelect
          defaultValue={listenAddress}
          options={this.state.listenAddresses}
          onChange={(e) => this.setState({ listenAddress: e.target.value })}
          placeHolder="No valid addresses found."
        />
        <input placeholder="Listen Port" name="listenPort" defaultValue={listenPort} ref={c => (this.listenPort = c)} />
        <h2>
          RFID Locations
          <i className="fa fa-plus-circle" onClick={this.handleAddReader} role="button" />
        </h2>
        <aside>
          Configure Readers to use TagStreamFormat <b>%i,%N,%T</b>.
          The section below is only needed if you would rather not set
          <b>ReaderName</b> on your readers to match RunScore events.
        </aside>
        <ReaderMapForm
          readerMap={this.state.readerMap}
          eventList={events}
          onChangeAddress={this.handleChangeAddress}
          onChangeEvent={this.handleChangeEvent}
          onRemoveReader={this.handleRemoveReader}
        />
        <br />
        <ButtonBar>
          <Button onClick={this.onSave} isLeftButton>
            Save Configurations
          </Button>
          <Button onClick={this.handleEditEvents} isLeftButton>
            Edit Events
          </Button>
          <SyncReaders
            listenAddress={listenAddress}
            listenPort={listenPort}
            readerMap={this.props.readerMap}
          />
        </ButtonBar>
      </section>
    );
  }
}

export default Configuration;
