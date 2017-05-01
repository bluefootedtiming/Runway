import {
  SET_RUNSCORE_ADDRESS,
  SET_RUNSCORE_PORT,
  SET_LISTEN_PORT,
  ADD_READER,
  DEL_READER
} from '../actions/config';

export type readerMapType = { [string]: string };

export type configStateType = {
  runScoreAddress: string,
  runScorePort: number,
  listenPort: number,
  readerMap: readerMapType
};

const initialState = {
  runScoreAddress: '192.168.1.4',
  runScorePort: 3988,
  listenPort: 3988,
  readerMap: {
    '192.168.1.100': 'START',
    '192.168.1.102': 'FINISH'

  }
};

export default function config(state: configStateType = initialState, action) {
  switch (action.type) {
    case SET_RUNSCORE_ADDRESS:
      return {
        ...state,
        runScoreAddress: action.payload
      };

    case SET_RUNSCORE_PORT:
      return {
        ...state,
        runScorePort: action.payload
      };

    case SET_LISTEN_PORT:
      return {
        ...state,
        listenPort: action.payload
      };

    case ADD_READER: {
      const { name, address } = action.payload;
      const newState = Object.assign({}, state);
      newState.reader[address] = name;
      return newState;
    }

    case DEL_READER: {
      const newState = Object.assign({}, state);
      delete newState.readerMap[action.payload];
      return newState;
    }

    default:
      return state;
  }
}
