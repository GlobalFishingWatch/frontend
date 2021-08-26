#!/usr/bin/env node

// Use this tool to convert a protobuf tile to an 4wings intArray

import * as fs from 'fs'
import Protobuf from 'pbf'

const args = process.argv.slice(2)
const file = args[0]

const decodeProto = (data) => {
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

const data = fs.readFileSync(file)
const int16ArrayBuffer = decodeProto(data)
console.info(JSON.stringify(int16ArrayBuffer))
