import type { GeoBoundingBox } from '@deck.gl/geo-layers/dist/tileset-2d'
import Pbf from 'pbf'

import { CONFIG_BY_INTERVAL } from '../helpers'
import type { BBox } from '../helpers/cells'
import { generateUniqueId, getCellPointCoordinates, getCellProperties } from '../helpers/cells'

import { CELL_END_INDEX, CELL_START_INDEX, NO_DATA_VALUE } from './parse-fourwings'
import type {
  FourwingsClustersLoaderOptions,
  FourwingsPointFeature,
  FourwingsRawData,
  ParseFourwingsClustersOptions,
} from './types'

const SCALE_VALUE = 1
const OFFSET_VALUE = 0
const CELL_NUM_INDEX = 0
const CELL_VALUE_INDEX = 1

export const getPointsTemporalAggregated = (
  intArray: FourwingsRawData,
  options?: FourwingsClustersLoaderOptions
): FourwingsPointFeature[] => {
  const {
    scale = SCALE_VALUE,
    offset = OFFSET_VALUE,
    tile,
    cols,
    rows,
  } = options?.fourwingsClusters || ({} as ParseFourwingsClustersOptions)

  const tileBBox: BBox = [
    (tile?.bbox as GeoBoundingBox).west,
    (tile?.bbox as GeoBoundingBox).south,
    (tile?.bbox as GeoBoundingBox).east,
    (tile?.bbox as GeoBoundingBox).north,
  ]
  const features = [] as FourwingsPointFeature[]

  let cellNum = 0
  let indexInCell = 0
  for (let i = 0; i < intArray.length; i++) {
    const value = intArray[i]
    if (indexInCell === CELL_NUM_INDEX) {
      // this number defines the cell number frame
      cellNum = value
    } else if (indexInCell === CELL_VALUE_INDEX) {
      const { col, row } = getCellProperties(tileBBox, cellNum, cols)
      // this number defines the cell value frame
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: getCellPointCoordinates({
            cellIndex: cellNum,
            cols,
            rows,
            tileBBox,
          }),
        },
        properties: {
          // TODO:deck remove the round as won't be needed with real data
          value: Math.round(offset + value * scale),
          id: generateUniqueId(tile!.index.x, tile!.index.y, cellNum),
          tile: tile?.index,
          col,
          row,
        },
      })
      // resseting indexInCell to start with the new cell
      indexInCell = -1
    }
    indexInCell++
  }
  return features
}

export const getPoints = (
  intArray: FourwingsRawData,
  options?: FourwingsClustersLoaderOptions
): FourwingsPointFeature[] => {
  const {
    scale = SCALE_VALUE,
    offset = OFFSET_VALUE,
    noDataValue = NO_DATA_VALUE,
    tile,
    cols,
    rows,
    interval,
  } = options?.fourwingsClusters || ({} as ParseFourwingsClustersOptions)

  const tileBBox: BBox = [
    (tile?.bbox as GeoBoundingBox).west,
    (tile?.bbox as GeoBoundingBox).south,
    (tile?.bbox as GeoBoundingBox).east,
    (tile?.bbox as GeoBoundingBox).north,
  ]
  const features = [] as FourwingsPointFeature[]

  let cellNum = 0
  let startFrame = 0
  let endFrame = 0
  let indexInCell = 0

  for (let i = 0; i < intArray.length; i++) {
    const value = intArray[i]
    if (indexInCell === CELL_NUM_INDEX) {
      // this number defines the cell number frame
      cellNum = value
    } else if (indexInCell === CELL_START_INDEX) {
      startFrame = value
    } else if (indexInCell === CELL_END_INDEX) {
      endFrame = value

      const numCellValues = endFrame - startFrame + 1
      const { col, row } = getCellProperties(tileBBox, cellNum, cols)
      const coordinates = getCellPointCoordinates({
        cellIndex: cellNum,
        cols,
        rows,
        tileBBox,
      })
      const htime =
        CONFIG_BY_INTERVAL[interval]?.getIntervalTimestamp(startFrame) / (1000 * 60 * 60)
      for (let j = 1; j <= numCellValues; j++) {
        const pointValue = intArray[i + j]
        if (pointValue !== 0 && pointValue !== noDataValue) {
          // this number defines the cell value frame
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates,
            },
            properties: {
              value: Math.round(offset + pointValue * scale),
              id: generateUniqueId(tile!.index.x, tile!.index.y, cellNum + j),
              tile: tile?.index,
              htime,
              col,
              row,
            },
          })
        }
      }
      i += numCellValues
      // resseting indexInCell to start with the new cell
      indexInCell = -1
    }
    indexInCell++
  }
  return features
}

function readData(_: any, data: any, pbf: any) {
  data.push(pbf.readPackedVarint())
}

export const parseFourwingsClusters = (
  buffer: ArrayBuffer,
  options?: FourwingsClustersLoaderOptions
) => {
  const data = new Pbf(buffer).readFields(readData, [])[0]
  return options?.fourwingsClusters?.temporalAggregation
    ? getPointsTemporalAggregated(data, options)
    : getPoints(data, options)
}
