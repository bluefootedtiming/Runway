// @flow
import { ADD_MESSAGE } from '../actions/status';

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
        messages: state.messages.concat(action.payload)
      };
    default:
      return state;
  }
}
