import { connect } from 'react-redux';
import Status from '../components/Status';

function mapStateToProps(state) {
  return {
    messages: state.messages
  };
}

export default connect(mapStateToProps)(Status);
