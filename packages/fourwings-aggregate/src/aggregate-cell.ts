import { VALUE_MULTIPLIER } from './constants'
import { AggregationOperation } from './types'
import { getCellValues, getCellArrayIndex, getRealValues } from './util'

const aggregateCell = (
  rawValues: string,
  frame: number,
  delta: number,
  quantizeOffset: number,
  numSublayers: number,
  aggregationOperation = AggregationOperation.sum,
  multiplier = VALUE_MULTIPLIER
) => {
  if (!rawValues) return null

  const { values, minCellOffset, maxCellOffset } = getCellValues(rawValues)

  // When we should start counting in terms of days/hours/10days from start of time
  const startOffset = quantizeOffset + frame
  const endOffset = startOffset + delta

  if (startOffset > maxCellOffset || endOffset < minCellOffset) return null

  const cellStartOffset = Math.max(startOffset, minCellOffset)
  const cellEndOffset = Math.min(endOffset, maxCellOffset)

  // Where we sould start looking up in the array (minCellOffset, maxCellOffset, sublayer0valueAt0, sublayer1valueAt0, sublayer0valueAt1, sublayer1valueAt1, ...)
  const startAt = getCellArrayIndex(minCellOffset, numSublayers, cellStartOffset)
  const endAt = getCellArrayIndex(minCellOffset, numSublayers, cellEndOffset)

  const rawValuesArrSlice = values.slice(startAt, endAt)

  // One aggregated value per sublayer
  let aggregatedValues = new Array(numSublayers).fill(0)

  let numValues = 0
  for (let i = 0; i < rawValuesArrSlice.length; i++) {
    const sublayerIndex = i % numSublayers
    const rawValue = rawValuesArrSlice[i]
    if (rawValue !== null && rawValue !== undefined) {
      aggregatedValues[sublayerIndex] += rawValue
      if (sublayerIndex === 0) numValues++
    }
  }
  if (aggregationOperation === AggregationOperation.avg) {
    aggregatedValues = aggregatedValues.map((sublayerValue) => sublayerValue / numValues)
  }

  const realValues = getRealValues(aggregatedValues, multiplier)

  return realValues
}

export default aggregateCell
