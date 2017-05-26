import * as constants from './messageConstants';
import Parameters from './parameters';
import Properties from './properties';
import { createLLRPMessage } from './encode';

export const addROSpec = () => (
  createLLRPMessage({
    id: 0x55,
    type: constants.ADD_ROSPEC,
    args: [
      Parameters.ROSpec({
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
            DurationTriggerValue: '0'
          },
          InventoryParameterSpec: {
            InventoryParameterSpecID: '9',
            ProtocolID: '1'
          }
        },
        ROReportSpec: {
          ROReportTrigger: '1',
          ROReportTriggerNValue: '1',
          TagReportContentSelector: {
            TagReportContentSelectorValue: '0000',
            // C1G2EPCMemorySelector: {
            //   C1G2EPCMemorySelectorValue: 'c0'
            // },
          // },
          // Custom: {
          //   VendorID: '67ba',
          //   Subtype: '8e',
          //   VendorParameterValue: '1',
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
    args: [Properties.ROSpecID('1')]
  })
);

export const startROSpec = () => (
  createLLRPMessage({
    id: 0x77,
    type: constants.START_ROSPEC,
    args: [Properties.ROSpecID('1')]
  })
);

export const deleteROSpec = () => (
  createLLRPMessage({
    id: 0x771,
    type: constants.DELETE_ROSPEC,
    args: [Properties.ROSpecID('1')]
  })
);

export const getReaderConfig = () => (
  createLLRPMessage({
    id: 0x88,
    type: constants.GET_READER_CONFIG,
    args: [
      Properties.AntennaID('0'),
      Properties.RequestedData('0'),
      Properties.GPIPortNumber('0'),
      Properties.GPOPortNumber('0')
    ]
  })
);

export const setReaderConfig = () => (
  createLLRPMessage({
    id: 0x99,
    type: constants.SET_READER_CONFIG,
    args: [
      Properties.Reserved(4),
      Properties.EventsAndReports('8')
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

export const keepAliveAck = () => (
  createLLRPMessage({
    id: 0x12,
    type: constants.KEEPALIVE_ACK,
    args: []
  })
);

export const getReport = () => (
  createLLRPMessage({
    id: 0x13,
    type: constants.GET_REPORT,
    args: []
  })
);
