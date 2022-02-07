import { GeoJSONFeature } from '@globalfishingwatch/maplibre-gl'
import { CELL_VALUES_START_INDEX } from './constants'
import { AggregationOperation } from './types'
import { getCellValues } from './util'

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

export const getTimeSeries = (
  features: GeoJSONFeature<TimeseriesFeatureProps>[],
  numSublayers: number,
  quantizeOffset = 0,
  aggregationOperation = AggregationOperation.Sum
): TimeSeries => {
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
      if (!isNaN(rawValue)) {
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

  const numValues = maxFrame - minFrame
  const finalValues = new Array(numValues)
  for (let i = 0; i <= numValues; i++) {
    const frame = minFrame + i
    const frameValues = valuesByFrame[frame - quantizeOffset]
    let sublayersValues
    if (frameValues) {
      sublayersValues = frameValues.sublayersValues
      if (aggregationOperation === AggregationOperation.Avg) {
        sublayersValues = sublayersValues.map(
          (sublayerValue) => sublayerValue / frameValues.numValues
        )
      }
    }
    finalValues[i] = {
      frame,
      ...sublayersValues,
    }
  }

  return { values: finalValues, minFrame, maxFrame }
}
