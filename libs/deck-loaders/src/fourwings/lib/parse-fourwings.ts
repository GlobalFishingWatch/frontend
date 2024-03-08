import Pbf from 'pbf'
import { GeoBoundingBox } from '@deck.gl/geo-layers/typed/tileset-2d/types'
import { CONFIG_BY_INTERVAL, getTimeRangeKey } from '../helpers/time'
import { generateUniqueId, getCellCoordinates } from '../helpers/cells'
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
): {
  cells: Cell[]
  indexes: number[]
  geometries: any[]
  startFrames: number[][]
  initialValues: Record<string, number[][]>
} => {
  const { minFrame, interval, sublayers, initialTimeRange, tile, cols, rows } =
    options?.fourwings || ({} as FourwingsOptions)

  // TODO ensure we use the UTC dates here to avoid the .ceil
  const tileMinIntervalFrame = Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(minFrame))
  const timeRangeStartIntervalFrame =
    Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(initialTimeRange.start)) -
    tileMinIntervalFrame
  const timeRangeEndIntervalFrame =
    Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(initialTimeRange.end)) -
    tileMinIntervalFrame
  const timeRangeKey = getTimeRangeKey(timeRangeStartIntervalFrame, timeRangeEndIntervalFrame)
  const cells = [] as Cell[]
  const indexes = [] as number[]
  const geometries = [] as any[]
  const startFrames = [] as number[][]
  const initialValues = {
    [timeRangeKey]: [],
  } as Record<string, number[][]>
  const sublayersLength = intArrays.length
  for (let subLayerIndex = 0; subLayerIndex < sublayersLength; subLayerIndex++) {
    let cellNum = 0
    let startFrame = 0
    let endFrame = 0
    let startIndex = 0
    let indexInCell = 0
    const subLayerIntArray = intArrays[subLayerIndex]
    for (let i = 0; i < subLayerIntArray.length; i++) {
      const value = subLayerIntArray[i]
      if (indexInCell === CELL_NUM_INDEX) {
        // this number defines the cell index
        startIndex = i + CELL_VALUES_START_INDEX
        cellNum = value
      } else if (indexInCell === CELL_START_INDEX) {
        // this number defines the cell start frame
        startFrame = value - tileMinIntervalFrame
      } else if (indexInCell === CELL_END_INDEX) {
        // this number defines the cell end frame
        endFrame = value - tileMinIntervalFrame

        // calculate how many values are in the tile
        const numCellValues = (endFrame - startFrame + 1) * sublayers

        // find the cell index if previous sublayers contained data for it
        // eslint-disable-next-line no-loop-func
        let cellIndex = indexes.findIndex((v) => v === cellNum)
        // add the cell if previous sublayers didn't contain data for it
        if (cellIndex === -1) {
          cells.push(new Array(sublayersLength))
          initialValues[timeRangeKey].push(new Array(sublayersLength))
          startFrames.push(new Array(sublayersLength))
          indexes.push(cellNum)
          geometries.push(
            getCellCoordinates({
              id: generateUniqueId(tile.index.x, tile.index.y, cellIndex),
              cellIndex,
              cols,
              rows,
              tileBBox: [
                (tile.bbox as GeoBoundingBox).west,
                (tile.bbox as GeoBoundingBox).south,
                (tile.bbox as GeoBoundingBox).east,
                (tile.bbox as GeoBoundingBox).north,
              ],
              flat: false,
            })
          )
          cellIndex = cells.length - 1
        }
        for (let j = 0; j < numCellValues; j++) {
          const cellValue = subLayerIntArray[j + startIndex]
          if (cellValue !== NO_DATA_VALUE) {
            if (!cells[cellIndex]?.[subLayerIndex]) {
              // create an array of values for this sublayer if the cell dind't have it already
              cells[cellIndex]![subLayerIndex] = new Array(numCellValues)
            }
            if (!startFrames[cellIndex]![subLayerIndex]) {
              // set the startFrame for this sublayer if the cell dind't have it already
              startFrames[cellIndex]![subLayerIndex] = startFrame
            }
            if (!initialValues[timeRangeKey][cellIndex]![subLayerIndex]) {
              // set the initialValue for this sublayer to 0 if the cell dind't have it already
              initialValues[timeRangeKey][cellIndex]![subLayerIndex] = 0
            }
            // add current value to the array of values for this sublayer
            cells[cellIndex]![subLayerIndex][Math.floor(j / sublayers)] =
              cellValue * SCALE_VALUE + OFFSET_VALUE

            // sum current value to the initialValue for this sublayer
            // TODO make this an average for the environmental layers
            if (
              j + startFrame >= timeRangeStartIntervalFrame &&
              j + startFrame < timeRangeEndIntervalFrame
            ) {
              initialValues[timeRangeKey][cellIndex]![subLayerIndex] +=
                cellValue * SCALE_VALUE + OFFSET_VALUE
            }
          }
        }
        // set the i to jump to the next step where we know a cell index will be
        i = startIndex + numCellValues - 1
        // resseting indexInCell to start with the new cell
        indexInCell = -1
      }
      indexInCell++
    }
  }
  return { cells, indexes, startFrames, initialValues, geometries }
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
