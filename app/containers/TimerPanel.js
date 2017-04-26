import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Timer from '../components/Timer';
import * as TimerActions from '../actions/timer';

function mapStateToProps(state) {
  const { running, startTime } = state.timer;
  return {
    running,
    startTime
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TimerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
