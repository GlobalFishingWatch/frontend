// import { TileBoundingBox, TileIndex } from '@deck.gl/geo-layers/typed/tile-layer/types'
// import { LoaderWithParser } from '@loaders.gl/loader-utils'
import Pbf from 'pbf'
import { FourwingsDatasetId, FourwingsSublayer } from '../../layers/fourwings/fourwings.types'
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

export type GetTimeseriesParams = {
  startFrame: number
  sublayerIndex: number
  sublayerCount: number
}

const getTimeseries = (values: number[], params: GetTimeseriesParams) => {
  return values.reduce((acc, v, i) => {
    if (v > 0 && i % params.sublayerCount === params.sublayerIndex) {
      acc[getDate(i + params.startFrame)] = v
    }
    return acc
  }, {})
}

export type FourwingsRawData = number[]
const getCellTimeseries = (intArrays: FourwingsRawData[], params: ParseFourwingsParams): Cell[] => {
  const sublayerCount = params.sublayers.length
  const sublayerIds = params.sublayers.map((s) => s.id)
  const cells: ChunkCell = {}
  let cellNum = 0
  let startFrame = 0
  let endFrame = 0
  let startIndex = 0
  let endIndex = 0
  let indexInCell = 0
  const domainX = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
  const domainY = [0, Number.NEGATIVE_INFINITY]

  intArrays.forEach((intArray) => {
    for (let i = FEATURE_CELLS_START_INDEX; i < intArray.length; i++) {
      const value = intArray[i]
      if (indexInCell === CELL_NUM_INDEX) {
        startIndex = i
        cellNum = value
      } else if (indexInCell === CELL_START_INDEX) {
        startFrame = value
      } else if (indexInCell === CELL_END_INDEX) {
        endFrame = value
        endIndex =
          startIndex + CELL_VALUES_START_INDEX + (endFrame - startFrame + 1) * sublayerCount
      }
      indexInCell++
      if (i === endIndex - 1) {
        indexInCell = 0
        // const padded = new Array(delta * sublayerCount).fill(padValue)
        // original[FEATURE_CELLS_START_INDEX] = endFrame + delta
        // const merged = original.concat(padded)
        const values = intArray.slice(startIndex + CELL_VALUES_START_INDEX, endIndex)

        // eslint-disable-next-line no-loop-func
        sublayerIds.forEach((id, sublayerIndex) => {
          if (!cells[cellNum]) {
            cells[cellNum] = {}
          }
          if (!cells[cellNum][id]) {
            const timeseries = getTimeseries(values, { startFrame, sublayerIndex, sublayerCount })
            if (Object.keys(timeseries).length) {
              cells[cellNum][id] = timeseries
            }
          } else {
            cells[cellNum][id] = {
              ...cells[cellNum][id],
              ...getTimeseries(values, { startFrame, sublayerIndex, sublayerCount }),
            }
          }
        })

        if (startFrame < domainX[0]) domainX[0] = startFrame
        if (endFrame > domainX[1]) domainX[1] = endFrame
        const cellMaxValue = Math.max(...values)
        if (cellMaxValue > domainY[1]) domainY[1] = cellMaxValue
      }
    }
  })

  return Object.entries(cells).map(([cellId, timeseries]) => ({
    index: parseInt(cellId),
    timeseries,
  }))
}

export type CellFrame = number
export type CellValue = number
export type CellTimeseries = Record<CellFrame, CellValue>
export type CellIndex = number
export type ChunkCell = Record<CellIndex, Record<FourwingsDatasetId, CellTimeseries>>
export type Cell = {
  index: CellIndex
  timeseries: Record<FourwingsDatasetId, CellTimeseries>
}

export type FourwingsTileData = {
  cols: number
  rows: number
  cells: Cell[]
}

export type ParseFourwingsParams = {
  sublayers: FourwingsSublayer[]
}

export const parseFourWings = (
  arrayBuffers: ArrayBuffer[],
  params: ParseFourwingsParams
): FourwingsTileData => {
  const data = arrayBuffers.map((arrayBuffer) => new Pbf(arrayBuffer).readFields(readData, [])[0])
  const rows = data[0]?.[FEATURE_ROW_INDEX]
  const cols = data[0]?.[FEATURE_COL_INDEX]

  return {
    cols,
    rows,
    cells: getCellTimeseries(data, params),
  }
}
// export const combineChunkTimeseries = (
//   fourwingsChunks: FourwingsChunkData[]
// ): FourwingsTileData => {
//   const cellIds = Array.from(new Set(fourwingsChunks.flatMap((chunk) => Object.keys(chunk.cells))))
//   const timeseries = cellIds.map((cellId) => {
//     const cell: Cell = {
//       index: parseInt(cellId),
//       timeseries: Object.fromEntries(
//         Object.keys(fourwingsChunks[0].cells[Object.keys(fourwingsChunks[0].cells)[0]]).map(
//           (key) => [key, {}]
//         )
//       ),
//     }
//     fourwingsChunks.forEach(({ cells }) => {
//       if (cells[cellId]) {
//         Object.keys(cells[cellId]).forEach((sublayerId) => {
//           Object.entries(cells[cellId][sublayerId]).forEach(([timestamp, value]) => {
//             cell.timeseries[sublayerId][timestamp] = value
//           })
//         })
//       }
//     })
//     return cell
//   })
//   return timeseries
// }
