import type { Position } from 'geojson'

export type BBox = [number, number, number, number]

export const getCellProperties = (tileBBox: BBox, cellIndex: number, numCols: number) => {
  const col = cellIndex % numCols
  const row = Math.floor(cellIndex / numCols)
  const [minX, minY, maxX, maxY] = tileBBox
  const width = maxX - minX
  const height = maxY - minY
  return {
    col,
    row,
    width,
    height,
  }
}

export type GetCellCoordinatesParams = {
  tileBBox: BBox
  cellIndex: number
  cols: number
  rows: number
  flat?: boolean
}

export const getCellBounds = ({
  tileBBox,
  cellIndex,
  cols,
  rows,
}: GetCellCoordinatesParams): number[] => {
  const { col, row, width, height } = getCellProperties(tileBBox, cellIndex, cols)
  const [minX, minY] = tileBBox
  const squareMinX = minX + (col / cols) * width
  const squareMinY = minY + (row / rows) * height
  const squareMaxX = minX + ((col + 1) / cols) * width
  const squareMaxY = minY + ((row + 1) / rows) * height
  return [squareMinX, squareMinY, squareMaxX, squareMaxY]
}

export const getCellCoordinates = (params: GetCellCoordinatesParams): number[] => {
  const [squareMinX, squareMinY, squareMaxX, squareMaxY] = getCellBounds(params)
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

export const getCellPointCoordinates = (params: GetCellCoordinatesParams): Position => {
  const [squareMinX, squareMinY, squareMaxX, squareMaxY] = getCellBounds(params)
  return [squareMinX + (squareMaxX - squareMinX) / 2, squareMinY + (squareMaxY - squareMinY) / 2]
}

const getLastDigit = (num: number) => parseInt(num.toString().slice(-1))

export const generateUniqueId = (x: number, y: number, cellId: number) =>
  parseInt([getLastDigit(x) + 1, getLastDigit(y) + 1, cellId].join(''))
