import React, { Component } from 'react';
import jetpack from 'fs-jetpack';
import os from 'os';

import { readerMapType, eventsType } from '../../actions/config';
import { CONFIG_PATH } from '../Home';

import SyncReaders from '../../containers/AppSyncReaders';

import DropdownSelect from '../DropdownSelect';
import ReaderMapForm from '../ReaderMapForm';
import ButtonBar from '../ButtonBar';
import Button from '../Button';

import styles from './Config.scss';


export const notify = (message) => {
  // Unsupported OS
  if (!('Notification' in window)) alert(message); // eslint-disable-line 

  const notification = new Notification(message); // eslint-disable-line
  notification.onclick = () => notification.close();
};

class Configuration extends Component {
  props: {
    onClickEditEvents: () => void,
    setRunScoreAddress: () => void,
    setRunScorePort: () => void,
    setListenAddress: () => void,
    setListenPort: () => void,
    setReaderMap: () => void,
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
      readerMap: [{ address: '', event: '' }],
      listenAddresses: [],
      listenAddress: ''
    };
  }

  /**
    * Grab the ipv4 addresses--except for the localhost. These values fill the
    * alien runway address dropdown.
    */
  componentWillMount() {
    const listenAddresses = [];
    const netInterfaces = os.networkInterfaces();
    Object.keys(netInterfaces).forEach(key => (
      netInterfaces[key].forEach(({ address, family }) => {
        if (address !== '127.0.0.1' && family === 'IPv4') {
          listenAddresses.push(address);
        }
      })
    ));
    const listenAddress = listenAddresses.includes(this.props.listenAddress) ? (
      this.props.listenAddress
    ) : (
      listenAddresses[0]
    );
    this.setState({
      listenAddress,
      listenAddresses,
      readerMap: this.props.readerMap
    });
    if (this.state.readerMap.length === 0) this.handleAddReader();
  }

  componentWillUpdate() {
    if (this.state.readerMap.length === 0) this.handleAddReader();
  }

  handleAddReader = () => {
    if (this.state.readerMap.findIndex(({ address }) => address === '') < 0) {
      this.setState({
        readerMap: [{ address: '', event: '', isLLRP: true }, ...this.state.readerMap]
      });
    }
  }

  handleChangeReaderValue = (name, key, newVal) => {
    const index = this.state.readerMap.findIndex(({ address }) => address === key);
    const newMap = [...this.state.readerMap];
    newMap[index][`${name}`] = newVal;
    this.setState({ readerMap: newMap });
  }

  handleRemoveReader = (key) => {
    const index = this.state.readerMap.findIndex(({ address }) => address === key);
    const newMap = [...this.state.readerMap];
    newMap.splice(index, 1);
    this.setState({ readerMap: newMap });
  }

  onSave = () => {
    const {
      runScoreAddress: { value: runScoreAddress },
      runScorePort: { value: runScorePort },
      listenPort: { value: listenPort },
      state: { listenAddress },
      props: { events }
    } = this;

    if (runScoreAddress) { this.props.setRunScoreAddress(runScoreAddress); }
    if (runScorePort) { this.props.setRunScorePort(Number(runScorePort)); }
    if (listenAddress) { this.props.setListenAddress(this.state.listenAddress); }
    if (listenPort) { this.props.setListenPort(Number(listenPort)); }

    const readerMap = this.state.readerMap.filter(({ address, event }) => address && event);
    this.props.setReaderMap(readerMap);
    this.setState({ readerMap });

    jetpack.write(
      CONFIG_PATH,
      {
        runScoreAddress,
        runScorePort,
        listenAddress,
        listenPort,
        readerMap,
        events
      }
    );
    notify('Conifgurations saved!');
  }

  render() {
    const { runScoreAddress, runScorePort, events } = this.props;

    return (
      <section style={styles.input}>
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
          defaultValue={this.state.listenAddress}
          options={this.state.listenAddresses}
          onChange={(e) => this.setState({ listenAddress: e.target.value })}
          placeHolder="No valid addresses found."
        />
        <input placeholder="Listen Port" name="listenPort" defaultValue={this.props.listenPort} ref={c => (this.listenPort = c)} />
        <h2>
          RFID Readers
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
          onChangeValue={this.handleChangeReaderValue}
          onRemoveReader={this.handleRemoveReader}
        />
        <small>
          **Note: Uncheck reader if nonLLRP
        </small>
        <br />
        <ButtonBar>
          <Button onClick={this.onSave} isLeftButton>
            Save Configurations
          </Button>
          <Button onClick={this.props.onClickEditEvents} isLeftButton>
            Edit Events
          </Button>
          <SyncReaders
            listenAddress={this.props.listenAddress}
            listenPort={this.props.listenPort}
            readerMap={this.props.readerMap}
          />
        </ButtonBar>
      </section>
    );
  }
}

export default Configuration;
