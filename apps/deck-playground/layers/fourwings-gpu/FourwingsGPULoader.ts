import { LoaderWithParser } from '@loaders.gl/loader-utils'
import Pbf from 'pbf'
import {
  CELL_END_INDEX,
  CELL_NUM_INDEX,
  CELL_START_INDEX,
  CELL_VALUES_START_INDEX,
  FEATURE_CELLS_START_INDEX,
} from '../../loaders/constants'

export const fourwingsGPULoader: LoaderWithParser = {
  name: 'fourwings',
  module: 'fourwings',
  options: {},
  id: '4Wings-pbf',
  version: 'latest',
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream'],
  worker: false,
  parse: async (arrayBuffer) => parseFourWings(arrayBuffer),
  parseSync: async (arrayBuffer) => parseFourWings(arrayBuffer),
}

function readData(_, data, pbf) {
  data.push(pbf.readPackedVarint())
}

export type BBox = [number, number, number, number]

const getDate = (day) => {
  return day * 1000 * 60 * 60 * 24
}
const getTimeseries = (startFrame, values) => {
  return values.map((v, i) => ({
    value: v,
    timestamp: getDate(i + startFrame),
  }))
}

const getCellArrays = (intArray, sublayerCount = 1) => {
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
      // const padded = new Array(delta * sublayerCount).fill(padValue)
      // original[FEATURE_CELLS_START_INDEX] = endFrame + delta
      // const merged = original.concat(padded)
      const values = intArray.slice(startIndex + CELL_VALUES_START_INDEX, endIndex)
      const timeseries = getTimeseries(startFrame, values)
      for (let i = 0; i < timeseries.length; i++) {
        const { value, timestamp } = timeseries[i]
        cells.push({
          cellIndex: cellNum,
          value,
          timestamp,
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
}

export type FourwingsGPUTileData = {
  cols: number
  rows: number
  cells: GPUCell[]
}

const parseFourWings = (arrayBuffer): FourwingsGPUTileData => {
  var data = new Pbf(arrayBuffer).readFields(readData, [])[0]
  const { cells } = getCellArrays(data, 1)
  const rows = data[0]
  const cols = data[1]
  return {
    cols,
    rows,
    cells,
  }
}
