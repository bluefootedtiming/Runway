import * as M_CONSTANTS from './messageConstants';
import * as P_CONSTANTS from './parameterConstants';

const tagStream = '043d000000fa0000000000f000398daa05c783a36b57473e06c0dd89000000018e00008a00008100018600870000820005502228faf9c08400055032b00d4c08800b00f000398daaa0441a727ae67278c07c89000000018e00008a0000810001860087000082000550223f7d03c88400055032b00d4c088000500f0003f8dddd96313b9bbf085b4c104e89000000018e00008a0000810001860087000082000550226841c8488400055032b00d4c08800058b00008c000000f0003f8dddc61e206ac4bbc437f91089000000018e00008a0000810001860087000082000550226841c8488400055032b00d4c08800058b00008c0000';

export const testDecode = () => (console.log(decodeMessage(tagStream)));

const MSG_HEADER = {
  headerType: 'msg',
  version: [0, 2],
  type: [2, 4],
  length: [4, 12],
  id: [12, 20]
};

const TLV_PRM_HEADER = {
  headerType: 'tlv',
  reserved: [0, 1],
  type: [1, 4],
  length: [4, 8]
};

const TV_PRM_HEADER = {
  headerType: 'tv',
  type: [0, 2]
};

const extractHeader = (str: string, headerConst: object) => {
  const header = {};
  Object.entries(headerConst).forEach(([name, [start, end]]) => {
    if (name !== 'headerType') {
      const value = str.slice(start, end);
      header[`${name}`] = value;
    }
  });
  if (headerConst.headerType === 'tv') header.type = (parseInt(header.type, 16) - 0x80).toString(16);
  return header;
};

export const decode = (msg: Buffer) => (
  decodeMessage(msg.reduce((acc, dec) => (
    acc + (dec < 10 ? `0${dec.toString(16)}` : dec.toString(16))
  ), ''))
);

const decodeMessage = (msg: string) => {
  console.log(msg);
  const msgHeader = extractHeader(msg, MSG_HEADER);
  const restOfMsg = msg.slice(20, msg.length);
  switch (parseInt(msgHeader.type, 16)) {
    case M_CONSTANTS.RO_ACCESS_REPORT:
      return decodeParameter(restOfMsg, [
        { RO_ACCESS_REPORT: msgHeader }
      ]);
    default:
      return null;
  }
};

const handleTV = (param) => ({
  header: extractHeader(param, TV_PRM_HEADER),
  restOfParam: param.slice(2, param.length)
});

const handleTLV = (param) => ({
  header: extractHeader(param, TLV_PRM_HEADER),
  restOfParam: param.slice(8, param.length)
});

const isTV = (val: string) => parseInt(val[0], 16).toString(2)[0] === '1';

const decodeParameter = (param: string, decodedMessage: array) => {
  if (!param) return decodedMessage;
  const { header, restOfParam } = isTV(param) ? handleTV(param) : handleTLV(param);
  const [name, attrs] = Object.entries(P_CONSTANTS).find(([, val]) => (
    val.id === parseInt(header.type, 16)
  )) || ['', ''];
  let paramLength = 0;
  if (attrs.tvLength) {
    paramLength = (attrs.tvLength - 1) * 2;
  } else if (attrs.staticLength) {
    paramLength = (attrs.staticLength - 1) * 2;
  }
  return isTV(param) ?
    decodeParameter(restOfParam.slice(paramLength, restOfParam.length), [
      ...decodedMessage,
      { [`${name}`]: { ...header, length: paramLength, value: restOfParam.slice(0, paramLength) } }
    ])
  :
    decodeParameter(restOfParam, [
      ...decodedMessage,
      { [`${name}`]: { ...header, length: paramLength } }
    ]);
};
