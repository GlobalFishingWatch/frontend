import Pbf from 'pbf'
import { LoaderWithParser } from '@loaders.gl/loader-utils'
import { tableFromArrays, tableFromIPC, tableToIPC } from 'apache-arrow'
import { readParquet, writeParquet, Compression, WriterPropertiesBuilder } from 'parquet-wasm'

export const parquetLoader: LoaderWithParser = {
  name: 'parquet-track',
  module: 'parquet-track',
  options: {},
  id: 'parquet-track-pbf',
  version: 'latest',
  extensions: ['parquet'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: false,
  parse: async (arrayBuffer) => parseTrack(arrayBuffer),
  parseSync: async (arrayBuffer) => parseTrack(arrayBuffer),
}

const getSchemaFieldIndex = (schema, fieldName) => {
  return schema.fields.findIndex((f) => f.name === fieldName)
}

const parseTrack = (parquetBuffer) => {
  const parquetBytes = new Uint8Array(parquetBuffer)
  const decodedArrowBytes = readParquet(parquetBytes)
  const arrowTable = tableFromIPC(decodedArrowBytes)

  try {
    const latColumn = arrowTable.getChildAt(getSchemaFieldIndex(arrowTable.schema, 'lat'))
    const lonColumn = arrowTable.getChildAt(getSchemaFieldIndex(arrowTable.schema, 'lon'))
    const segColumn = arrowTable.getChildAt(getSchemaFieldIndex(arrowTable.schema, 'seg_id'))
    const timestampColumn = arrowTable.getChildAt(
      getSchemaFieldIndex(arrowTable.schema, 'timestamp')
    )
    const segmentIndexes = []
    let currentSegId = ''
    const dataLength = lonColumn.data.reduce((acc, data) => data.length + acc, 0)
    const positions = new Float32Array(dataLength * 2)
    const timestamps = new Float32Array(dataLength)
    let index = 0
    lonColumn.data.forEach((eachData) => {
      eachData.values.forEach((lon) => {
        if (currentSegId !== segColumn.get(index)) {
          segmentIndexes.push(index * 2)
          currentSegId = segColumn.get(index)
        }
        positions[2 * index] = lon
        positions[2 * index + 1] = latColumn.get(index)
        timestamps[index] = timestampColumn.get(index)
        index++
      })
    })

    const data = {
      // Number of geometries
      length: segmentIndexes.length,
      // Indices into positions where each path starts
      startIndices: segmentIndexes,
      // Flat coordinates array
      attributes: {
        getPath: { value: positions, size: 2 },
        getTimestamps: { value: timestamps, size: 1 },
      },
    }

    return data
  } catch (e) {
    console.log('🚀 ~ parseTrack ~ e:', e)
    debugger
  }
}
