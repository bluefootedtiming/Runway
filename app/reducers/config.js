import update from 'immutability-helper';

import {
  SET_RUNSCORE_ADDRESS,
  SET_RUNSCORE_PORT,
  SET_LISTEN_PORT,
  ADD_READER,
  DEL_READER,
  readerType
} from '../actions/config';

export type configStateType = {
  runScoreAddress: string,
  runScorePort: number,
  listenPort: number,
  readerMap: Array<readerType>
};

const initialState = {
  runScoreAddress: '192.168.1.4',
  runScorePort: 3988,
  listenPort: 3988,
  readerMap: []
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

    case ADD_READER:
      return update(state, {
        readerMap: { $push: action.payload }
      });

    case DEL_READER: {
      const index = action.payload;
      return update(state, {
        readerMap: { $splice: [index, 1] }
      });
    }

    default:
      return state;
  }
}
