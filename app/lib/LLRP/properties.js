/**
  * fill
  *
  * Given the desired length and the actual length of the string,
  * return either string filled with total - len zeroes, or empty string
  *
  * @param {number} total
  * @param {string|number} val
  *
  * @return {string}
  */
export const fill = (total: number, val: string | number) => {
  const valHexLen = (typeof val === 'number') ? val : val.length;
  return valHexLen < total ? '0'.repeat(total - valHexLen) : '';
};

/**
  * fillAndConcat
  *
  * Similar to fill except it appends the val to the end
  *
  * @param {number} total
  * @param {string} val
  *
  * @return {string}
  */
export const fillAndConcat = (total: number, val: string) => (
  val.length ? (
    `${fill(total, val.toString())}${val}`
  ) : (
    fill(total, val)
  )
);

/**
  * binToHex
  *
  * Take an array of binary numbers and converts to hex.
  * The length must be evenly divisble by 4 (4 bits = 1 hex)
  *
  * @param {Array<number>} bin
  *
  * @return {string}
  */
export const binToHex = (bin: Array<number>) => (bin.length % 4 === 0 && parseInt(bin.join(''), 2).toString(16));

// =====================
//  Defining Properties
// =====================
// Reminder: 1 octet = 4 hex digits = 8 bits

const initProp = (value: string | Array<number> | null, base: string, length: number) => {
  if (!value) return { value: '', length };
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
  ...initProp(value, 'hex', 16)
});

export const GPOPortNumber = (value) => ({
  name: 'GPOPortNumber',
  ...initProp(value, 'hex', 16)
});

export const RequestedData = (value) => ({
  name: 'RequestedData',
  ...initProp(value, 'hex', 8)
});

export const EventsAndReports = (value) => ({
  name: 'EventsAndReports',
  ...initProp(value, 'hex', 2)
});

export const VendorID = (value) => ({
  name: 'VendorID',
  ...initProp(value, 'hex', 32)
});

export const Subtype = (value) => ({
  name: 'Subtype',
  ...initProp(value, 'hex', 32)
});

export const VendorParameterValue = (value) => ({
  name: 'VendorParameterValue',
  ...initProp(value, 'hex', 8)
});
