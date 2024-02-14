import Pbf from 'pbf'
import { CONFIG_BY_INTERVAL } from '../helpers/time'
import type { Cell, FourwingsLoaderOptions, FourwingsOptions, FourwingsRawData } from './types'

// TODO make this dynamic to get the data from the header
// const NO_DATA_VALUE = 0
export const NO_DATA_VALUE = 4294967295
// export const SCALE_VALUE = 0.01
export const SCALE_VALUE = 1
export const OFFSET_VALUE = 0
export const CELL_NUM_INDEX = 0
export const CELL_START_INDEX = 1
export const CELL_END_INDEX = 2
export const CELL_VALUES_START_INDEX = 3

// eslint-disable-next-line max-statements
export const getCellTimeseries = (
  intArrays: FourwingsRawData[],
  options?: FourwingsLoaderOptions
): { cells: Cell[]; indexes: number[] } => {
  const { minFrame, maxFrame, interval, sublayers } = options?.fourwings || ({} as FourwingsOptions)
  // TODO ensure we use the UTC dates here to avoid the .ceil
  const tileMinIntervalFrame = Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(minFrame))
  const tileMaxIntervalFrame = Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(maxFrame))
  // const sublayerCount = sublayers.length
  const cells = [] as Cell[]
  const indexes = [] as number[]
  const dataLength = intArrays.length
  for (let subLayerIndex = 0; subLayerIndex < dataLength; subLayerIndex++) {
    let cellNum = 0
    let startFrame = 0
    let endFrame = 0
    let startIndex = 0
    let endIndex = 0
    let indexInCell = 0
    const subLayerIntArray = intArrays[subLayerIndex]
    for (let i = 0; i < subLayerIntArray.length; i++) {
      const value = subLayerIntArray[i]
      if (indexInCell === CELL_NUM_INDEX) {
        startIndex = i
        cellNum = value
      } else if (indexInCell === CELL_START_INDEX) {
        startFrame = value
        // startFrame = getDateInIntervalResolution(value, interval)
      } else if (indexInCell === CELL_END_INDEX) {
        // endFrame = getDateInIntervalResolution(value, interval)
        endFrame = value

        const numCellValues = (endFrame - startFrame + 1) * sublayers
        const startOffset = startIndex + CELL_VALUES_START_INDEX
        endIndex = startOffset + numCellValues - 1

        // eslint-disable-next-line no-loop-func
        let cellIndex = indexes.findIndex((v) => v === cellNum)
        if (cellIndex === -1) {
          cells.push(new Array(dataLength).fill(null))
          indexes.push(cellNum)
          cellIndex = cells.length - 1
        }
        for (let j = 0; j < numCellValues; j++) {
          // const subLayerIndex = j % sublayers
          const cellValue = subLayerIntArray[j + startOffset]
          // eslint-disable-next-line max-depth
          if (cellValue !== NO_DATA_VALUE) {
            // eslint-disable-next-line max-depth
            if (!cells[cellIndex]?.[subLayerIndex]) {
              cells[cellIndex]![subLayerIndex] = new Array(
                tileMaxIntervalFrame - tileMinIntervalFrame
              ).fill(null)
            }
            cells[cellIndex]![subLayerIndex][
              startFrame - tileMinIntervalFrame + Math.floor(j / sublayers)
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

  return { cells, indexes }
}

function readData(_: any, data: any, pbf: any) {
  data.push(pbf.readPackedVarint())
}

export const parseFourwings = async (
  datasetsBuffer: ArrayBuffer,
  options?: FourwingsLoaderOptions
) => {
  const { buffersLength, cols, rows } = options?.fourwings || {}
  if (!buffersLength?.length) {
    return []
  }
  let start = 0
  return {
    cols,
    rows,
    ...getCellTimeseries(
      buffersLength.map((length, index) => {
        if (length === 0) {
          return []
        }
        const buffer = datasetsBuffer.slice(
          start,
          index !== buffersLength.length ? start + length : undefined
        )
        start += length
        return new Pbf(buffer).readFields(readData, [])[0]
      }),
      options
    ),
  }
}
