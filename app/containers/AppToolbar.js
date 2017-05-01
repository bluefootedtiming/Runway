import { connect } from 'react-redux';
import Toolbar from '../components/Toolbar';

function mapStateToProps(state) {
  return {
    runScoreServerConnected: state.status.runScoreServerConnected
  };
}

export default connect(mapStateToProps)(Toolbar);
