import * as M_CONSTANTS from './messageConstants';
import * as P_CONSTANTS from './parameterConstants';

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

const isTV = (val: string) => parseInt(val[0], 16).toString(2)[0] === '1';

const extractHeader = (str: string, headerConst: Object) => {
  const header = {};
  Object.entries(headerConst).forEach(([name, [start, end]]) => {
    if (name === 'headerType') return;
    header[`${name}`] = str.slice(start, end);
  });
  if (headerConst.headerType === 'tv') {
    header.type = (parseInt(header.type, 16) - 0x80).toString(16);
  }
  return header;
};

const handleTV = (param) => ({
  header: extractHeader(param, TV_PRM_HEADER),
  restOfParam: param.slice(2, param.length)
});

const handleTLV = (param) => ({
  header: extractHeader(param, TLV_PRM_HEADER),
  restOfParam: param.slice(8, param.length)
});

const decode = (msg: Buffer) => {
  const hexMsg = msg.reduce((acc, dec) => (
    acc + (dec < 16 ? `0${dec.toString(16)}` : dec.toString(16))
  ), '');
  return [decodeMessage(hexMsg), hexMsg];
};

const decodeMessage = (msg: string) => {
  const header = extractHeader(msg, MSG_HEADER);
  const restOfMsg = msg.slice(20, msg.length);
  const [name, attrs] = Object.entries(M_CONSTANTS).find(([, val]) => (
    val === parseInt(header.type, 16)
  )) || ['', ''];
  return decodeParameter(restOfMsg, [
    { [`${name}`]: { header, ...attrs } }
  ]);
};

const decodeParameter = (param: string, decodedMessage: Array<Object>) => {
  const { header, restOfParam } = isTV(param) ? handleTV(param) : handleTLV(param);
  const [name, attrs] = Object.entries(P_CONSTANTS).find(([, val]) => (
    val.id === parseInt(header.type, 16)
  )) || ['', ''];
  const paramLength = header.length ? parseInt(header.length, 16) * 2 : attrs.tvLength;
  const decodedParm = { [`${name}`]: { ...header, value: restOfParam.slice(0, paramLength) } };
  if (!param || !name) { return decodedMessage; }
  return decodeParameter(restOfParam.slice(0, restOfParam.length),
    [...decodedMessage, decodedParm]
  );
};

export default decode;
