import { connect } from 'react-redux';
import Toolbar from '../components/ToolBar';

function mapStateToProps(state) {
  return {
    runScoreServerConnected: state.status.runScoreServerConnected
  };
}

export default connect(mapStateToProps)(Toolbar);
