import React, { Component } from 'react';
import { readerMapType } from '../reducers/config';

class Configuration extends Component {
  props: {
    setRunScoreAddress: () => void,
    setRunScorePort: () => void,
    setListenPort: () => void,
    runScoreAddress: string,
    runScorePort: number,
    listenPort: number,
    readerMap: readerMapType
  }

  addReader = () => {

  }

  onSave = () => {
    const {
      runScoreAddress: { value: runScoreAddress },
      runScorePort: { value: runScorePort },
      listenPort: { value: listenPort }
    } = this;

    if (runScoreAddress) { this.props.setRunScoreAddress(runScoreAddress); }
    if (runScorePort) { this.props.setRunScorePort(Number(runScorePort)); }
    if (listenPort) { this.props.setListenPort(Number(listenPort)); }
  }

  render() {
    const { runScoreAddress, runScorePort, listenPort, readerMap } = this.props;

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
        {/*
        <h2>
          RFID Locations
          <i className="fa fa-plus-circle" onClick={this.addReader} role="button" />
        </h2>
        <aside>
          Configure Readers to use TagStreamFormat <b>%i,%N,%T</b>.
          The section below is only needed if you would rather not set
          <b>ReaderName</b> on your readers to match RunScore events.
        </aside>
        {Object.keys(readerMap).map(address => (
          <div key={`reader-${address}`}>
            <input
              placeholder="IP Address"
              defaultValue={address}
              ref={c => (this[`address-${address}`] = c)}
            />
            <input
              placeholder="Location/Event"
              defaultValue={readerMap[address]}
              ref={c => (this[`name-${address}`] = c)}
            />
            <i className="fa fa-minus-circle" />
          </div>
        ))}
        */}
        <br />
        <button onClick={this.onSave}>Save Settings</button>
      </section>
    );
  }
}

export default Configuration;
