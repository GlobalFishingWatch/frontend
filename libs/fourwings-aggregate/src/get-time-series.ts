import type { VectorTileFeature } from '@mapbox/vector-tile'

import { CELL_VALUES_START_INDEX, VALUE_MULTIPLIER } from './constants'
import { AggregationOperation } from './types'
import { getCellValues } from './util'

// Copied from maplibre fork to avoid circular dependencies
export declare class GeoJSONFeature<P = Record<string, any>> {
  type: 'Feature'
  _geometry: GeoJSON.Geometry
  properties: P
  id: number | string | undefined
  _vectorTileFeature: VectorTileFeature
  constructor(
    vectorTileFeature: VectorTileFeature,
    z: number,
    x: number,
    y: number,
    id: string | number | undefined
  )
  get geometry(): GeoJSON.Geometry
  set geometry(g: GeoJSON.Geometry)
  toJSON(): any
}

export type TimeseriesFeatureProps = {
  rawValues: string
}

export interface TimeSeriesFrame {
  frame: number
  // key will be "0", "1", etc corresponding to a stringified sublayer index.
  // This is intended to accomodate the d3 layouts we use. The associated value corresponds to
  // the sum or avg (depending on aggregationOp used) for all cells at this frame for this sublayer
  [key: string]: number
}

export type TimeSeries = {
  values: TimeSeriesFrame[]
  minFrame: number
  maxFrame: number
}

export type GetTimeseriesParams = {
  features: GeoJSONFeature<TimeseriesFeatureProps>[]
  numSublayers: number
  quantizeOffset: number
  aggregationOperation: AggregationOperation
  minVisibleValue?: number
  maxVisibleValue?: number
}

export const getTimeSeries = ({
  features,
  numSublayers,
  quantizeOffset = 0,
  aggregationOperation = AggregationOperation.Sum,
  minVisibleValue,
  maxVisibleValue,
}: GetTimeseriesParams): TimeSeries => {
  let minFrame = Number.POSITIVE_INFINITY
  let maxFrame = Number.NEGATIVE_INFINITY

  if (!features || !features.length) {
    return {
      values: [],
      minFrame,
      maxFrame,
    }
  }

  const valuesByFrame: { sublayersValues: number[]; numValues: number }[] = []
  features.forEach((feature) => {
    const rawValues: string = feature.properties.rawValues
    const { values, minCellOffset } = getCellValues(rawValues)

    if (minCellOffset < minFrame) minFrame = minCellOffset
    let currentFrameIndex = minCellOffset
    let offsetedCurrentFrameIndex = minCellOffset - quantizeOffset
    for (let i = CELL_VALUES_START_INDEX; i < values.length; i++) {
      const sublayerIndex = (i - CELL_VALUES_START_INDEX) % numSublayers
      const rawValue = values[i]
      const matchesMin =
        minVisibleValue !== undefined ? rawValue >= minVisibleValue * VALUE_MULTIPLIER : true
      const matchesMax =
        maxVisibleValue !== undefined ? rawValue <= maxVisibleValue * VALUE_MULTIPLIER : true
      if (rawValue !== null && !isNaN(rawValue) && matchesMin && matchesMax) {
        if (currentFrameIndex > maxFrame) maxFrame = currentFrameIndex
        if (!valuesByFrame[offsetedCurrentFrameIndex]) {
          valuesByFrame[offsetedCurrentFrameIndex] = {
            sublayersValues: new Array(numSublayers).fill(0),
            numValues: 0,
          }
        }
        valuesByFrame[offsetedCurrentFrameIndex].sublayersValues[sublayerIndex] += rawValue
        if (sublayerIndex === numSublayers - 1) {
          // assuming that if last sublayer value !isNaN, other sublayer values too
          valuesByFrame[offsetedCurrentFrameIndex].numValues++
        }
      }
      if (sublayerIndex === numSublayers - 1) {
        offsetedCurrentFrameIndex++
        currentFrameIndex++
      }
    }
  })

  let finalValues: TimeSeriesFrame[] = []
  const numValues = maxFrame - minFrame
  if (numValues > 0) {
    finalValues = new Array(numValues)
    for (let i = 0; i <= numValues; i++) {
      const frame = minFrame + i
      const frameValues = valuesByFrame[frame - quantizeOffset] ?? {
        sublayersValues: new Array(numSublayers).fill(0),
        numValues: 0,
      }
      let sublayersValues
      if (frameValues) {
        sublayersValues = frameValues.sublayersValues
        if (aggregationOperation === AggregationOperation.Avg) {
          sublayersValues = sublayersValues.map((sublayerValue) => {
            if (sublayerValue === 0 || frameValues.numValues === 0) {
              return 0
            }
            return sublayerValue / frameValues.numValues
          })
        }
      }
      finalValues[i] = {
        frame,
        ...sublayersValues,
      } as TimeSeriesFrame
    }
  }

  return { values: finalValues, minFrame, maxFrame }
}
