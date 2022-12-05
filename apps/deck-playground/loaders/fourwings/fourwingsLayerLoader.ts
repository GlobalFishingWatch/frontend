// import { TileBoundingBox, TileIndex } from '@deck.gl/geo-layers/typed/tile-layer/types'
// import { LoaderWithParser } from '@loaders.gl/loader-utils'
import Pbf from 'pbf'
import {
  CELL_END_INDEX,
  CELL_NUM_INDEX,
  CELL_START_INDEX,
  CELL_VALUES_START_INDEX,
  FEATURE_CELLS_START_INDEX,
  FEATURE_COL_INDEX,
  FEATURE_ROW_INDEX,
} from '../constants'

// function sinh(arg) {
//   return (Math.exp(arg) - Math.exp(-arg)) / 2
// }

// function tileToLng(x, z) {
//   return (x * 360) / Math.pow(2, z) - 180
// }

// function tileToLat(y, z) {
//   return Math.atan(sinh(Math.PI - (y * 2 * Math.PI) / Math.pow(2, z))) * (180 / Math.PI)
// }

// function getTileIndex(url: string) {
//   return url
//     .split('/')
//     .slice(-3)
//     .map((i) => parseInt(i)) as [number, number, number]
// }

// function getTileBBox(url: string): BBox {
//   const [z, x, y] = getTileIndex(url)
//   const north = tileToLat(y, z)
//   const west = tileToLng(x, z)
//   const south = tileToLat(y + 1, z)
//   const east = tileToLng(x + 1, z)
//   return [west, south, east, north]
// }

// export const fourwingsLayerLoader: LoaderWithParser = {
//   name: 'fourwings',
//   module: 'fourwings',
//   options: {},
//   id: '4Wings-pbf',
//   version: 'latest',
//   extensions: ['pbf'],
//   mimeTypes: ['application/x-protobuf', 'application/octet-stream'],
//   worker: false,
//   parse: async (arrayBuffer, { baseUri }) => {
//     const tileBbox = getTileBBox(baseUri)
//     const tileIndex = getTileIndex(baseUri)
//     return parseFourWings(arrayBuffer, { tileBbox, tileIndex })
//   },
//   parseSync: async (arrayBuffer, { baseUri }) => {
//     const tileBbox = getTileBBox(baseUri)
//     const tileIndex = getTileIndex(baseUri)
//     return parseFourWings(arrayBuffer, { tileBbox, tileIndex })
//   },
// }

function readData(_, data, pbf) {
  data.push(pbf.readPackedVarint())
}

export type BBox = [number, number, number, number]

const getDate = (day) => {
  return day * 1000 * 60 * 60 * 24
}
const getTimeseries = (startFrame, values) => {
  return values.flatMap((v, i) => {
    return v > 0
      ? {
          value: v,
          frame: getDate(i + startFrame),
        }
      : []
  })
}

const getCellArrays = (intArray, sublayerCount = 1) => {
  const cells: Cell[] = []
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
      cells.push({
        timeseries: getTimeseries(startFrame, values),
        index: cellNum,
      })
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

export type CellTimeseries = {
  value: number
  frame: number
}

export type Cell = {
  index: number
  timeseries: CellTimeseries[]
}

export type FourwingsTileData = {
  cols: number
  rows: number
  cells: Cell[]
}

export const parseFourWings = (arrayBuffer): FourwingsTileData => {
  var data = new Pbf(arrayBuffer).readFields(readData, [])[0]
  const { cells } = getCellArrays(data, 1)

  const rows = data[FEATURE_ROW_INDEX]
  const cols = data[FEATURE_COL_INDEX]

  return {
    cols,
    rows,
    cells,
  }
}
