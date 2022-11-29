import { CellTimeseries } from 'loaders/fourwings/fourwingsLayerLoader'

export type BBox = [number, number, number, number]

export type TileCell = {
  timeseries: CellTimeseries[]
  coordinates: [number[]]
}

export type GetCellCoordinatesParams = {
  tileBBox: BBox
  cellIndex: number
  cols: number
  rows: number
  id: number
}

const getCellProperties = (tileBBox: BBox, cell: number, numCols: number) => {
  const col = cell % numCols
  const row = Math.floor(cell / numCols)
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

export const getCellCoordinates = ({
  tileBBox,
  cellIndex,
  cols,
  rows,
}: GetCellCoordinatesParams): any => {
  const [minX, minY] = tileBBox
  const { col, row, width, height } = getCellProperties(tileBBox, cellIndex, cols)

  const squareMinX = minX + (col / cols) * width
  const squareMinY = minY + (row / rows) * height
  const squareMaxX = minX + ((col + 1) / cols) * width
  const squareMaxY = minY + ((row + 1) / rows) * height
  const result = new Float64Array(10)
  result[0] = squareMinX
  result[1] = squareMinY
  result[2] = squareMaxX
  result[3] = squareMinY
  result[4] = squareMaxX
  result[5] = squareMaxY
  result[6] = squareMinX
  result[7] = squareMaxY
  result[8] = squareMinX
  result[9] = squareMinY
  return result
}

const getLastDigit = (num: number) => parseInt(num.toString().slice(-1))

export const generateUniqueId = (x: number, y: number, cellId: number) =>
  parseInt([getLastDigit(x) + 1, getLastDigit(y) + 1, cellId].join(''))
