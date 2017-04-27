import React, { Component } from 'react';

class Configuration extends Component {
  render() {
    return (
      <div>
        <h1>Configuration</h1>
        <h2>RunScore</h2>
        <h2>RFID Listener Port</h2>
        <aside>
          RFID Readers should use the IP address of this
           computer and the port listed below in as <b>TagStreamAddress</b>
        </aside>
        <h2>RFID Locations</h2>
        <aside>
          Configure Readers to use TagStreamFormat <b>%i,%N,%T</b>.
           The section below is only needed if you would rather not set
           <b>ReaderName</b> on your readers to match RunScore events.
        </aside>
      </div>
    );
  }
}

// Configuration.propTypes = {

// }

export default Configuration;
