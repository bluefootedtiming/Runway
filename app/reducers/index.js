// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import timer from './timer';
import status from './status';

const rootReducer = combineReducers({
  timer,
  router,
  status
});

export default rootReducer;
