import Properties from './properties';
import * as constants from './parameterConstants';

export type propertyType = {
  name: string,
  value: string,
  length: number
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
  args.filter(arg => values[`${arg.name}`])
    .map(arg => arg(values[`${arg.name}`]))
);
export default class Parameters {
  /**
    * ROSpecStartTrigger
    *
    * @param {Object} values
    * @returns {parameterType}
    */
  static ROSpecStartTrigger(values) {
    return {
      type: constants.ROSpecStartTrigger,
      args: initArgs(values, [
        Properties.ROSpecStartTriggerType,
      ])
    };
  }

  /**
    * ROSpecStopTrigger
    *
    * @param {Object} values
    * @returns {parameterType}
    */
  static ROSpecStopTrigger(values) {
    return {
      type: constants.ROSpecStopTrigger,
      args: initArgs(values, [
        Properties.ROSpecStopTriggerType,
        Properties.DurationTriggerValue
      ])
    };
  }

  /**
    * ROBoundarySpec
    *
    * @param {Object} values
    * @returns {parameterType}
    */
  static ROBoundarySpec(values) {
    return {
      type: constants.ROBoundarySpec,
      args: initArgs(values, [
        Parameters.ROSpecStartTrigger,
        Parameters.ROSpecStopTrigger
      ])
    };
  }

  /**
    * AISpecStopTrigger
    *
    * @param {Object} values
    * @returns {parameterType}
    */
  static AISpecStopTrigger(values) {
    return {
      type: constants.AISpecStopTrigger,
      args: initArgs(values, [
        Properties.AISpecStopTriggerType,
        Properties.DurationTriggerValue
      ])
    };
  }

  /**
    * InventoryParameterSpec
    *
    * @param {Object} values
    * @returns {parameterType}
    */
  static InventoryParameterSpec(values) {
    return {
      type: constants.InventoryParameterSpec,
      args: initArgs(values, [
        Properties.InventoryParameterSpecID,
        Properties.ProtocolID,
      ])
    };
  }

  /**
    * AISpec
    *
    * @param {Object} values
    * @returns {parameterType}
    */
  static AISpec(values) {
    return {
      type: constants.AISpec,
      args: initArgs(values, [
        Properties.AntennaCount,
        Properties.AntennaID,
        Parameters.AISpecStopTrigger,
        Parameters.InventoryParameterSpec
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
  static TagReportContentSelector(values) {
    return {
      type: constants.TagReportContentSelector,
      args: initArgs(values, [
        Properties.TagReportContentSelectorValue,
        Parameters.C1G2EPCMemorySelector,
      ])
    };
  }

  /**
    * C1G2EPCMemorySelector
    *
    * @param {Object} values
    * @returns {parameterType}
    */
  static C1G2EPCMemorySelector(values) {
    return {
      type: constants.C1G2EPCMemorySelector,
      args: initArgs(values, [
        Properties.C1G2EPCMemorySelectorValue
      ])
    };
  }

  /**
    * ROReportSpec
    *
    * @param {Object} values
    * @returns {parameterType}
    */
  static ROReportSpec(values) {
    return {
      type: constants.ROReportSpec,
      args: initArgs(values, [
        Properties.ROReportTrigger,
        Properties.ROReportTriggerNValue,
        Parameters.TagReportContentSelector,
        Parameters.Custom
      ])
    };
  }

  /**
    * ROSpec
    *
    * @param {Object} values
    * @returns {parameterType}
    */
  static ROSpec(values) {
    return {
      type: constants.ROSpec,
      args: initArgs(values, [
        Properties.ROSpecID,
        Properties.ROSpecPriority,
        Properties.ROSpecCurrentState,
        Parameters.ROBoundarySpec,
        Parameters.AISpec,
        Parameters.ROReportSpec
      ])
    };
  }


  /**
    * EventsAndReports
    *
    * @param {Object} values
    * @returns {parameterType}
    */
  static EventsAndReports(values) {
    return {
      type: constants.EventsAndReports,
      args: initArgs(values, [
        Properties.EventsAndReports
      ])
    };
  }

  /**
    * Custom
    *
    * @param {Object} values
    * @returns {parameterType}
    */
  static Custom(values) {
    return {
      type: constants.Custom,
      args: initArgs(values, [
        Properties.VendorID,
        Properties.Subtype,
        Properties.VendorParameterValue
      ])
    };
  }
}
