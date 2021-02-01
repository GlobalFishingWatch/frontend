// Use this tool to convert a protobuf tile to an 4wings intArray

import Protobuf from "pbf";
import * as fs from 'fs';

const decodeProto = data => {
  const readField = function(tag, obj, pbf) {
      if (tag === 1) pbf.readPackedVarint(obj.data);
  };
  const read = function(pbf, end) {
      return pbf.readFields(readField, { data: [] }, end);
  };
  const pbfData = new Protobuf(data);
  const intArray = read(pbfData);
  return intArray && intArray.data;
};

const data = fs.readFileSync('./test323.pbf')
const int16ArrayBuffer = decodeProto(data);
console.log(JSON.stringify(int16ArrayBuffer))