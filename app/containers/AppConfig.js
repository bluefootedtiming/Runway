import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Config from '../components/Config';
import * as ConfigActions from '../actions/config';

function mapStateToProps(state) {
  const { runScoreAddress, runScorePort, listenPort, readerMap } = state.config;
  return {
    runScoreAddress,
    runScorePort,
    listenPort,
    readerMap
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ConfigActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Config);
