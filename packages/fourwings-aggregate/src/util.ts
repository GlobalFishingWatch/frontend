import {
  CELL_START_INDEX,
  CELL_END_INDEX,
  VALUE_MULTIPLIER,
  CELL_VALUES_START_INDEX,
} from './constants'

export const getCellValues = (rawValues: string | number[]) => {
  // Raw values come as a single string (MVT limitation), turn into an array of ints first
  const values = Array.isArray(rawValues)
    ? rawValues
    : rawValues
        .slice(1, -1)
        .split(',')
        .map((v) => parseInt(v))
  // First two values for a cell are the overall start and end time offsets for all the cell values (in days/hours/10days from start of time)
  const minCellOffset = values[CELL_START_INDEX]
  const maxCellOffset = values[CELL_END_INDEX]

  return { values, minCellOffset, maxCellOffset }
}

export const getRealValue = (rawValue: number) => rawValue / VALUE_MULTIPLIER

export const getRealValues = (rawValues: number[]) => {
  // Raw 4w API values come without decimals, multiplied by 100
  const realValues = rawValues.map(getRealValue)
  return realValues
}

export const getCellArrayIndex = (minCellOffset: number, numSublayers: number, offset: number) => {
  return CELL_VALUES_START_INDEX + (offset - minCellOffset) * numSublayers
}

const getLastDigit = (num: number) => parseInt(num.toString().slice(-1))
// In order for setFeatureState to work correctly, generate unique IDs across viewport-visible tiles:
// concatenate last x/z digits and cell increment index (goal is to get numbers as small as possible)
export const generateUniqueId = (x: number, y: number, cellId: number) =>
  [getLastDigit(x), getLastDigit(y), cellId].join('')
