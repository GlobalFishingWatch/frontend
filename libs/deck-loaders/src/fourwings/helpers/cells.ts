export type BBox = [number, number, number, number]

export type GetCellCoordinatesParams = {
  tileBBox: BBox
  cellIndex: number
  cols: number
  rows: number
  id: number
}

export const getCellCoordinates = ({
  tileBBox,
  cellIndex,
  cols,
  rows,
}: GetCellCoordinatesParams): number[] => {
  const col = cellIndex % cols
  const row = Math.floor(cellIndex / cols)
  const [minX, minY, maxX, maxY] = tileBBox
  const width = maxX - minX
  const height = maxY - minY
  const squareMinX = minX + (col / cols) * width
  const squareMinY = minY + (row / rows) * height
  const squareMaxX = minX + ((col + 1) / cols) * width
  const squareMaxY = minY + ((row + 1) / rows) * height
  return [
    squareMinX,
    squareMinY,
    squareMaxX,
    squareMinY,
    squareMaxX,
    squareMaxY,
    squareMinX,
    squareMaxY,
    squareMinX,
    squareMinY,
  ]
}

const getLastDigit = (num: number) => parseInt(num.toString().slice(-1))

export const generateUniqueId = (x: number, y: number, cellId: number) =>
  parseInt([getLastDigit(x) + 1, getLastDigit(y) + 1, cellId].join(''))
