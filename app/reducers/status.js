// @flow
import * as Actions from '../actions/status';

export type statusStateType = {
  messages: Array<string>
};

type actionType = {
  type: string,
  payload: ?any // eslint-disable-line
};

const initialState = {
  messages: []
};

export default function status(state: statusStateType = initialState, action: actionType) {
  switch (action.type) {
    case Actions.ADD_MESSAGE:
      return {
        messages: state.messages.concat(action.payload)
      };
    case Actions.RSSERVER_CONNECTED:
      return {
        ...state,
        runScoreServerConnected: action.payload
      };
    case Actions.RSSERVER_NOT_CONNECTED: {
      const newState = Object.assign({}, state);
      delete newState.runScoreServerConnected;
      return newState;
    }
    default:
      return state;
  }
}
