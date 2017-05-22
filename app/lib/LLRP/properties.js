import { fillAndConcat, binToHex } from './encode';

type propertyType = {
  name?: string,
  value: string | Array<number>, // Hex or Bit Array
  length: number // Length of the entire prop in bits
};

// =====================
//  Defining Properties
// =====================

const initProp = (value: string | Array<number> | null, base: string, length: number) => {
  const hexLength = length / 4;
  switch (base) {
    case 'hex':
      return {
        value: fillAndConcat(hexLength, value),
        length
      };
    case 'bin':
      return value.length % 2 === 0 && {
        value: fillAndConcat(hexLength, binToHex(value)),
        length
      };
    default:
      console.error('PropertyError: Base not set.');
      return null;
  }
};

/**
 * Reserved
 *
 * Used for any reserved bits inside of a parameter
 *
 * @param {number} length
 */
export const Reserved = (length) => ({
  name: 'Reserved',
  ...initProp('0', 'hex', length)
});

export const ROSpecCurrentState = (value) => ({
  name: 'ROSpecCurrentState',
  ...initProp(value, 'hex', 8)
});

export const ROSpecPriority = (value) => ({
  name: 'ROSpecPriority',
  ...initProp(value, 'hex', 8)
});

export const ROSpecID = (value) => ({
  name: 'ROSpecID',
  ...initProp(value, 'hex', 32)
});

export const ROSpecStartTriggerType = (value) => ({
  name: 'ROSpecStartTriggerType',
  ...initProp(value, 'hex', 8)
});

export const ROSpecStopTriggerType = (value) => ({
  name: 'ROSpecStopTriggerType',
  ...initProp(value, 'hex', 8)
});

export const DurationTriggerValue = (value) => ({
  name: 'DurationTriggerValue',
  ...initProp(value, 'hex', 32)
});

export const AntennaCount = (value) => ({
  name: 'AntennaCount',
  ...initProp(value, 'hex', 16)
});

export const AntennaID = (value) => ({
  name: 'AntennaID',
  ...initProp(value, 'hex', 16)
});

export const AISpecStopTriggerType = (value) => ({
  name: 'AISpecStopTriggerType',
  ...initProp(value, 'hex', 8)
});

export const InventoryParameterSpecID = (value) => ({
  name: 'InventoryParameterSpecID',
  ...initProp(value, 'hex', 16)
});

export const ProtocolID = (value) => ({
  name: 'ProtocolID',
  ...initProp(value, 'hex', 8)
});

export const ROReportTrigger = (value) => ({
  name: 'ROReportTrigger',
  ...initProp(value, 'hex', 8)
});

export const ROReportTriggerNValue = (value) => ({
  name: 'ROReportTriggerNValue',
  ...initProp(value, 'hex', 16)
});

export const TagReportContentSelectorValue = (value) => ({
  name: 'TagReportContentSelectorValue',
  ...initProp(value, 'hex', 16)
});

export const C1G2EPCMemorySelectorValue = (value) => ({
  name: 'C1G2EPCMemorySelectorValue',
  ...initProp(value, 'hex', 8)
});

export const GPIPortNumber = (value) => ({
  name: 'GPIPortNumber',
  ...initProp(value, 'hex', 8)
});

export const GPOPortNumber = (value) => ({
  name: 'GPOPortNumber',
  ...initProp(value, 'hex', 8)
});

export const RequestedData = (value) => ({
  name: 'RequestedData',
  ...initProp(value, 'hex', 4)
});

export const EventsAndReports = (value) => ({
  name: 'EventsAndReports',
  ...initProp(value, 'hex', 2)
});
