import React, { Component } from 'react';
import { readerMapType } from '../reducers/config';

class Configuration extends Component {
  props: {
    setRunScoreAddress: () => void,
    setRunScorePort: () => void,
    setListenPort: () => void,
    addReader: () => void,
    delReader: () => void,
    runScoreAddress: string,
    runScorePort: number,
    listenPort: number,
    readerMap: readerMapType
  }

  state: {
    readerAddresses: Array<string>
  }

  static defaultProps = {
    readerAddresses: []
  }

  constructor() {
    super();
    this.state = {
      readerAddresses: []
    };
  }

  componentWillMount() {
    const vals = Object.keys(this.props.readerMap).length ? (
      Object.keys(this.props.readerMap)
    ) : (
      ['']
    );
    this.setState({ readerAddresses: vals });
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
      props: { readerMap }
    } = this;

    if (runScoreAddress) { this.props.setRunScoreAddress(runScoreAddress); }
    if (runScorePort) { this.props.setRunScorePort(Number(runScorePort)); }
    if (listenPort) { this.props.setListenPort(Number(listenPort)); }

    this.state.readerAddresses.forEach(key => {
      if (!this[`address-${key}`] || !this[`name-${key}`]) {
        this.props.addReader({
          address: this['address-new'].value,
          name: this['name-new'].value
        });
      } else if (this[`address-${key}`].value.address !== key
        || this[`name-${key}`].value.name !== readerMap[key]) {
        this.props.delReader(key);
        this.props.addReader({
          address: this[`address-${key}`].value,
          name: this[`name-${key}`].value
        });
      }
    });
    this.setState({ readerAddresses: Object.keys(readerMap) });
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
      </div>
    );
  }

  render() {
    const { runScoreAddress, runScorePort, listenPort } = this.props;

    return (
      <section>
        <h1>Configuration</h1>

        <h2>RunScore</h2>
        <input placeholder="Address" name="runScoreAddress" defaultValue={runScoreAddress} ref={c => (this.runScoreAddress = c)} />
        <input placeholder="Port" name="runScorePort" defaultValue={runScorePort} ref={c => (this.runScorePort = c)} />

        <h2>RFID Listen Port</h2>
        <aside>
          RFID Readers should use the IP address of this
          computer and the port listed below in as <b>TagStreamAddress</b>
        </aside>
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
