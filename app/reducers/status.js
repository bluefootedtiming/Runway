// @flow
import {
  ADD_MESSAGE,
  RSSERVER_CONNECTED,
  RSSERVER_NOT_CONNECTED
} from '../actions/status';

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
    case ADD_MESSAGE:
      return {
        ...state,
        messages: state.messages.concat(action.payload)
      };
    case RSSERVER_CONNECTED:
      return {
        ...state,
        runScoreServerConnected: action.payload
      };
    case RSSERVER_NOT_CONNECTED: {
      const newState = Object.assign({}, state);
      delete newState.runScoreServerConnected;
      return newState;
    }
    default:
      return state;
  }
}
