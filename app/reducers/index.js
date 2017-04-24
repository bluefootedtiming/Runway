// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import timer from './timer';

const rootReducer = combineReducers({
  timer,
  counter,
  router,
});

export default rootReducer;
