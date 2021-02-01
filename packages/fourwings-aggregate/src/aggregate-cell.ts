import {
  CELL_START_INDEX,
  CELL_END_INDEX,
  VALUE_MULTIPLIER,
  CELL_VALUES_START_INDEX,
} from './constants'

export const getCellValues = (rawValues: string) => {
  // Raw values come as a single string (MVT limitation), turn into an array of ints first
  const values: number[] = rawValues.split(',').map((v) => parseInt(v))

  // First two values for a cell are the overall start and end time offsets for all the cell values (in days/hours/10days from start of time)
  const minCellOffset = values[CELL_START_INDEX]
  const maxCellOffset = values[CELL_END_INDEX]

  return { values, minCellOffset, maxCellOffset }
}

export const getRealValues = (rawValues: number[]) => {
  // Raw 4w API values come without decimals, multiplied by 100
  const realValues = rawValues.map((v) => v / VALUE_MULTIPLIER)
  return realValues
}

export const getCellArrayIndex = (minCellOffset: number, numSublayers: number, offset: number) => {
  return CELL_VALUES_START_INDEX + (offset - minCellOffset) * numSublayers
}

export const aggregateCell = (
  rawValues: string,
  frame: number,
  delta: number,
  quantizeOffset: number,
  numSublayers: number,
  debug = false
) => {
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
  const aggregatedValues = new Array(numSublayers).fill(0)

  for (let i = 0; i < rawValuesArrSlice.length; i++) {
    const sublayerIndex = i % numSublayers
    const rawValue = rawValuesArrSlice[i]
    if (rawValue) {
      aggregatedValues[sublayerIndex] += rawValue
    }
  }
  const realValues = getRealValues(aggregatedValues)

  return realValues
}
