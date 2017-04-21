// @flow
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';

type actionType = {
  type: string,
  payload: string
};

export type statusStateType = {
  messages: Array<string>
};

const initialState = {
  messages: ['Started']
};

export default function counter(state: statusStateType = initialState, action: actionType) {
  switch (action.type) {
    case ADD_STATUS:
      return state + 1;
    case CLEAR_STATUS:
      return state - 1;
    default:
      return state;
  }
}
