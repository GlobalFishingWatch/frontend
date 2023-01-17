// import { TileBoundingBox, TileIndex } from '@deck.gl/geo-layers/typed/tile-layer/types'
// import { LoaderWithParser } from '@loaders.gl/loader-utils'
import Pbf from 'pbf'
import { Interval } from '@globalfishingwatch/layer-composer'
import { getChunkBuffer } from '../../layers/fourwings/fourwings.config'
import { FourwingsDatasetId, FourwingsSublayer } from '../../layers/fourwings/fourwings.types'
import { FEATURE_COL_INDEX, FEATURE_ROW_INDEX } from '../constants'

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
  minFrame: number
  maxFrame: number
  sublayerCount: number
  bufferMs: number
}

export type FourwingsRawData = number[]
const getCellTimeseries = (intArrays: FourwingsRawData[], params: ParseFourwingsParams): Cell[] => {
  const { minFrame, maxFrame, interval, sublayers } = params
  const sublayerCount = sublayers.length
  const sublayerIds = sublayers.map((s) => s.id)
  const cells: ChunkCell = {}
  let cellNum = 0
  let startFrame = 0
  let endFrame = 0
  let startIndex = 0
  let endIndex = 0
  let indexInCell = 0
  const bufferMs = getChunkBuffer(interval)
  for (let index = 0; index < intArrays.length; index++) {
    const intArray = intArrays[index]
    for (let i = 2; i < intArray.length; i++) {
      const value = intArray[i]
      if (indexInCell === 0) {
        startIndex = i
        cellNum = value
      } else if (indexInCell === 1) {
        startFrame = value
      } else if (indexInCell === 2) {
        endFrame = value
        endIndex = startIndex + 3 + (endFrame - startFrame + 1) * sublayerCount
      }
      indexInCell++
      if (i === endIndex - 1) {
        indexInCell = 0
        const timeseries = intArray.slice(startIndex + 3, endIndex).reduce(
          // eslint-disable-next-line no-loop-func
          (acc, v, i) => {
            if (v > 0) {
              const date = getDate(Math.ceil(i / sublayerCount) + startFrame)
              if (date >= minFrame - bufferMs && date <= maxFrame + bufferMs) {
                acc[i % sublayerCount][date] = v / 100
              }
            }
            return acc
          },
          Array.from(Array(sublayerCount).keys()).map(() => ({}))
        )
        // eslint-disable-next-line no-loop-func
        sublayerIds.forEach((id, sublayerIndex) => {
          const sublayerTimeseries = timeseries[sublayerIndex]
          if (!cells[cellNum]?.[id]) {
            if (Object.keys(sublayerTimeseries).length) {
              if (!cells[cellNum]) {
                cells[cellNum] = {}
              }
              cells[cellNum][id] = sublayerTimeseries
            }
          } else {
            cells[cellNum][id] = {
              ...cells[cellNum][id],
              ...sublayerTimeseries,
            }
          }
        })
      }
    }
  }

  return Object.keys(cells).map((cellId) => {
    return {
      index: parseInt(cellId),
      timeseries: cells[cellId],
    }
  })
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
  minFrame: number
  maxFrame: number
  interval: Interval
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
