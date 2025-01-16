import { VALUE_MULTIPLIER } from './constants'
import type { CellAggregationParams } from './types';
import { AggregationOperation, SublayerCombinationMode } from './types'
import { getCellArrayIndex, getCellValues, getRealValues } from './util'

export const aggregateCell = ({
  rawValues,
  frame,
  delta,
  quantizeOffset,
  sublayerCount,
  aggregationOperation = AggregationOperation.Sum,
  sublayerCombinationMode = SublayerCombinationMode.Max,
  multiplier = VALUE_MULTIPLIER,
}: CellAggregationParams) => {
  if (!rawValues) return null
  const { values, minCellOffset, maxCellOffset } = getCellValues(rawValues)

  // When we should start counting in terms of days/hours from start of time
  const startOffset = quantizeOffset + frame
  const endOffset = startOffset + delta

  if (startOffset > maxCellOffset || endOffset < minCellOffset) {
    return null
  }

  const cellStartOffset = Math.max(startOffset, minCellOffset)
  const cellEndOffset = Math.min(endOffset, maxCellOffset)

  // Where we sould start looking up in the array (minCellOffset, maxCellOffset, sublayer0valueAt0, sublayer1valueAt0, sublayer0valueAt1, sublayer1valueAt1, ...)
  const startAt = getCellArrayIndex(minCellOffset, sublayerCount, cellStartOffset)
  const endAt = getCellArrayIndex(minCellOffset, sublayerCount, cellEndOffset)

  const rawValuesArrSlice = values.slice(startAt, endAt)

  // One aggregated value per sublayer
  let aggregatedValues = new Array(sublayerCount).fill(0)

  let numValues = 0
  for (let i = 0; i < rawValuesArrSlice.length; i++) {
    const sublayerIndex = i % sublayerCount
    const rawValue = rawValuesArrSlice[i]
    if (rawValue !== null && rawValue !== undefined && !isNaN(rawValue) && rawValue !== 0) {
      aggregatedValues[sublayerIndex] += rawValue
      if (sublayerIndex === 0) numValues++
    }
  }
  if (aggregationOperation === AggregationOperation.Avg && numValues > 0) {
    aggregatedValues = aggregatedValues.map((sublayerValue) => sublayerValue / numValues)
  }

  const realValues = getRealValues(aggregatedValues, { multiplier })

  if (sublayerCombinationMode === SublayerCombinationMode.TimeCompare) {
    return [realValues[1] - realValues[0]]
  }

  return realValues
}
