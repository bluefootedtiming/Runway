import {
  LOAD_CONFIGURATIONS,
  SET_RUNSCORE_ADDRESS,
  SET_RUNSCORE_PORT,
  SET_LISTEN_ADDRESS,
  SET_LISTEN_PORT,
  SET_READER_MAP,
  ADD_READER,
  DEL_READER,
  ADD_EVENT,
  DEL_EVENT,
  configurationsType
} from '../actions/config';

const initialState = {
  runScoreAddress: '192.168.1.4',
  runScorePort: 3988,
  listenAddress: '192.168.1.5',
  listenPort: 3988,
  readerMap: [],
  events: []
};

export default function config(state: configurationsType = initialState, action) {
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

    case SET_READER_MAP:
      return {
        ...state,
        readerMap: action.payload
      };

    case ADD_READER: {
      return {
        ...state,
        readerMap: state.readerMap.concat(action.payload)
      };
    }

    case DEL_READER: {
      return {
        ...state,
        readerMap: state.readerMap.filter(({ address }) => address !== action.payload)
      };
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
