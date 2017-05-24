import * as constants from './messageConstants';
import * as parameters from './parameters';
import * as properties from './properties';
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
            AISpecStopTriggerType: '1',
            DurationTriggerValue: '3e8'
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
            TagReportContentSelectorValue: '0000',
            C1G2EPCMemorySelector: {
              C1G2EPCMemorySelectorValue: 'c0'
            },
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
    args: [properties.ROSpecID('1')]
  })
);

export const startROSpec = () => (
  createLLRPMessage({
    id: 0x77,
    type: constants.START_ROSPEC,
    args: [properties.ROSpecID('1')]
  })
);

export const deleteROSpec = () => (
  createLLRPMessage({
    id: 0x771,
    type: constants.DELETE_ROSPEC,
    args: [properties.ROSpecID('1')]
  })
);

export const getReaderConfig = () => (
  createLLRPMessage({
    id: 0x88,
    type: constants.GET_READER_CONFIG,
    args: [
      properties.AntennaID('0'),
      properties.RequestedData('0'),
      properties.GPIPortNumber('0'),
      properties.GPOPortNumber('0')
    ]
  })
);

export const setReaderConfig = () => (
  createLLRPMessage({
    id: 0x99,
    type: constants.SET_READER_CONFIG,
    args: [
      properties.Reserved(4),
      properties.EventsAndReports('8')
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
