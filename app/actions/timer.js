export const START_TIMER = 'START_TIMER';
export const STOP_TIMER = 'STOP_TIMER';

export function startTimer(startTime: number) {
  return {
    type: START_TIMER,
    payload: startTime
  };
}

export function stopTimer() {
  return {
    type: STOP_TIMER
  };
}
