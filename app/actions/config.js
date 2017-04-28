export const SET_RUNSCORE_ADDRESS = 'SET_RUNSCORE_ADDRESS';
export const SET_RUNSCORE_PORT = 'SET_RUNSCORE_PORT';
export const SET_LISTEN_PORT = 'SET_LISTEN_PORT';
export const ADD_READER = 'ADD_READER';
export const DEL_READER = 'DEL_READER';
export type readerType = { name: string, address: string };

export function setRunScoreAddress(address: string) {
  return {
    type: SET_RUNSCORE_ADDRESS,
    payload: address
  };
}

export function setRunScorePort(port: number) {
  return {
    type: SET_RUNSCORE_PORT,
    payload: port
  };
}

export function setListenPort(port: number) {
  return {
    type: SET_LISTEN_PORT,
    payload: port
  };
}

export function addReader(reader: readerType) {
  return {
    type: ADD_READER,
    payload: reader
  };
}

export function delReader(address: string) {
  return {
    type: DEL_READER,
    payload: address
  };
}
