import { LoaderWithParser } from '@loaders.gl/loader-utils'
import {
  FeatureParams,
  generateUniqueId,
  getCellCoordinates,
  getCellWidth,
} from 'layers/fourwings-gpu/fourwingsTileParser'
import Pbf from 'pbf'
import {
  CELL_END_INDEX,
  CELL_NUM_INDEX,
  CELL_START_INDEX,
  CELL_VALUES_START_INDEX,
  FEATURE_CELLS_START_INDEX,
} from '../../loaders/constants'

export type BBox = [number, number, number, number]

function sinh(arg) {
  return (Math.exp(arg) - Math.exp(-arg)) / 2
}

function tileToLng(x, z) {
  return (x * 360) / Math.pow(2, z) - 180
}

function tileToLat(y, z) {
  return Math.atan(sinh(Math.PI - (y * 2 * Math.PI) / Math.pow(2, z))) * (180 / Math.PI)
}

function getTileIndex(url: string) {
  return url
    .split('/')
    .slice(-3)
    .map((i) => parseInt(i)) as [number, number, number]
}

function getTileBBox(url: string): BBox {
  const [z, x, y] = getTileIndex(url)
  const north = tileToLat(y, z)
  const west = tileToLng(x, z)
  const south = tileToLat(y + 1, z)
  const east = tileToLng(x + 1, z)
  return [west, south, east, north]
}

export const fourwingsGPULoader: LoaderWithParser = {
  name: 'fourwings',
  module: 'fourwings',
  options: {},
  id: '4Wings-pbf',
  version: 'latest',
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream'],
  worker: false,
  parse: async (arrayBuffer, { baseUri }) => {
    const bbox = getTileBBox(baseUri)
    const index = getTileIndex(baseUri)
    return parseFourWings(arrayBuffer, { bbox, index })
  },
  parseSync: async (arrayBuffer, { baseUri }) => {
    const bbox = getTileBBox(baseUri)
    const index = getTileIndex(baseUri)
    return parseFourWings(arrayBuffer, { bbox, index })
  },
}

function readData(_, data, pbf) {
  data.push(pbf.readPackedVarint())
}

const getDate = (day) => {
  return day * 1000 * 60 * 60 * 24
}
const getTimeseries = (startFrame, values) => {
  return values.map((v, i) => ({
    value: v,
    timestamp: getDate(i + startFrame),
  }))
}

type GetCellArayParams = Pick<FeatureParams, 'tileBBox' | 'numCols' | 'numRows'> & {
  tileIndex: [number, number, number]
}
const getCellArrays = (intArray, sublayerCount = 1, params: GetCellArayParams) => {
  const cells: GPUCell[] = []
  let cellNum = 0
  let startFrame = 0
  let endFrame = 0
  let startIndex = 0
  let endIndex = 0
  let indexInCell = 0
  const domainX = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
  const domainY = [0, Number.NEGATIVE_INFINITY]
  for (let i = FEATURE_CELLS_START_INDEX; i < intArray.length; i++) {
    const value = intArray[i]
    if (indexInCell === CELL_NUM_INDEX) {
      startIndex = i
      cellNum = value
    } else if (indexInCell === CELL_START_INDEX) {
      startFrame = value
    } else if (indexInCell === CELL_END_INDEX) {
      endFrame = value
      endIndex = startIndex + CELL_VALUES_START_INDEX + (endFrame - startFrame + 1) * sublayerCount
    }
    indexInCell++
    if (i === endIndex - 1) {
      indexInCell = 0
      const values = intArray.slice(startIndex + CELL_VALUES_START_INDEX, endIndex)
      const timeseries = getTimeseries(startFrame, values)
      for (let i = 0; i < timeseries.length; i++) {
        const { value, timestamp } = timeseries[i]
        const coordinates = getCellCoordinates({
          ...params,
          cell: cellNum,
          id: generateUniqueId(params.tileIndex[1], params.tileIndex[2], cellNum),
        })
        cells.push({
          cellIndex: cellNum,
          value,
          timestamp,
          coordinates,
        })
      }
      if (startFrame < domainX[0]) domainX[0] = startFrame
      if (endFrame > domainX[1]) domainX[1] = endFrame
      const cellMaxValue = Math.max(...values)
      if (cellMaxValue > domainY[1]) domainY[1] = cellMaxValue
    }
  }
  return {
    domainX,
    domainY,
    cells,
  }
}

export type GPUCell = {
  cellIndex: number
  timestamp: number
  value: number
  coordinates: [number, number]
}

export type FourwingsGPUTileData = {
  cols: number
  rows: number
  width: number
  cells: GPUCell[]
}

const parseFourWings = (
  arrayBuffer,
  { bbox, index }: { bbox: BBox; index: [number, number, number] }
): FourwingsGPUTileData => {
  const data = new Pbf(arrayBuffer).readFields(readData, [])[0]
  const rows = data[0]
  const cols = data[1]
  const width = getCellWidth(bbox, cols) * 111139
  const params: GetCellArayParams = {
    numCols: cols,
    numRows: rows,
    tileBBox: bbox,
    tileIndex: index,
  }
  const { cells } = getCellArrays(data, 1, params)
  return {
    cols,
    rows,
    width,
    cells,
  }
}
