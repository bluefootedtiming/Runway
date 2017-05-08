import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EditEvents from '../components/EditEvents';
import * as ConfigActions from '../actions/config';

function mapStateToProps(state) {
  const { events } = state.config;
  return { events };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ConfigActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEvents);
