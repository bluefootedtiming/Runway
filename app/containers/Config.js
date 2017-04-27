import { connect } from 'react-redux';
import Config from '../components/Config';

function mapStateToProps(state) {
  const { runScoreAddress, runScorePort, readerMap } = state.config;
  return {
    runScoreAddress,
    runScorePort,
    readerMap
  };
}

export default connect(mapStateToProps)(Config);
