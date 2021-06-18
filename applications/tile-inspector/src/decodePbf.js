// Use this tool to convert a protobuf tile to an 4wings intArray

import Protobuf from 'pbf'

const decodePbf = (data) => {
  const readField = function (tag, obj, pbf) {
    if (tag === 1) pbf.readPackedVarint(obj.data)
  }
  const read = function (pbf, end) {
    return pbf.readFields(readField, { data: [] }, end)
  }
  const pbfData = new Protobuf(data)
  const intArray = read(pbfData)
  return intArray && intArray.data
}

export default decodePbf
