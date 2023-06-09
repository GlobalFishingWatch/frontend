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

const parseTrack = (parquetBuffer) => {
  debugger
  const parquetBytes = new Uint8Array(parquetBuffer)
  const decodedArrowBytes = readParquet(parquetBytes)
  const arrowTable = tableFromIPC(decodedArrowBytes)

  const PATH_DATA = [
    {
      path: [
        [-122.4, 37.7],
        [-122.5, 37.8],
        [-122.6, 37.85],
      ],
      name: 'Richmond - Millbrae',
      color: [255, 0, 0],
    },
  ]
  const positions = new Float64Array(PATH_DATA.map((d) => d.path).flat(2))
  // The color attribute must supply one color for each vertex
  // [255, 0, 0, 255, 0, 0, 255, 0, 0, ...]
  const colors = new Uint8Array(PATH_DATA.map((d) => d.path.map((_) => d.color)).flat(2))
  // The "layout" that tells PathLayer where each path starts
  const startIndices = new Uint16Array(
    PATH_DATA.reduce(
      (acc, d) => {
        const lastIndex = acc[acc.length - 1]
        acc.push(lastIndex + d.path.length)
        return acc
      },
      [0]
    )
  )

  const exampleData = {
    length: PATH_DATA.length,
    startIndices: startIndices, // this is required to render the paths correctly!
    attributes: {
      getPath: { value: positions, size: 2 },
      getColor: { value: colors, size: 3 },
    },
  }

  try {
    const segmentIndex = arrowTable.schema.fields.findIndex((f) => f.name === 'seg_id')
    const latIndex = arrowTable.schema.fields.findIndex((f) => f.name === 'lat')
    const lonIndex = arrowTable.schema.fields.findIndex((f) => f.name === 'lon')
    const latColumn = arrowTable.getChildAt(latIndex)
    const lonColumn = arrowTable.getChildAt(lonIndex)
    const segmentIndexes = arrowTable
      .getChildAt(segmentIndex)
      .data[0].valueOffsets.map((value) => value * 2)
    const positions = new Float64Array(lonColumn.data[0].length * 2).map((_, i) => {
      const latLon = i % 2 ? lonColumn : latColumn
      return latLon.data[0].values[i]
    })
    const data = {
      // Number of geometries
      length: arrowTable.numRows,
      // Indices into positions where each path starts
      startIndices: segmentIndexes,
      // Flat coordinates array
      attributes: {
        getPath: { value: positions, size: 2 },
      },
    }
    debugger
    return data
  } catch (e) {
    console.log('🚀 ~ parseTrack ~ e:', e)
    debugger
  }
}
