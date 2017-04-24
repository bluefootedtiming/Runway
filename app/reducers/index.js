// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import timer from './timer';

const rootReducer = combineReducers({
  timer,
  router
});

export default rootReducer;
