export const LOAD_CONFIGURATIONS = 'LOAD_CONFIGURATIONS';
export const SET_RUNSCORE_ADDRESS = 'SET_RUNSCORE_ADDRESS';
export const SET_RUNSCORE_PORT = 'SET_RUNSCORE_PORT';
export const SET_LISTEN_ADDRESS = 'SET_LISTEN_ADDRESS';
export const SET_LISTEN_PORT = 'SET_LISTEN_PORT';
export const ADD_READER = 'ADD_READER';
export const DEL_READER = 'DEL_READER';
export const ADD_EVENT = 'ADD_EVENT';
export const DEL_EVENT = 'DEL_EVENT';
export type readerType = { name: string, address: string };
export type configurationsType = {
  runScoreAddress?: string,
  runScorePort?: number,
  listenAddress?: string,
  listenPort?: number,
  readerMap?: { [string]: string },
  events?: [?string]
};

export function loadConfigurations(config: configurationsType) {
  return {
    type: LOAD_CONFIGURATIONS,
    payload: config
  };
}

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

export function setListenAddress(address: string) {
  return {
    type: SET_LISTEN_ADDRESS,
    payload: address
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

export function addEvent(event: string) {
  return {
    type: ADD_EVENT,
    payload: event
  };
}

export function delEvent(event: string) {
  return {
    type: DEL_EVENT,
    payload: event
  };
}
