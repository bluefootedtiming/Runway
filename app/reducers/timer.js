import { START_TIMER, STOP_TIMER } from '../actions/timer';

export type timerStateType = {
  startTime?: number,
  running: boolean
};

type actionType = {
  type: string
};

const initialState = {
  running: false
};

export default function timer(state: timerStateType = initialState, action: actionType) {
  switch (action.type) {
    case START_TIMER:
      return {
        startTime: action.payload,
        running: true
      };
    case STOP_TIMER:
      return {
        running: false
      };
    default:
      return state;
  }
}
