import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { loadConfigurations } from '../actions/config';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadConfigurations }, dispatch);
}

export default connect(null, mapDispatchToProps)(Home);
