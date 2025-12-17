import type { GeoBoundingBox } from '@deck.gl/geo-layers/dist/tileset-2d'
import Pbf from 'pbf'

import type { BBox } from '../helpers/cells'
import { generateUniqueId, getCellCoordinates, getCellProperties } from '../helpers/cells'
import { CONFIG_BY_INTERVAL } from '../helpers/time'

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

export const getCellVectorValues = (
  _: unknown,
  data: {
    features: Map<number, FourwingsFeature>
    options?: ParseFourwingsVectorsOptions
  },
  pbf: Pbf
) => {
  const { bufferedStartDate, interval, scale, offset, noDataValue, tile, cols, rows } =
    data.options || ({} as ParseFourwingsVectorsOptions)

  const tileStartFrame = CONFIG_BY_INTERVAL[interval].getIntervalFrame(bufferedStartDate)

  const tileBBox: BBox = [
    (tile?.bbox as GeoBoundingBox).west,
    (tile?.bbox as GeoBoundingBox).south,
    (tile?.bbox as GeoBoundingBox).east,
    (tile?.bbox as GeoBoundingBox).north,
  ]

  const getIntervalTimestamp = CONFIG_BY_INTERVAL[interval].getIntervalTimestamp
  const sublayersLength = 2
  let cellNum = 0
  let startFrame = 0
  let endFrame = 0
  let indexInCell = 0
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
        const subLayerIndex = 0
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
              // not needed for vectors, but required by types
              values: [],
              initialValues: {},
              // Single dates array shared by both sublayers (U and V have same time steps)
              dates: [new Array(numTimeSteps)],
              cellId: generateUniqueId(tile!.index.x, tile!.index.y, cellNum),
              cellNum,
              startOffsets: new Array(sublayersLength),
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

        const vectorScale = scale?.[0] ?? SCALE_VALUE
        const vectorOffset = offset?.[0] ?? OFFSET_VALUE
        const vectorNoDataValue = noDataValue?.[0] ?? NO_DATA_VALUE

        if (!feature.properties.startOffsets[0]) {
          feature.properties.startOffsets[0] = startFrame
        }
        if (!feature.properties.startOffsets[1]) {
          feature.properties.startOffsets[1] = startFrame
        }

        // U and V values are interleaved: U0, V0, U1, V1, U2, V2, ...
        for (let timeStepIndex = 0; timeStepIndex < numTimeSteps; timeStepIndex++) {
          const uValue = pbf.readVarint()
          const vValue = pbf.readVarint()
          feature.properties.dates[0][timeStepIndex] = getIntervalTimestamp(
            startFrame + tileStartFrame + timeStepIndex
          )

          let u: number | undefined
          if (uValue !== vectorNoDataValue) {
            u = uValue * vectorScale - vectorOffset
          }

          let v: number | undefined
          if (vValue !== vectorNoDataValue) {
            v = vValue * vectorScale - vectorOffset
          }

          // Calculate velocity and direction if both values are valid
          if (u !== undefined && v !== undefined && !isNaN(u) && !isNaN(v)) {
            // Calculate velocity: sqrt(u^2 + v^2)
            feature.properties.velocities![timeStepIndex] = Math.sqrt(u * u + v * v)

            // Calculate direction: (90 - atan2(v, u) * 180/π) % 360
            const angleRad = Math.atan2(v, u)
            const angleDeg = (90 - angleRad * RAD_TO_DEG) % 360
            // Normalize to 0-360 range
            feature.properties.directions![timeStepIndex] = Math.round(
              angleDeg < 0 ? angleDeg + 360 : angleDeg
            )
          } else {
            feature.properties.velocities![timeStepIndex] = 0
            feature.properties.directions![timeStepIndex] = 0
          }
        }

        // resetting indexInCell to start with the next cell
        indexInCell = -1
        break
      }
    }
    indexInCell++
  }
}

export const parseFourwingsVectors = (
  datasetsBuffer: ArrayBuffer,
  options?: FourwingsVectorsLoaderOptions
) => {
  const vectorsOptions = options?.fourwingsVectors
  if (!vectorsOptions) {
    return []
  }

  const parseData = {
    options: vectorsOptions,
    features: new Map<number, FourwingsFeature>(),
  }

  const featuresMap = new Pbf(datasetsBuffer).readFields(getCellVectorValues, parseData).features

  const features = Array.from(featuresMap.values())

  return features
}
