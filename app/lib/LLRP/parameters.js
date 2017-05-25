import * as properties from './properties';
import * as constants from './parameterConstants';


export type propertyType = {
  name: string,
  value: string,
  length: string
};

export type parameterConstantType = {
  id: number,
  tvLength: number,         // This is the length of the TV parameter
  staticLength: number,     // This is the length of the TLV parameter
  hasSubParameter: boolean
};

export type parameterType = {
  type: parameterConstantType,
  args: Array<parameterType | propertyType>
};

// =====================
//  Defining Parameters
// =====================

/**
 * initArgs
 *
 * Takes all the avaiable keys in values and runs functions on them
 * if they are listed in the array.
 *
 * @param {Object} values
 * @param {Array<function>} args
 */
const initArgs = (values, args) => (
  args.filter(arg => values[`${arg.name}`] !== undefined)
    .map(arg => arg(values[`${arg.name}`]))
);

/**
 * ROSpecStartTrigger
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function ROSpecStartTrigger(values) {
  return {
    type: constants.ROSpecStartTrigger,
    args: initArgs(values, [
      properties.ROSpecStartTriggerType,
    ])
  };
}

/**
 * ROSpecStopTrigger
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function ROSpecStopTrigger(values) {
  return {
    type: constants.ROSpecStopTrigger,
    args: initArgs(values, [
      properties.ROSpecStopTriggerType,
      properties.DurationTriggerValue
    ])
  };
}

/**
 * ROBoundarySpec
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function ROBoundarySpec(values) {
  return {
    type: constants.ROBoundarySpec,
    args: initArgs(values, [
      ROSpecStartTrigger,
      ROSpecStopTrigger
    ])
  };
}

/**
 * AISpecStopTrigger
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function AISpecStopTrigger(values) {
  return {
    type: constants.AISpecStopTrigger,
    args: initArgs(values, [
      properties.AISpecStopTriggerType,
      properties.DurationTriggerValue
    ])
  };
}

/**
 * InventoryParameterSpec
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function InventoryParameterSpec(values) {
  return {
    type: constants.InventoryParameterSpec,
    args: initArgs(values, [
      properties.InventoryParameterSpecID,
      properties.ProtocolID,
    ])
  };
}

/**
 * AISpec
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function AISpec(values) {
  return {
    type: constants.AISpec,
    args: initArgs(values, [
      properties.AntennaCount,
      properties.AntennaID,
      AISpecStopTrigger,
      InventoryParameterSpec
      // AntennaConfigParam
      // CustomParam
    ])
  };
}

/**
 * TagReportContentSelector
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function TagReportContentSelector(values) {
  return {
    type: constants.TagReportContentSelector,
    args: initArgs(values, [
      properties.TagReportContentSelectorValue,
      C1G2EPCMemorySelector,
    ])
  };
}

/**
 * C1G2EPCMemorySelector
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function C1G2EPCMemorySelector(values) {
  return {
    type: constants.C1G2EPCMemorySelector,
    args: initArgs(values, [
      properties.C1G2EPCMemorySelectorValue
    ])
  };
}

/**
 * ROReportSpec
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function ROReportSpec(values) {
  return {
    type: constants.ROReportSpec,
    args: initArgs(values, [
      properties.ROReportTrigger,
      properties.ROReportTriggerNValue,
      TagReportContentSelector,
      Custom
    ])
  };
}

/**
 * ROSpec
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function ROSpec(values) {
  return {
    type: constants.ROSpec,
    args: initArgs(values, [
      properties.ROSpecID,
      properties.ROSpecPriority,
      properties.ROSpecCurrentState,
      ROBoundarySpec,
      AISpec,
      ROReportSpec
    ])
  };
}


/**
 * EventsAndReports
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function EventsAndReports(values) {
  return {
    type: constants.EventsAndReports,
    args: initArgs(values, [
      properties.EventsAndReports
    ])
  };
}

/**
 * Custom
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export function Custom(values) {
  return {
    type: constants.Custom,
    args: initArgs(values, [
      properties.VendorID,
      properties.Subtype,
      properties.VendorParameterValue
    ])
  };
}
