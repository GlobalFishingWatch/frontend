import Pbf from 'pbf'
import { Interval } from '@globalfishingwatch/layer-composer'
import { CONFIG_BY_INTERVAL } from '../../utils/time'
import { getChunkBuffer } from '../../layers/fourwings/fourwings.config'
import { FourwingsDatasetId, FourwingsSublayer } from '../../layers/fourwings/fourwings.types'
import {
  CELL_END_INDEX,
  CELL_NUM_INDEX,
  CELL_START_INDEX,
  CELL_VALUES_START_INDEX,
  FEATURE_COL_INDEX,
  FEATURE_ROW_INDEX,
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
      if (indexInCell === CELL_NUM_INDEX) {
        startIndex = i
        cellNum = value
      } else if (indexInCell === CELL_START_INDEX) {
        startFrame = value
        // startFrame = getDateInIntervalResolution(value, interval)
      } else if (indexInCell === CELL_END_INDEX) {
        // endFrame = getDateInIntervalResolution(value, interval)
        endFrame = value
        endIndex =
          startIndex + CELL_VALUES_START_INDEX + (endFrame - startFrame + 1) * sublayerCount
      }
      indexInCell++
      if (i === endIndex - 1) {
        indexInCell = 0
        const timeseries = intArray.slice(startIndex + CELL_VALUES_START_INDEX, endIndex).reduce(
          // eslint-disable-next-line no-loop-func
          (acc, v, i) => {
            if (v > 0) {
              const timestamp = CONFIG_BY_INTERVAL[interval].getTime(
                Math.ceil(i / sublayerCount) + startFrame
              )
              if (timestamp >= minFrame - bufferMs && timestamp <= maxFrame + bufferMs) {
                acc[i % sublayerCount][timestamp] = v / 100
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
      timeseries: cells[cellId as any],
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

export const parseFourWings = async (
  arrayBuffers: ArrayBuffer[],
  params: ParseFourwingsParams
): Promise<FourwingsTileData> => {
  const data = arrayBuffers.map((arrayBuffer) => new Pbf(arrayBuffer).readFields(readData, [])[0])
  const rows = data[0]?.[FEATURE_ROW_INDEX]
  const cols = data[0]?.[FEATURE_COL_INDEX]

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
      cols,
      rows,
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
