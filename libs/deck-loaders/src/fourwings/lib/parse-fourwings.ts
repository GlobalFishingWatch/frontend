import Pbf from 'pbf'
import { GeoBoundingBox } from '@deck.gl/geo-layers/typed/tileset-2d/types'
import { Feature, Polygon } from 'geojson'
import { CONFIG_BY_INTERVAL, getTimeRangeKey } from '../helpers/time'
import { generateUniqueId, getCellCoordinates } from '../helpers/cells'
import type { FourwingsLoaderOptions, FourwingsOptions, FourwingsRawData } from './types'

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
): Feature<Polygon>[] => {
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
  const features = [] as Feature<Polygon>[]
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

        // find the feature if previous sublayers contained data for it
        // eslint-disable-next-line no-loop-func
        let feature = features.find((f) => f.properties?.cellNum === cellNum)
        // add the feature if previous sublayers didn't contain data for it
        if (!feature) {
          features.push({
            type: 'Feature',
            geometry: {
              coordinates: [
                getCellCoordinates({
                  id: generateUniqueId(tile.index.x, tile.index.y, cellNum),
                  cellIndex: cellNum,
                  cols,
                  rows,
                  tileBBox: [
                    (tile.bbox as GeoBoundingBox).west,
                    (tile.bbox as GeoBoundingBox).south,
                    (tile.bbox as GeoBoundingBox).east,
                    (tile.bbox as GeoBoundingBox).north,
                  ],
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
          })
          feature = features[features.length - 1]
        }

        for (let j = 0; j < numCellValues; j++) {
          const cellValue = subLayerIntArray[j + startIndex]
          if (cellValue !== NO_DATA_VALUE) {
            if (!feature.properties?.values[subLayerIndex]) {
              // create an array of values for this sublayer if the feature dind't have it already
              feature.properties!.values[subLayerIndex] = new Array(numCellValues)
            }
            if (!feature.properties?.dates[subLayerIndex]) {
              // create an array of dates for this sublayer if the feature dind't have it already
              feature.properties!.dates[subLayerIndex] = new Array(numCellValues)
            }
            if (!feature.properties?.startFrames[subLayerIndex]) {
              // set the startFrame for this sublayer if the feature dind't have it already
              feature.properties!.startFrames[subLayerIndex] = startFrame
            }
            if (!feature.properties?.initialValues[timeRangeKey][subLayerIndex]) {
              // set the initialValue for this sublayer to 0 if the feature dind't have it already
              feature.properties!.initialValues[timeRangeKey][subLayerIndex] = 0
            }
            // add current value to the array of values for this sublayer
            feature.properties!.values[subLayerIndex][Math.floor(j / sublayers)] =
              cellValue * SCALE_VALUE + OFFSET_VALUE

            // add current date to the array of dates for this sublayer
            feature.properties!.dates[subLayerIndex][Math.floor(j / sublayers)] = Math.ceil(
              CONFIG_BY_INTERVAL[interval].getTime(startFrame + tileMinIntervalFrame + j)
            )

            // sum current value to the initialValue for this sublayer
            // TODO make this an average for the environmental layers
            if (
              j + startFrame >= timeRangeStartIntervalFrame &&
              j + startFrame < timeRangeEndIntervalFrame
            ) {
              feature.properties!.initialValues[timeRangeKey][subLayerIndex] +=
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

  return features
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
