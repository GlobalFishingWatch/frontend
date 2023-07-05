import { Interval } from '@globalfishingwatch/layer-composer'
import { getChunkBuffer } from '../../layers/fourwings/fourwings.config'
import { FourwingsSublayer } from '../../layers/fourwings/fourwings.types'
import {
  CELL_NUM_INDEX,
  CELL_START_INDEX,
  CELL_END_INDEX,
  CELL_VALUES_START_INDEX,
} from '../constants'
import { FourwingsRawData, Cell, ChunkCell } from './fourwingsLayerLoader'

export type ParseFourwingsParams = {
  data: FourwingsRawData[]
  minFrame: number
  maxFrame: number
  interval: Interval
  sublayers: FourwingsSublayer[]
}

const getDate = (day: any) => {
  return day * 1000 * 60 * 60 * 24
}

const getCellTimeseries = (params: ParseFourwingsParams): Cell[] => {
  const { data, minFrame, maxFrame, interval, sublayers } = params
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
  for (let index = 0; index < data.length; index++) {
    const intArray = data[index]
    for (let i = 2; i < intArray.length; i++) {
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
        const timeseries = intArray.slice(startIndex + CELL_VALUES_START_INDEX, endIndex).reduce(
          // eslint-disable-next-line no-loop-func
          (acc, v, i) => {
            if (v > 0) {
              const date = getDate(Math.ceil(i / sublayerCount) + startFrame)
              if (date >= minFrame - bufferMs && date <= maxFrame + bufferMs) {
                ;(acc as any)[i % sublayerCount][date] = v / 100
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

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<ParseFourwingsParams>) => {
  postMessage(getCellTimeseries(event.data))
})
