import type { GeoBoundingBox } from '@deck.gl/geo-layers/dist/tileset-2d'
import Pbf from 'pbf'

import type { BBox } from '../helpers/cells'
import { generateUniqueId, getCellCoordinates, getCellProperties } from '../helpers/cells'
import { CONFIG_BY_INTERVAL, getTimeRangeKey } from '../helpers/time'

import type {
  FourwingsFeature,
  FourwingsVectorsLoaderOptions,
  ParseFourwingsVectorsOptions,
} from './types'

export const NO_DATA_VALUE = 4294967295
export const SCALE_VALUE = 1
export const OFFSET_VALUE = 0
export const CELL_NUM_INDEX = 0
export const CELL_START_INDEX = 1
export const CELL_END_INDEX = 2
export const CELL_VALUES_START_INDEX = 3
const RAD_TO_DEG = 180 / Math.PI

export const getCellTimeseries = (
  _: unknown,
  data: {
    features: Map<number, FourwingsFeature>
    options?: ParseFourwingsVectorsOptions
    // Temporary storage for first sublayer (U) values until we process second sublayer (V) to calculate vectors
    // Map<cellNum, U values[]>
    uValuesByCell: Map<number, number[]>
  },
  pbf: Pbf
) => {
  const {
    bufferedStartDate,
    interval,
    initialTimeRange,
    scale,
    offset,
    noDataValue,
    tile,
    cols,
    rows,
    buffersLength,
  } = data.options || ({} as ParseFourwingsVectorsOptions)

  const aggregationOperation = 'avg'
  const tileStartFrame = CONFIG_BY_INTERVAL[interval].getIntervalFrame(bufferedStartDate)
  const timeRangeStartFrame =
    CONFIG_BY_INTERVAL[interval].getIntervalFrame(initialTimeRange?.start as number) -
    tileStartFrame
  const timeRangeEndFrame =
    CONFIG_BY_INTERVAL[interval].getIntervalFrame(initialTimeRange?.end as number) - tileStartFrame

  const timeRangeKey = getTimeRangeKey(timeRangeStartFrame, timeRangeEndFrame)

  const tileBBox: BBox = [
    (tile?.bbox as GeoBoundingBox).west,
    (tile?.bbox as GeoBoundingBox).south,
    (tile?.bbox as GeoBoundingBox).east,
    (tile?.bbox as GeoBoundingBox).north,
  ]

  const getIntervalTimestamp = CONFIG_BY_INTERVAL[interval].getIntervalTimestamp
  const sublayersLength = buffersLength.length
  let cellNum = 0
  let startFrame = 0
  let endFrame = 0
  let indexInCell = 0
  let subLayerIndex = 0
  let subLayerBreak = buffersLength[subLayerIndex]
  const end = pbf.readPackedEnd()
  while (pbf.pos < end) {
    const value = pbf.readVarint()

    switch (indexInCell) {
      // this number defines the cell index
      case CELL_NUM_INDEX:
        cellNum = value
        break

      // this number defines the cell start frame
      case CELL_START_INDEX:
        startFrame = value - tileStartFrame
        break

      // this number defines the cell end frame
      case CELL_END_INDEX: {
        endFrame = value - tileStartFrame
        let feature = data.features.get(cellNum)
        const numTimeSteps = endFrame - startFrame + 1
        if (!feature) {
          // add the feature if previous sublayers didn't contain data for it
          const { col, row } = getCellProperties(tileBBox, cellNum, cols[subLayerIndex])
          feature = {
            coordinates: getCellCoordinates({
              cellIndex: cellNum,
              cols: cols[subLayerIndex],
              rows: rows[subLayerIndex],
              tileBBox,
            }),
            properties: {
              col,
              row,
              // values array not needed for vectors, but required by type - using empty array
              values: [],
              // Single dates array shared by both sublayers (U and V have same time steps)
              // Store in dates[0], dates[1] will remain empty
              dates: [new Array(numTimeSteps)],
              cellId: generateUniqueId(tile!.index.x, tile!.index.y, cellNum),
              cellNum,
              startOffsets: new Array(sublayersLength),
              initialValues: { [timeRangeKey]: new Array(sublayersLength) },
              // Initialize velocity and direction arrays for vector calculations
              velocities: new Array(numTimeSteps),
              directions: new Array(numTimeSteps),
            },
          }
          data.features.set(cellNum, feature)
        } else {
          // Ensure velocities and directions arrays exist even if feature was created in previous sublayer
          if (!feature.properties.velocities || !feature.properties.directions) {
            feature.properties.velocities = new Array(numTimeSteps)
            feature.properties.directions = new Array(numTimeSteps)
          }
        }

        // At this point, feature is guaranteed to be defined
        const currentFeature = feature!

        // Initialize first sublayer (U) values array for this cell if it doesn't exist yet
        // This ensures array exists even if some values are no-data
        if (subLayerIndex === 0 && !data.uValuesByCell.has(cellNum)) {
          data.uValuesByCell.set(cellNum, new Array(numTimeSteps))
        }

        // calculate how many values are in the tile
        const numCellValues = endFrame - startFrame + 1
        const numValuesBySubLayer = new Array(sublayersLength).fill(0)
        const sublayerScale = scale?.[subLayerIndex] ?? SCALE_VALUE
        const sublayerOffset = offset?.[subLayerIndex] ?? OFFSET_VALUE
        const sublayerNoDataValue = noDataValue?.[subLayerIndex] ?? NO_DATA_VALUE

        // Rest of the processing using currentFeature directly
        for (let j = 0; j < numCellValues; j++) {
          const cellValue = pbf.readVarint()
          if (cellValue !== sublayerNoDataValue) {
            if (!currentFeature.properties.startOffsets[subLayerIndex]) {
              // create properties for this sublayer if the feature dind't have it already
              currentFeature.properties.startOffsets[subLayerIndex] = startFrame
              currentFeature.properties.initialValues[timeRangeKey][subLayerIndex] = 0
            }
            const timeStepIndex = Math.floor(j)
            const scaledValue = cellValue * sublayerScale - sublayerOffset

            // add current date to the shared dates array (only populate once when processing first sublayer)
            if (subLayerIndex === 0) {
              currentFeature.properties.dates[0][timeStepIndex] = getIntervalTimestamp(
                startFrame + tileStartFrame + j
              )
            }

            // sum current value to the initialValue for this sublayer
            if (j + startFrame >= timeRangeStartFrame && j + startFrame < timeRangeEndFrame) {
              currentFeature.properties.initialValues[timeRangeKey][subLayerIndex] += scaledValue
              numValuesBySubLayer[subLayerIndex] = numValuesBySubLayer[subLayerIndex] + 1
            }

            // Store U values temporarily when processing first sublayer
            if (subLayerIndex === 0) {
              const uValues = data.uValuesByCell.get(cellNum)
              if (uValues) {
                uValues[timeStepIndex] = scaledValue
              }
            }

            // Calculate velocity and direction when processing the second sublayer
            // Convention: subLayerIndex 0 is U (eastward), subLayerIndex 1 is V (northward)
            // This assumes vectors always have exactly 2 sublayers
            // When processing subLayerIndex 1, we should already have all values from subLayerIndex 0
            if (sublayersLength === 2 && subLayerIndex === 1) {
              const uValues = data.uValuesByCell.get(cellNum)
              if (uValues) {
                const u = uValues[timeStepIndex]
                const v = scaledValue

                // Skip if either value is invalid or missing
                if (u !== undefined && v !== undefined && !isNaN(u) && !isNaN(v)) {
                  // Calculate velocity: sqrt(u^2 + v^2)
                  currentFeature.properties.velocities![timeStepIndex] = Math.sqrt(u * u + v * v)

                  // Calculate direction: (90 - atan2(v, u) * 180/π) % 360
                  const angleRad = Math.atan2(v, u)
                  const angleDeg = (90 - angleRad * RAD_TO_DEG) % 360
                  // Normalize to 0-360 range
                  currentFeature.properties.directions![timeStepIndex] = Math.round(
                    angleDeg < 0 ? angleDeg + 360 : angleDeg
                  )
                } else {
                  currentFeature.properties.velocities![timeStepIndex] = 0
                  currentFeature.properties.directions![timeStepIndex] = 0
                }
              }
            }
          }
        }
        if (aggregationOperation === 'avg') {
          currentFeature.properties.initialValues[timeRangeKey][subLayerIndex] =
            currentFeature.properties.initialValues[timeRangeKey][subLayerIndex] /
            numValuesBySubLayer[subLayerIndex]
        }

        // resseting indexInCell to start with the new cell
        indexInCell = -1
        break
      }
    }
    if (pbf.pos >= subLayerBreak) {
      subLayerIndex++
      subLayerBreak += buffersLength[subLayerIndex]
    }
    indexInCell++
  }
}

export const parseFourwingsVectors = (
  datasetsBuffer: ArrayBuffer,
  options?: FourwingsVectorsLoaderOptions
) => {
  const vectorsOptions = options?.fourwingsVectors
  if (!vectorsOptions || !vectorsOptions?.buffersLength?.length) {
    return []
  }
  const parseData = {
    options: vectorsOptions,
    features: new Map<number, FourwingsFeature>(),
    uValuesByCell: new Map<number, number[]>(),
  }
  const featuresMap = new Pbf(datasetsBuffer).readFields(getCellTimeseries, parseData).features

  const features = Array.from(featuresMap.values())

  return features
}
