/**
  * LLRPCommunications.js
  *
  * @fileoverview Holds the methods to communicate to an LLRP reader
  */

import * as messageConsants from './LLRPMessageConstants';
import * as parameterConstatns from './LLRPParameterConstants';

/**
  * fill
  *
  * Given the desired length and the actual length of the string,
  * return either string filled with total - len zeroes, or empty string
  *
  * @param {number} total
  * @param {number} len
  *
  * @return {string}
  */
const fill = (total: number, len: number) => (len < total ? '0'.repeat(total - len) : '');

type MessageOptionsType = {
  id: number,
  version: number
};

/**
  * createLLRPMessage
  *
  * Takes a message type and a list of parameters to create a hex string
  * that can be placed into a buffer and written to an LLRP server.
  *
  * Simply, first 2 octets describe the reserved and version,
  * next 2 octets describe the message type,
  * next 8 octets describe the message length (length of the message value, i.e. all parameters),
  * next 8 octets describe the message ID (this can be left blank unless specifed),
  * and the next variable amount of octets (described by the message length) describes
  * the message value
  *
  * For example, the following is a hex string for: SET_READER_CONFIG:
  * 040300000010000000000000e2000580
  *
  * - ['04'] => 0000 0100 => Version 1
  * - ['03'] => 0000 0010 => SET_READER_CONFIG: 3
  * - ['00000010'] => ... 0000 0001 0000 0000 => Message length = 64 bits/12 octets
  * - ['00000000'] => ... => Message ID 
  * - ['0000e2000580'] => Message Value which is:
  *   - ['00'] => Reserved
  *   - ['00e2000580'] => 0000 0000 1110 0010 0000 0000 0000 0101 1000 0000
  *   -                 => The ReaderEventNotificationSpecParameter which is:
  *     - ['00e2'] => This is the reserved bits and the type (226) EventsAndReports
  *     - ['0005'] => Length
  *     - ['8'] => HoldEventsAndReportsUponReconnect = true
  *
  *
  * @param {number}         type - Message PropTypes
  * @param {Array<string>}  parameters - A list of LLRPParameter hex strings
  * @param {MessageOptionsType}
  *
  * @return {Buffer}
  */
export const createLLRPMessage = (type: number,
                                  parameters: Array<string>,
                                  options: MessageOptionsType = {}) => {
  // Initialize with ver 1
  let message = '04';

  // Concat the type
  const typeHex = type ? type.toString(16) : '';
  message += `${fill(2, typeHex.length)}${typeHex}`;

  // Concat the value length
  const lengthHex = parameters.length ? (
    parameters.reduce((total, param) => (param.length + total), 0).toString(16)
  ) : '';
  message += `${fill(8, lengthHex.length)}${lengthHex}`;

  // Optional Message ID value (the 0s are necessary)
  const idHex = options.id ? options.id.toString(16) : '';
  message += `${fill(8, idHex.length)}${idHex}`;

  // Concat any and all params (assuming they are correct)
  parameters.forEach(param => { message += param; });
  return Buffer.from(message, 'hex');
};

type ParameterType = {
  type: number,
  hasSubParameter: boolean,
  tvLength: number,
  staticLength: number
};

type SubParamType = {
  type: ParameterType,
  value: number | string
};

/**
  * createLLRPParameter
  *
  * Returns a hex string of an LLRP Parameter for a given paramType.
  *
  * Parameters can either be TLV or TV parameters.
  * TLV parameters can contain TV parameters and TV parameters
  * cannot. Whether the parameter has a subvalue or not does not
  * decide whether it is a TLV or TV parameter. We do know if it
  * is if it has been called from the nested call.
  *
  * For TLV parameters, the first 1 & 1/2 octets are reserved
  * the next 2 & 1/2 octets are the Parameter type
  * the next 4 octets are the Parameter length (the total length of the parameter value)
  * the remaining bits contain the parameter value.
  *
  * For TV parameters, the first bit is set to true
  * the next 7 bits are the Parameter type
  * and the remaining bits contain the paramter value
  *
  * @param {ParameterType}        paramType
  * @param {string|number}        value
  * @param {Array<SubParamType>}  subParams
  *
  * @return {string}
  */
export const createLLRPParameter = (paramType: ParameterType,
                                    value: string | number,
                                    subParams: Array<SubParamType> = [],
                                    isSubParam: boolean = false) => {
  // Add the rest of the resereved octet & type octets
  let parameter;
  const typeHex = paramType.type.toString(16);
  if (isSubParam) {
    parameter = `${fill(2, typeHex.length)}`;

    const tvBit = parameter[0].toString(16);
    if (tvBit < 0x8) parameter[0] = (tvBit + 0x8).toString(16);
  } else {
    parameter = `0${fill(3, typeHex.length)}`;
  }
  parameter += typeHex;

  // check subParameters
  let subParamHexStr = '';
  if (paramType.hasSubParameter && subParams.length) {
    subParams.forEach(param => {
      subParamHexStr += createLLRPParameter(param.type, param.value);
    });
  }

  const lengthHex = subParamHexStr.length.toString(16);
  parameter += `${fill(4, lengthHex.length)}${lengthHex}`;

  return parameter;
};
