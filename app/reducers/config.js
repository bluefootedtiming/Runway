import {
  LOAD_CONFIGURATIONS,
  SET_RUNSCORE_ADDRESS,
  SET_RUNSCORE_PORT,
  SET_LISTEN_ADDRESS,
  SET_LISTEN_PORT,
  ADD_READER,
  DEL_READER,
  ADD_EVENT,
  DEL_EVENT
} from '../actions/config';

export type readerMapType = { [string]: string };
export type eventsType = [?string];

export type configStateType = {
  runScoreAddress: string,
  runScorePort: number,
  listenAddress: string,
  listenPort: number,
  readerMap: readerMapType,
  events: eventsType
};

const initialState = {
  runScoreAddress: '192.168.1.4',
  runScorePort: 3988,
  listenAddress: '192.168.1.5',
  listenPort: 3988,
  readerMap: {
    // '192.168.1.100': 'START',
    // '192.168.1.102': 'FINISH'
  },
  events: []
};

export default function config(state: configStateType = initialState, action) {
  switch (action.type) {
    case LOAD_CONFIGURATIONS:
      return {
        ...state,
        ...action.payload
      };
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

    case SET_LISTEN_ADDRESS:
      return {
        ...state,
        listenAddress: action.payload
      };

    case SET_LISTEN_PORT:
      return {
        ...state,
        listenPort: action.payload
      };

    case ADD_READER: {
      const { name, address } = action.payload;
      const newState = Object.assign({}, state);
      newState.readerMap[address] = name;
      return newState;
    }

    case DEL_READER: {
      const newState = Object.assign({}, state);
      delete newState.readerMap[action.payload];
      return newState;
    }

    case ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload]
      };

    case DEL_EVENT: {
      const index = state.events.indexOf(action.payload);
      const newevents = state.events.slice();
      newevents.splice(index, 1);
      return {
        ...state,
        events: newevents
      };
    }

    default:
      return state;
  }
}
