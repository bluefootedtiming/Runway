import React, { Component } from 'react';
import jetpack from 'fs-jetpack';
import telnet from 'telnet-client';
import os from 'os';
import { readerMapType } from '../reducers/config';
import { CONFIG_PATH } from '../constants';

export const notify = (message) => {
  // Unsupported OS
  if (!('Notification' in window)) {
    alert(message); // eslint-disable-line 
  }

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
    readerMap: readerMapType
  }

  state: {
    readerAddresses: Array<string>,
    listenAddresses: Array<string>,
    listenAddress: string
  }

  static defaultProps = {
    readerAddresses: []
  }

  constructor() {
    super();
    this.state = {
      readerAddresses: [],
      listenAddresses: [],
      listenAddress: ''
    };
  }

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
    const readerAddresses = Object.keys(this.props.readerMap).length ? Object.keys(this.props.readerMap) : [''];
    this.setState({
      listenAddress: this.props.listenAddress,
      listenAddresses,
      readerAddresses
    });
  }

  readerConfigs = () => {
    const { listenAddress, listenPort } = this.props;
    return {
      username: 'alien',
      password: 'password',
      AutoMode: 'On',
      NotifyMode: 'Off',
      StreamHeader: 'Off',
      TagStreamFormat: 'Custom',
      TagStreamAddress: `${listenAddress}:${listenPort}`,
      TagStreamCustomFormat: 'RSBI,%I,%T,%N',
    };
  }

  setReader = (e) => {
    const address = e.currentTarget.name.split('set-relay-')[1];
    const { username, password, ...configs } = this.readerConfigs();
    if (!this.props.readerMap[address]) return;

    const conn = new telnet();
    conn.connect({
      host: address,
      shellPrompt: '',
      loginPrompt: /Username(>?)/,
      passwordPrompt: /Password(>?)/,
    });

    conn.exec(username)
    .then(() => (
      conn.exec(password)
      .then(() => (
        Object.keys(configs).forEach(key => {
          console.log(`set ${key}=${configs[key]}`);
          conn.exec(`set ${key}=${configs[key]}`);
        })
      ))
    )).catch(() => (
      console.log('bad')
    ));
    conn.end();
  }

  addReader = () => {
    const { readerAddresses } = this.state;
    if (!readerAddresses.includes('')) {
      this.setState({
        readerAddresses: readerAddresses.concat([''])
      });
    }
  }

  removeReader = (e) => {
    const key = e.currentTarget.name.split('remove-')[1];
    if (this.props.readerMap[key]) this.props.delReader(key);

    const newAddresses = this.state.readerAddresses;
    const index = key === 'new' ? (
      this.state.readerAddresses.indexOf('')
    ) : (
      this.state.readerAddresses.indexOf(key)
    );
    newAddresses.splice(index, 1);
    this.setState({
      readerAddresses: newAddresses
    });
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

    this.state.readerAddresses.forEach(key => {
      const {
        [`address-${key.length > 0 ? key : 'new'}`]: { value: address },
        [`name-${key.length > 0 ? key : 'new'}`]: { value: name }
      } = this;

      if (!name || !address) return;

      if (readerMap[key] === undefined) {
        this.props.addReader({ name, address });
      } else if (address !== key || name !== readerMap[key]) {
        this.props.delReader(key);
        this.props.addReader({ name, address });
      }
    });

    this.setState({ readerAddresses: Object.keys(readerMap) });

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

  readerMapInputFields = (address) => {
    const key = address || 'new';
    return (
      <div key={`reader-${key}`}>
        <input
          placeholder="IP Address"
          defaultValue={address}
          ref={c => (this[`address-${key}`] = c)}
        />
        <input
          placeholder="Location/Event"
          defaultValue={this.props.readerMap[address]}
          ref={c => (this[`name-${key}`] = c)}
        />
        <button
          name={`remove-${key}`}
          style={{ backgroundColor: 'white', margin: 0 }}
          onClick={this.removeReader}
        >
          <i className="fa fa-minus-circle" />
        </button>
        {(key !== 'new') &&
          <button
            name={`set-relay-${key}`}
            style={{ backgroundColor: 'white', margin: 0 }}
            onClick={this.setReader}
          >
            <i className="fa fa-check-circle" />
          </button>
        }
      </div>
    );
  }

  render() {
    const { runScoreAddress, runScorePort, listenPort, listenAddress } = this.props;

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
        <select
          defaultValue={listenAddress}
          onChange={(e) => this.setState({ listenAddress: e.target.value })}
        >
          {this.state.listenAddresses.length > 0 ? (
            this.state.listenAddresses.map(address => (
              <option key={address} value={address}> {address} </option>
            ))) : (
              <option>No valid addresses found.</option>
          )}
        </select>
        <input placeholder="Listen Port" name="listenPort" defaultValue={listenPort} ref={c => (this.listenPort = c)} />
        <h2>
          RFID Locations
          <i className="fa fa-plus-circle" onClick={this.addReader} role="button" />
        </h2>
        <aside>
          Configure Readers to use TagStreamFormat <b>%i,%N,%T</b>.
          The section below is only needed if you would rather not set
          <b>ReaderName</b> on your readers to match RunScore events.
        </aside>
        {this.state.readerAddresses.map(address => this.readerMapInputFields(address))}
        <br />
        <button onClick={this.onSave}>Save Settings</button>
      </section>
    );
  }
}

export default Configuration;
