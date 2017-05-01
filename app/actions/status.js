import moment from 'moment';

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const RSSERVER_CONNECTED = 'RSSERVER_CONNECTED';
export const RSSERVER_NOT_CONNECTED = 'RSSERVER_NOT_CONNECTED';

const MESSAGE_TYPES = [
  'INFO', 'ERROR'
];

export function addMessage(message: string, code: number = 0) {
  return {
    type: ADD_MESSAGE,
    payload: `[${MESSAGE_TYPES[code]}] ${moment().format('hh:mm:ss')}> ${message}`
  };
}

export function setRSServerConnection(status: boolean) {
  return status ? {
    type: RSSERVER_CONNECTED,
    payload: true
  } : {
    type: RSSERVER_NOT_CONNECTED
  };
}
