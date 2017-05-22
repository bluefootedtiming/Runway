/**
  * encode.js
  *
  * @fileoverview Holds the methods to encode messages for an LLRP reader
  */

import { Buffer } from 'buffer';
import { fillAndConcat } from './properties';
import { parameterType } from './parameters';

const hexFill = (total: number, val: string | number) => (
  fillAndConcat(total, val.toString(16))
);

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
  * @param {number}         id   - Message ID in Hex
  * @param {number}         type - Message PropTypes
  * @param {Array<string|parameterType>}  parameters - A list of LLRPParameter hex strings
  *
  * @return {Buffer}
  */
export const createLLRPMessage = ({ id, type, args = [] }) => {
  const resTypeHex = `04${hexFill(2, type)}`;
  const idHex = hexFill(8, id);
  const paramsHex = args.reduce((hex, arg) => {
    const argHex = typeof arg !== 'string' ? (
      createTLVParam(arg)
    ) : arg;
    console.log(arg, argHex);
    return hex + argHex;
  }, '');

  // An msg with an empty value has length 10 (in octets)
  const msgLength = (calcLength(resTypeHex, idHex, paramsHex) + 4);
  const lengthHex = hexFill(8, msgLength);

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
  *
  * @return {string}
  */
export const createTLVParam = (parameter: parameterType) => {
  const { type: { id }, args } = parameter;
  const resTypeHex = hexFill(4, id);
  const valuesHex = args ? args.filter(x => x).reduce((hex, arg) => {
    if (arg.type) return hex + (arg.type.tvLength === 0 ? createTLVParam(arg) : createTVParam(arg));
    return hex + arg.value;
  }, '') : '';

  // An empty parameter value has length 4 (in octets)
  const paramLength = (calcLength(resTypeHex, valuesHex) + 2);
  const lengthHex = hexFill(4, paramLength);
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
  const { type: { id }, values } = parameter;
  const resTypeHex = hexFill(2, id);
  // In TV Parameters, the first bit must be 1
  const tvBit = resTypeHex[0].toString(16);
  if (tvBit < 0x8) resTypeHex[0] = (tvBit + 0x8).toString(16);

  const valueHex = values ? values.reduce((hex, val) => (hex + val.toString(16)), '') : '';
  return `${resTypeHex}${valueHex}`;
};
