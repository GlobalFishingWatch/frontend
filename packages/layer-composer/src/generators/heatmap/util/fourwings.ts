export const getCellValues = (rawValues: string) => {
  // Raw values come as a single string (MVT limitation), turn into an array of ints first
  const values: number[] = rawValues.split(',').map((v) => parseInt(v))

  // First two values for a cell are the overall start and end time offsets for all the cell values (in days/hours/10days from start of time)
  const minCellOffset = values[0]
  const maxCellOffset = values[1]

  return { values, minCellOffset, maxCellOffset }
}

export const getRealValues = (rawValues: number[]) => {
  // Raw 4w API values come without decimals, multiplied by 100
  const VALUE_MULTIPLIER = 100
  const realValues = rawValues.map((v) => v / VALUE_MULTIPLIER)
  return realValues
}
