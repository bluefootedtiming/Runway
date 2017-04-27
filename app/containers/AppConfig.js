import { connect } from 'react-redux';
import Config from '../components/Config';

function mapStateToProps(state) {
  const { runScoreAddress, runScorePort, listenPort, readerMap } = state.config;
  return {
    runScoreAddress,
    runScorePort,
    listenPort,
    readerMap
  };
}

export default connect(mapStateToProps)(Config);
