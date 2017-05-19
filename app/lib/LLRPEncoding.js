/**
  * LLRPEncoding.js
  *
  * @fileoverview Holds the methods to encode messages for an LLRP reader
  */

import { Buffer } from 'buffer';

type parameterConstantType = {
  type: number,
  tvLength: number,         // This is the length of the TV parameter
  staticLength: number,     // This is the length of the TLV parameter
  hasSubParameter: boolean
};

type parameterType = {
  parameterConstant: parameterConstantType,
  values: Array<string | number | parameterType>
};

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
export const fill = (total: number, len: number) => (len < total ? '0'.repeat(total - len) : '');

/**
  * calcLength
  *
  * Calculate the number of octets out of hex strings.
  * Round up on odd numbers.
  *
  * @param {Array<string>} args
  *
  * @return {int}
  */
const calcLength = (...args) => {
  const totalLength = args.reduce((acc, arg) => acc + arg.length, 0);
  return parseInt(totalLength / 2, 10) + parseInt(totalLength % 2, 10);
};

/**
  * createLLRPMessage
  *
  * Takes a message type and a list of parameters to create a hex string
  * that can be placed into a buffer and written to an LLRP server.
  *
  * Simply, first octet describe the reserved and version,
  * next octet describe the message type,
  * next 4 octets describe the message length (length of the message value, i.e. all parameters),
  * next 4 octets describe the message ID (this can be left blank unless specifed),
  * and the next variable amount of octets (described by the message length) describes
  * the message value
  *
  * For example, the following is a hex string for: SET_READER_CONFIG:
  * 040300000010000000000000e2000580
  *
  * - ['04'] => 0000 0100 => Version 1
  * - ['03'] => 0000 0010 => SET_READER_CONFIG: 3
  * - ['00000010'] => ... 0001 0000 => Message length => 16 octets
  * - ['00000000'] => ... => Message ID
  * - ['0000e2000580'] => Message Value which is:
  *   - ['00'] => Reserved
  *   - ['00e2000580'] => 0000 0000 1110 0010 0000 0000 0000 0101 1000 0000
  *   -                 => The ReaderEventNotificationSpecParameter which is:
  *     - ['00e2'] => This is the reserved bits and the type (226) EventsAndReports
  *     - ['0005'] => Length => 5 octets
  *     - ['8'] => HoldEventsAndReportsUponReconnect = true
  *
  *
  * @param {number}         id   - Message ID in Hex
  * @param {number}         type - Message PropTypes
  * @param {Array<string>}  parameters - A list of LLRPParameter hex strings
  *
  * @return {Buffer}
  */
export const createLLRPMessage = (id: number, type: number, parameters: Array<string> = []) => {
  const msgType = type.toString(16);
  const resTypeHex = `04${fill(2, msgType.length)}${msgType}`;

  const msgId = id.toString(16);
  const idHex = `${fill(8, msgId.length)}${msgId}`;

  const paramsHex = parameters.reduce((hex, param) => (hex + param), '');

  // An msg with an empty value has length 10 (in octets)
  const msgLength = (calcLength(resTypeHex, idHex, paramsHex) + 4).toString(16);
  const lengthHex = `${fill(8, msgLength.length)}${msgLength}`;

  const msg = `${resTypeHex}${lengthHex}${idHex}${paramsHex}`;

  // Debug
  console.log(`createLLRPMessage, ${type}: ${msg}`);
  return Buffer.from(msg.length % 2 === 0 ? msg : `${msg}0`, 'hex');
};

/**
  * createTLVParam
  *
  * Returns a hex string of an TLV Parameter for a given parameter.
  *
  * Parameters can either be TLV or TV parameters.
  * TLV parameters can contain TV parameters and TV parameters
  * cannot. TLV parameters begin with a 0 in bit 0 and
  * TV parameters begin with a 1 in bit 0
  *
  * For TV parameters, the first bit is set to true
  * the next 7 bits are the Parameter type
  * and the remaining bits contain the paramter value
  *
  * @param {parameterType}        parameter
  * @param {Array<parameterType>}  tvParams
  *
  * @return {string}
  */
export const createTLVParam = (parameter: parameterType) => {
  const { parameterConstant: { type: paramType }, values } = parameter;
  const resTypeHex = `${fill(4, paramType.toString(16).length)}${paramType.toString(16)}`;
  const valuesHex = values ? values.reduce((hex, value) => {
    if (typeof value === 'string') return hex + value;
    const valueHex = value.parameterConstant.tvLength === 0 ? (
      createTLVParam(value)
    ) : (
      createTVParam(value)
    );
    return hex + valueHex;
  }, '') : '';

  // An empty parameter value has length 4 (in octets)
  const paramLength = (calcLength(resTypeHex, valuesHex) + 2).toString(16);
  const lengthHex = `${fill(4, paramLength.length)}${paramLength}`;
  return `${resTypeHex}${lengthHex}${valuesHex}`;
};

/**
  * createTVParam
  *
  * Takes a TV-encoded Parameter and returns a hex string of the parameter.
  *
  * @param {parameterType} parameter
  *
  * @return {string}
  */
const createTVParam = (parameter: parameterType) => {
  const { parameterConstant: { type: paramType }, values } = parameter;
  const resTypeHex = `${fill(2, paramType.toString(16).length)}${paramType.toString(16)}`;
  // In TV Parameters, the first bit must be 1
  const tvBit = resTypeHex[0].toString(16);
  if (tvBit < 0x8) resTypeHex[0] = (tvBit + 0x8).toString(16);

  const valueHex = values ? values.reduce((hex, val) => (hex + val.toString(16)), '') : '';
  return `${resTypeHex}${valueHex}`;
};
