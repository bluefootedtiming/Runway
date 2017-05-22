import * as constants from './messageConstants';
import * as parameters from './parameters';
import { createLLRPMessage } from './encode';

export const addROSpec = () => (
  createLLRPMessage({
    id: 0x55,
    type: constants.ADD_ROSPEC,
    args: [
      parameters.ROSpec({
        ROSpecID: '1',
        ROSpecPriority: '0',
        ROSpecCurrentState: '0',
        ROBoundarySpec: {
          ROSpecStartTrigger: {
            ROSpecStartTriggerType: '0'
          },
          ROSpecStopTrigger: {
            ROSpecStopTriggerType: '0',
            DurationTriggerValue: '0'
          }
        },
        AISpec: {
          AntennaCount: '1',
          AntennaID: '0',
          AISpecStopTrigger: {
            AISpecStopTriggerType: '0',
            DurationTriggerValue: 'e38'
          },
          InventoryParameterSpec: {
            InventoryParameterSpecID: '1',
            ProtocolID: '1'
          }
        },
        ROReportSpec: {
          ROReportTrigger: '1',
          ROReportTriggerNValue: '0',
          TagReportContentSelector: {
            TagReportContentSelectorValue: 'ffc0'
          },
          C1G2EPCMemorySelector: {
            C1G2EPCMemorySelectorValue: 'c0'
          }
        }
      })
    ]
  })
);

export const enableROSpec = () => (
  createLLRPMessage({
    id: 0x66,
    type: constants.ENABLE_ROSPEC,
    args: [
      parameters.ROSpecID('1')
    ]
  })
);

export const startROSpec = () => (
  createLLRPMessage({
    id: 0x77,
    type: constants.START_ROSPEC,
    args: [
      parameters.ROSpecID('1')
    ]
  })
);

export const getReaderConfig = () => (
  createLLRPMessage({
    id: 0x88,
    type: constants.GET_READER_CONFIG,
    args: [
      parameters.AntennaID('0'),
      parameters.RequestedData('0'),
      parameters.GPIPortNumber('0'),
      parameters.GPOPortNumber('0')
    ]
  })
);

export const setReaderConfig = () => (
  createLLRPMessage({
    id: 0x99,
    type: constants.SET_READER_CONFIG,
    args: [
      parameters.Reserved(4),
      parameters.EventsAndReports('8')
    ]
  })
);

export const enableEventsAndReports = () => (
  createLLRPMessage({
    id: 0x11,
    type: constants.ENABLE_EVENTS_AND_REPORTS,
    args: []
  })
);
