import Pbf from 'pbf'
import { Interval } from '@globalfishingwatch/layer-composer'
import { CONFIG_BY_INTERVAL } from '../../utils/time'
import { getChunkBuffer } from '../../layers/fourwings/fourwings.config'
import { FourwingsDatasetId, FourwingsDeckSublayer } from '../../layers/fourwings/fourwings.types'
import {
  CELL_END_INDEX,
  CELL_NUM_INDEX,
  CELL_START_INDEX,
  CELL_VALUES_START_INDEX,
  FEATURE_COL_INDEX,
  FEATURE_ROW_INDEX,
  VALUE_MULTIPLIER,
} from '../constants'

function readData(_: any, data: any, pbf: any) {
  data.push(pbf.readPackedVarint())
}

export type BBox = [number, number, number, number]

export type GetTimeseriesParams = {
  startFrame: number
  minFrame: number
  maxFrame: number
  sublayerCount: number
  bufferMs: number
}

// TODO make this dynamic to get the data from the header
// const NO_DATA_VALUE = 0
export const NO_DATA_VALUE = 4294967295
// export const SCALE_VALUE = 0.01
export const SCALE_VALUE = 1
export const OFFSET_VALUE = 0

export type FourwingsRawData = number[]
const getCellTimeseries = (intArrays: FourwingsRawData[], params: ParseFourwingsParams): Cell[] => {
  const { minFrame, maxFrame, interval, sublayers, cols, rows } = params
  // TODO ensure we use the UTC dates here to avoid the .ceil
  const tileMinIntervalFrame = Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(minFrame))
  const tileMaxIntervalFrame = Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(maxFrame))
  const sublayerCount = sublayers.length
  let cells = new Array(cols * rows).fill(null) as Cell[]
  let cellNum = 0
  let startFrame = 0
  let endFrame = 0
  let startIndex = 0
  let endIndex = 0
  let indexInCell = 0

  for (let index = 0; index < intArrays.length; index++) {
    const intArray = intArrays[index]
    for (let i = 0; i < intArray.length; i++) {
      const value = intArray[i]
      if (indexInCell === CELL_NUM_INDEX) {
        startIndex = i
        cellNum = value
      } else if (indexInCell === CELL_START_INDEX) {
        startFrame = value
        // startFrame = getDateInIntervalResolution(value, interval)
      } else if (indexInCell === CELL_END_INDEX) {
        // endFrame = getDateInIntervalResolution(value, interval)
        endFrame = value

        const numCellValues = (endFrame - startFrame + 1) * sublayerCount
        const startOffset = startIndex + CELL_VALUES_START_INDEX
        endIndex = startOffset + numCellValues - 1

        cells[cellNum] = new Array(sublayerCount).fill(null)
        for (let j = 0; j < numCellValues; j++) {
          const subLayerIndex = j % sublayerCount
          const cellValue = intArray[j + startOffset]
          if (cellValue !== NO_DATA_VALUE) {
            if (!cells[cellNum]?.[subLayerIndex]) {
              cells[cellNum]![subLayerIndex] = new Array(
                tileMaxIntervalFrame - tileMinIntervalFrame
              ).fill(null)
            }
            cells[cellNum]![subLayerIndex][
              startFrame - tileMinIntervalFrame + Math.floor(j / sublayerCount)
            ] = cellValue * SCALE_VALUE + OFFSET_VALUE
          }
        }
        i = endIndex
        // TODO make this clearer, probably using enum of string for what indexInCell means
        indexInCell = -1
      }
      indexInCell++
    }
  }

  return cells
}

export type CellFrame = number
export type CellValue = number
export type CellTimeseries = Record<CellFrame, CellValue>
export type CellIndex = number
export type ChunkCell = Record<CellIndex, Record<FourwingsDatasetId, CellTimeseries>>
export type Cell = (number | null)[][] | null

export type RawFourwingsTileData = {
  bins: number[][]
  cols: number
  rows: number
  data: ArrayBuffer
}

export type FourwingsTileData = Omit<RawFourwingsTileData, 'data'> & {
  cells: Cell[]
}

export type ParseFourwingsParams = {
  cols: number
  rows: number
  bins: number[][]
  minFrame: number
  maxFrame: number
  interval: Interval
  sublayers: FourwingsDeckSublayer[]
}

export const parseFourWings = async (
  rawData: RawFourwingsTileData[],
  params: ParseFourwingsParams
): Promise<FourwingsTileData> => {
  const data = rawData.map(
    (arrayBuffer) => new Pbf(arrayBuffer.data).readFields(readData, [])[0]
  ) as FourwingsRawData[]

  return new Promise((resolve) => {
    // const worker =
    //   typeof window !== 'undefined'
    //     ? new Worker(new URL('./worker.ts', import.meta.url))
    //     : undefined
    // if (worker) {
    //   console.log('USING WORKER')
    //   worker.onmessage = (event: MessageEvent<Cell[]>) => {
    //     resolve({
    //       cols,
    //       rows,
    //       cells: event.data,
    //     })
    //   }

    //   worker.postMessage({ data, ...params })
    // } else {
    //   resolve({
    //     cols,
    //     rows,
    //     cells: getCellTimeseries(data, params),
    //   })
    // }
    resolve({
      bins: params.bins,
      cols: params.cols,
      rows: params.rows,
      cells: getCellTimeseries(data, params),
    })
  })
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
