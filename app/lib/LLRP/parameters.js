import * as properties from './properties';
import * as constants from './parameterConstants';


type parameterConstantType = {
  id: number,
  tvLength: number,         // This is the length of the TV parameter
  staticLength: number,     // This is the length of the TLV parameter
  hasSubParameter: boolean
};

type parameterType = {
  type: parameterConstantType,
  args: Array<parameterType | propertyType>
};

// =====================
//  Defining Parameters
// =====================

/**
 * ROSpecStartTrigger
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export const ROSpecStartTrigger = (values) => ({
  type: constants.ROSpecStartTrigger,
  args: [
    properties.ROSpecStartTriggerType(values.ROSpecStartTriggerType),
  ]
});

/**
 * ROSpecStopTrigger
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export const ROSpecStopTrigger = (values) => ({
  type: constants.ROSpecStopTrigger,
  args: [
    properties.ROSpecStopTriggerType(values.ROSpecStopTriggerType),
    properties.DurationTriggerValue(values.DurationTriggerValue)
  ]
});

/**
 * ROBoundarySpec
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export const ROBoundarySpec = (values) => ({
  type: constants.ROBoundarySpec,
  args: [
    ROSpecStartTrigger(values.ROSpecStartTrigger),
    ROSpecStopTrigger(values.ROSpecStopTrigger)
  ]
});

/**
 * AISpecStopTrigger
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export const AISpecStopTrigger = (values) => ({
  type: constants.AISpecStopTrigger,
  args: [
    properties.AISpecStopTriggerType(values.AISpecStopTriggerType),
    properties.DurationTriggerValue(values.DurationTriggerValue)
  ]
});

/**
 * InventoryParameterSpec
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export const InventoryParameterSpec = (values) => ({
  type: constants.InventoryParameterSpec,
  args: [
    properties.InventoryParameterSpecID(values.InventoryParameterSpecID),
    properties.ProtocolID(values.ProtocolID),
  ]
});

/**
 * AISpec
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export const AISpec = (values) => ({
  type: constants.AISpec,
  args: [
    properties.AntennaCount(values.AntennaCount),
    values.AntennaID && properties.AntennaID(values.AntennaID),
    AISpecStopTrigger(values.AISpecStopTrigger),
    InventoryParameterSpec(values.InventoryParameterSpec)
    // AntennaConfigParam
    // CustomParam
  ]
});

/**
 * TagReportContentSelector
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export const TagReportContentSelector = (values) => ({
  type: constants.TagReportContentSelector,
  args: [
    properties.TagReportContentSelectorValue(values.TagReportContentSelectorValue)
  ]
});

/**
 * C1G2EPCMemorySelector
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export const C1G2EPCMemorySelector = (values) => ({
  type: constants.C1G2EPCMemorySelector,
  args: [
    properties.C1G2EPCMemorySelectorValue(values.C1G2EPCMemorySelectorValue)
  ]
});

/**
 * ROReportSpec
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export const ROReportSpec = (values) => ({
  type: constants.ROReportSpec,
  args: [
    properties.ROReportTrigger(values.ROReportTrigger),
    properties.ROReportTriggerNValue(values.ROReportTriggerNValue),
    TagReportContentSelector(values.TagReportContentSelector),
    C1G2EPCMemorySelector(values.C1G2EPCMemorySelector)
  ]
});

/**
 * ROSpec
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export const ROSpec = (values) => ({
  type: constants.ROSpec,
  args: [
    properties.ROSpecID(values.ROSpecID),
    properties.ROSpecPriority(values.ROSpecPriority),
    properties.ROSpecCurrentState(values.ROSpecCurrentState),
    ROBoundarySpec(values.ROBoundarySpec),
    AISpec(values.AISpec),
    ROReportSpec(values.ROReportSpec)
  ]
});


/**
 * EventsAndReports
 *
 * @param {Object} values
 * @returns {parameterType}
 */
export const EventsAndReports = (values) => ({
  type: constants.EventsAndReports,
  args: [
    properties.EventsAndReports(values.EventsAndReports)
  ]
});
