import Pbf from 'pbf'
import { GeoBoundingBox } from '@deck.gl/geo-layers/dist/tileset-2d'
import { CONFIG_BY_INTERVAL, getTimeRangeKey } from '../helpers/time'
import { BBox, generateUniqueId, getCellCoordinates } from '../helpers/cells'
import type {
  FourwingsFeature,
  FourwingsLoaderOptions,
  ParseFourwingsOptions,
  FourwingsRawData,
} from './types'

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

export const getCellTimeseries = (
  intArrays: FourwingsRawData[],
  options?: FourwingsLoaderOptions
): FourwingsFeature[] => {
  const {
    minFrame,
    interval,
    sublayers,
    initialTimeRange,
    aggregationOperation = 'sum',
    scale = SCALE_VALUE,
    offset = OFFSET_VALUE,
    noDataValue = NO_DATA_VALUE,
    tile,
    cols,
    rows,
  } = options?.fourwings || ({} as ParseFourwingsOptions)

  // TODO ensure we use the UTC dates here to avoid the .ceil
  const tileMinIntervalFrame = Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(minFrame))
  const timeRangeStartIntervalFrame =
    Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(initialTimeRange.start)) -
    tileMinIntervalFrame
  const timeRangeEndIntervalFrame =
    Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(initialTimeRange.end)) -
    tileMinIntervalFrame
  const timeRangeKey = getTimeRangeKey(timeRangeStartIntervalFrame, timeRangeEndIntervalFrame)
  const tileBBox: BBox = [
    (tile.bbox as GeoBoundingBox).west,
    (tile.bbox as GeoBoundingBox).south,
    (tile.bbox as GeoBoundingBox).east,
    (tile.bbox as GeoBoundingBox).north,
  ]
  const features = {} as Record<number, FourwingsFeature>
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
        const numValuesBySubLayer = new Array(sublayersLength).fill(0)

        // add the feature if previous sublayers didn't contain data for it
        if (!features[cellNum]) {
          features[cellNum] = {
            type: 'Feature',
            geometry: {
              coordinates: [
                getCellCoordinates({
                  cellIndex: cellNum,
                  cols,
                  rows,
                  tileBBox,
                }),
              ],
              type: 'Polygon',
            },
            properties: {
              values: new Array(sublayersLength),
              dates: new Array(sublayersLength),
              cellId: generateUniqueId(tile.index.x, tile.index.y, cellNum),
              cellNum,
              startFrames: [],
              initialValues: { [timeRangeKey]: new Array(sublayersLength) },
            },
          }
        }

        for (let j = 0; j < numCellValues; j++) {
          const cellValue = subLayerIntArray[j + startIndex]
          if (cellValue !== noDataValue) {
            if (!features[cellNum].properties.values[subLayerIndex]) {
              // create properties for this sublayer if the feature dind't have it already
              features[cellNum].properties.values[subLayerIndex] = new Array(numCellValues)
              features[cellNum].properties.dates[subLayerIndex] = new Array(numCellValues)
              features[cellNum].properties.startFrames[subLayerIndex] = startFrame
              features[cellNum].properties.initialValues[timeRangeKey][subLayerIndex] = 0
            }
            // add current value to the array of values for this sublayer
            features[cellNum].properties.values[subLayerIndex][Math.floor(j / sublayers)] =
              cellValue * scale - offset
            // add current date to the array of dates for this sublayer
            features[cellNum].properties.dates[subLayerIndex][Math.floor(j / sublayers)] =
              Math.ceil(CONFIG_BY_INTERVAL[interval].getTime(startFrame + tileMinIntervalFrame + j))

            // sum current value to the initialValue for this sublayer
            // TODO make this an average for the environmental layers
            if (
              j + startFrame >= timeRangeStartIntervalFrame &&
              j + startFrame < timeRangeEndIntervalFrame
            ) {
              features[cellNum].properties.initialValues[timeRangeKey][subLayerIndex] +=
                cellValue * scale - offset
              numValuesBySubLayer[subLayerIndex] = numValuesBySubLayer[subLayerIndex] + 1
            }
          }
        }
        if (aggregationOperation === 'avg') {
          features[cellNum].properties.initialValues[timeRangeKey][subLayerIndex] =
            features[cellNum].properties.initialValues[timeRangeKey][subLayerIndex] /
            numValuesBySubLayer[subLayerIndex]
        }
        // set the i to jump to the next step where we know a cell index will be
        i = startIndex + numCellValues - 1
        // resseting indexInCell to start with the new cell
        indexInCell = -1
      }
      indexInCell++
    }
  }

  return Object.values(features)
}

function readData(_: any, data: any, pbf: any) {
  data.push(pbf.readPackedVarint())
}

export const parseFourwings = async (
  datasetsBuffer: ArrayBuffer,
  options?: FourwingsLoaderOptions
) => {
  const { buffersLength } = options?.fourwings || {}
  if (!buffersLength?.length) {
    return []
  }
  let start = 0
  return getCellTimeseries(
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
  )
}