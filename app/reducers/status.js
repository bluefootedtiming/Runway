// @flow
import { ADD_MESSAGE } from '../actions/status';

export type statusStateType = {
  messages: Array<string>
};

type actionType = {
  type: string,
  payload: ?string
};

const initialState = {
  messages: ['Started']
};

export default function status(state: statusStateType = initialState, action: actionType) {
  console.log(action);
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        messages: state.messages.concat(action.payload)
      };
    default:
      return state;
  }
}
