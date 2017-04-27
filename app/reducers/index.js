// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import timer from './timer';
import status from './status';
import config from './config';

const rootReducer = combineReducers({
  config,
  timer,
  router,
  status
});

export default rootReducer;
