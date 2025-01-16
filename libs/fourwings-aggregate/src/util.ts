import {
  CELL_END_INDEX,
  CELL_START_INDEX,
  CELL_VALUES_START_INDEX,
  VALUE_MULTIPLIER,
} from './constants'

export const getCellValues = (rawValues: string | number[]) => {
  // Raw values come as a single string (MVT limitation), turn into an array of ints first
  const values = Array.isArray(rawValues)
    ? rawValues
    : rawValues
        .slice(1, -1)
        .split(',')
        .map((v) => parseInt(v))
  // First two values for a cell are the overall start and end time offsets for all the cell values (in days/hours from start of time)
  const minCellOffset = values[CELL_START_INDEX]
  const maxCellOffset = values[CELL_END_INDEX]

  return { values, minCellOffset, maxCellOffset }
}

export type RealValueOptions = { multiplier?: number; offset?: number }
export const getRealValue = (
  rawValue: number,
  { multiplier = VALUE_MULTIPLIER, offset = 0 }: RealValueOptions = {}
) => {
  return rawValue / multiplier - offset
}

export const getRealValues = (rawValues: number[], options: RealValueOptions = {}) => {
  // Raw 4w API values come without decimals, multiplied by 100
  const realValues = rawValues.map((sublayerValue) => getRealValue(sublayerValue, options))
  return realValues
}

export const getCellArrayIndex = (minCellOffset: number, numSublayers: number, offset: number) => {
  return CELL_VALUES_START_INDEX + (offset - minCellOffset) * numSublayers
}

const getLastDigit = (num: number) => parseInt(num.toString().slice(-1))
// In order for setFeatureState to work correctly, generate unique IDs across viewport-visible tiles:
// concatenate last x/z digits and cell increment index (goal is to get numbers as small as possible)
export const generateUniqueId = (x: number, y: number, cellId: number) =>
  parseInt([getLastDigit(x) + 1, getLastDigit(y) + 1, cellId].join(''))
