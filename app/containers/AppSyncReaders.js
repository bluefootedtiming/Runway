import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SyncReaders from '../components/SyncReaders';
import { addMessage } from '../actions/status';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addMessage }, dispatch);
}

export default connect(null, mapDispatchToProps)(SyncReaders);
