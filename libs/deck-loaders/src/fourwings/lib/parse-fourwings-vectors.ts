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

// Unit conversion constants
const MPS_TO_KNOTS = 1.943844
const MPS_TO_KMH = 3.6

// Helper type for vector processing context
type VectorProcessingContext = {
  scale: number
  offset: number
  noDataValue: number
  unit?: 'knots' | 'm/s' | 'km/h'
}

// Process a single u/v value pair from PBF
function processVectorValue(
  rawValue: number,
  context: VectorProcessingContext
): number | undefined {
  if (rawValue === context.noDataValue) {
    return undefined
  }
  return rawValue * context.scale - context.offset
}

// Calculate velocity from u and v components
function calculateVelocity(u: number, v: number, unit?: 'knots' | 'm/s' | 'km/h'): number {
  // Calculate velocity: sqrt(u^2 + v^2) in m/s (base unit)
  const velocity = Math.sqrt(u * u + v * v)

  if (unit === 'knots') {
    return velocity * MPS_TO_KNOTS
  }
  if (unit === 'km/h') {
    return velocity * MPS_TO_KMH
  }
  // If unit is 'mps' or undefined, velocity is already in m/s
  return velocity
}

// Calculate direction from u and v components
function calculateDirection(u: number, v: number): number {
  // Calculate direction: (90 - atan2(v, u) * 180/π) % 360
  const angleRad = Math.atan2(v, u)
  const angleDeg = (90 - angleRad * RAD_TO_DEG) % 360
  // Normalize to 0-360 range
  return Math.round(angleDeg < 0 ? angleDeg + 360 : angleDeg)
}

// Process u/v values and calculate velocity/direction
function processVectorComponents(
  uValue: number,
  vValue: number,
  context: VectorProcessingContext
): { velocity: number; direction: number } | null {
  const u = processVectorValue(uValue, context)
  const v = processVectorValue(vValue, context)

  if (u === undefined || v === undefined || isNaN(u) || isNaN(v)) {
    return null
  }

  return {
    velocity: calculateVelocity(u, v, context.unit),
    direction: calculateDirection(u, v),
  }
}

// Extract vector processing context from options
function getVectorContext(options: ParseFourwingsVectorsOptions): VectorProcessingContext {
  return {
    scale: options.scale?.[0] ?? SCALE_VALUE,
    offset: options.offset?.[0] ?? OFFSET_VALUE,
    noDataValue: options.noDataValue?.[0] ?? NO_DATA_VALUE,
    unit: options.unit,
  }
}

// Create tile bounding box from tile data
function createTileBBox(tile: ParseFourwingsVectorsOptions['tile']): BBox {
  const bbox = tile?.bbox as GeoBoundingBox
  return [bbox.west, bbox.south, bbox.east, bbox.north]
}

// Create a new feature for a cell
function createFeature(
  cellNum: number,
  tileBBox: BBox,
  cols: number[],
  rows: number[],
  tile: ParseFourwingsVectorsOptions['tile'],
  subLayerIndex: number,
  numTimeSteps: number = 1
): FourwingsFeature {
  const { col, row } = getCellProperties(tileBBox, cellNum, cols[subLayerIndex])
  const sublayersLength = 2

  return {
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
      dates: numTimeSteps > 1 ? [new Array(numTimeSteps)] : [],
      cellId: generateUniqueId(tile!.index.x, tile!.index.y, cellNum),
      cellNum,
      startOffsets: new Array(sublayersLength),
      velocities: new Array(numTimeSteps),
      directions: new Array(numTimeSteps),
    },
  }
}

export const getCellVectorValuesAggregated = (
  _: unknown,
  data: {
    features: Map<number, FourwingsFeature>
    options?: ParseFourwingsVectorsOptions
  },
  pbf: Pbf
) => {
  const options = data.options || ({} as ParseFourwingsVectorsOptions)
  const { tile, cols, rows } = options

  if (!tile || !cols || !rows) {
    return
  }

  const tileBBox = createTileBBox(tile)
  const context = getVectorContext(options)
  const end = pbf.readPackedEnd()
  const subLayerIndex = 0

  while (pbf.pos < end) {
    const cellNum = pbf.readVarint()
    const uValue = pbf.readVarint()
    const vValue = pbf.readVarint()

    let feature = data.features.get(cellNum)
    if (!feature) {
      feature = createFeature(cellNum, tileBBox, cols, rows, tile, subLayerIndex, 1)
      data.features.set(cellNum, feature)
    }

    const result = processVectorComponents(uValue, vValue, context)
    if (result) {
      feature.properties.velocities![0] = result.velocity
      feature.properties.directions![0] = result.direction
    }
  }
}

export const getCellVectorValues = (
  _: unknown,
  data: {
    features: Map<number, FourwingsFeature>
    options?: ParseFourwingsVectorsOptions
  },
  pbf: Pbf
) => {
  const options = data.options || ({} as ParseFourwingsVectorsOptions)
  const { bufferedStartDate, interval, tile, cols, rows } = options

  if (!tile || !cols || !rows || !interval || bufferedStartDate === undefined) {
    return
  }

  const intervalConfig = CONFIG_BY_INTERVAL[interval]
  const tileStartFrame = intervalConfig.getIntervalFrame(bufferedStartDate)
  const getIntervalTimestamp = intervalConfig.getIntervalTimestamp
  const tileBBox = createTileBBox(tile)
  const context = getVectorContext(options)

  let cellNum = 0
  let startFrame = 0
  let endFrame = 0
  let indexInCell = 0
  const end = pbf.readPackedEnd()
  const subLayerIndex = 0

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
        const numTimeSteps = endFrame - startFrame + 1

        let feature = data.features.get(cellNum)
        if (!feature) {
          // add the feature if previous sublayers didn't contain data for it
          feature = createFeature(cellNum, tileBBox, cols, rows, tile, subLayerIndex, numTimeSteps)
          // Single dates array shared by both sublayers (U and V have same time steps)
          feature.properties.dates = [new Array(numTimeSteps)]
          data.features.set(cellNum, feature)
        } else {
          // Ensure velocities and directions arrays exist even if feature was created in previous sublayer
          if (!feature.properties.velocities || !feature.properties.directions) {
            feature.properties.velocities = new Array(numTimeSteps)
            feature.properties.directions = new Array(numTimeSteps)
          }
        }

        // Set start offsets for both sublayers
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

          const result = processVectorComponents(uValue, vValue, context)
          if (result) {
            feature.properties.velocities![timeStepIndex] = result.velocity
            feature.properties.directions![timeStepIndex] = result.direction
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

  const featuresMap = new Pbf(datasetsBuffer).readFields(
    vectorsOptions.temporalAggregation ? getCellVectorValuesAggregated : getCellVectorValues,
    parseData
  ).features

  const features = Array.from(featuresMap.values())

  return features
}
