import { CELL_VALUES_START_INDEX } from './constants'
import { AggregationOperation } from './types'
import { getCellValues } from './util'

type Feature = {
  properties: {
    rawValues: string
  }
}

interface TimeSeriesFrame {
  frame: number
  // key will be "0", "1", etc corresponding to a stringified sublayer index.
  // This is intended to accomodate the d3 layouts we use. The associated value corresponds to
  // the sum or avg (depending on aggregationOp used) for all cells at this frame for this sublayer
  [key: string]: number
}

type TimeSeries = {
  values: TimeSeriesFrame[]
  minFrame: number
  maxFrame: number
}

const getTimeSeries = (
  features: Feature[],
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

  const valuesByFrame: { sublayersValues: number[]; numFrames: number }[] = []

  features.forEach((feature) => {
    const rawValues: string = feature.properties.rawValues
    const { values, minCellOffset, maxCellOffset } = getCellValues(rawValues)
    if (minCellOffset < minFrame) minFrame = minCellOffset
    if (maxCellOffset > maxFrame) maxFrame = maxCellOffset
    let currentFrameIndex = minCellOffset - quantizeOffset
    for (let i = CELL_VALUES_START_INDEX; i < values.length; i++) {
      const sublayerIndex = (i - CELL_VALUES_START_INDEX) % numSublayers
      const rawValue = values[i]
      if (!valuesByFrame[currentFrameIndex]) {
        valuesByFrame[currentFrameIndex] = {
          sublayersValues: new Array(numSublayers).fill(0),
          numFrames: 0,
        }
      }

      valuesByFrame[currentFrameIndex].sublayersValues[sublayerIndex] += rawValue

      if (sublayerIndex === numSublayers - 1) {
        valuesByFrame[currentFrameIndex].numFrames++
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
          (sublayerValue) => sublayerValue / frameValues.numFrames
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

export default getTimeSeries
