import { GeoBoundingBox } from '@deck.gl/geo-layers/typed'
import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import { FourwingsGPUTileData, GPUCell } from 'layers/fourwings-gpu/FourwingsGPULoader'
import { CellTimeseries, FourwingsTileData } from 'loaders/fourwings/fourwingsLayerLoader'

export type BBox = [number, number, number, number]

export type FeatureParams = {
  tileBBox: BBox
  cell: number
  numCols: number
  numRows: number
  id: number
}

export const getCellWidth = (tileBBox: BBox, numCols: number) => {
  const [minX, minY, maxX, maxY] = tileBBox
  const width = maxX - minX
  return width / numCols
}

export const getCellProperties = (tileBBox: BBox, cell: number, numCols: number) => {
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

const getCellCoordinates = ({ tileBBox, cell, numCols, numRows }: FeatureParams): any => {
  const [minX, minY] = tileBBox
  const { col, row, width, height } = getCellProperties(tileBBox, cell, numCols)

  const squareMinX = minX + (col / numCols) * width
  const squareMinY = minY + (row / numRows) * height
  const squareMaxX = minX + ((col + 1) / numCols) * width
  const squareMaxY = minY + ((row + 1) / numRows) * height

  return [squareMinX, squareMinY]
  // return [
  //   [
  //     [squareMinX, squareMinY],
  //     [squareMaxX, squareMinY],
  //     [squareMaxX, squareMaxY],
  //     [squareMinX, squareMaxY],
  //     [squareMinX, squareMinY],
  //   ],
  // ]
}

const getLastDigit = (num: number) => parseInt(num.toString().slice(-1))

export const generateUniqueId = (x: number, y: number, cellId: number) =>
  parseInt([getLastDigit(x) + 1, getLastDigit(y) + 1, cellId].join(''))

export type TileCell = GPUCell & {
  coordinates: [number, number]
}
export const getTileCellsCoordinates = (
  tile: Tile2DHeader,
  data: FourwingsGPUTileData
): TileCell[] => {
  if (!data.cells?.length) {
    return []
  }
  const { west, south, east, north } = tile.bbox as GeoBoundingBox
  return data.cells?.map((cell) => {
    const uniqueId = generateUniqueId(tile.index.x, tile.index.y, cell.cellIndex)
    const params: FeatureParams = {
      id: uniqueId,
      cell: cell.cellIndex,
      numCols: data.cols,
      numRows: data.rows,
      tileBBox: [west, south, east, north],
    }
    return {
      ...cell,
      coordinates: getCellCoordinates(params),
    }
  })
}
