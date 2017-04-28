import moment from 'moment';

export const ADD_MESSAGE = 'ADD_MESSAGE';

const MESSAGE_TYPES = [
  'INFO', 'ERROR'
];

export function addMessage(message: string, code: number = 0) {
  return {
    type: ADD_MESSAGE,
    payload: `[${MESSAGE_TYPES[code]}] ${moment().format('hh:mm:ss')}> ${message}`
  };
}
