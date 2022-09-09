import { AccessorFunction, DefaultProps } from '@deck.gl/core'
import { GeoBoundingBox } from '@deck.gl/geo-layers/typed'
import GeoCellLayer, {
  GeoCellLayerProps,
} from '@deck.gl/geo-layers/typed/geo-cell-layer/GeoCellLayer'
import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import {
  GetCellCoordinatesParams,
  generateUniqueId,
  getCellCoordinates,
} from 'loaders/fourwings/fourwingsTileParser'

const defaultProps: DefaultProps<FourwingsTileCellLayerProps> = {
  getIndex: { type: 'accessor', value: (d) => d.index },
}

/** All properties supported by FourwingsTileCellLayer. */
export type FourwingsTileCellLayerProps<DataT = any> = _FourwingsTileCellLayerProps<DataT> &
  GeoCellLayerProps<DataT>

/** Properties added by FourwingsTileCellLayer. */
type _FourwingsTileCellLayerProps<DataT> = {
  /**
   * Called for each data object to retrieve the quadkey string identifier.
   *
   * By default, it reads `token` property of data object.
   */
  getIndex?: AccessorFunction<DataT, string>
  numCols: number
  numRows: number
  tile: Tile2DHeader
}

/** Render filled and/or stroked polygons based on the fourwings indexing system. */
export default class FourwingsTileCellLayer<DataT = any, ExtraProps = {}> extends GeoCellLayer<
  DataT,
  Required<_FourwingsTileCellLayerProps<DataT>> & ExtraProps
> {
  static layerName = 'FourwingsTileCellLayer'
  static defaultProps = defaultProps

  indexToBounds(): Partial<GeoCellLayer['props']> | null {
    const { data, getIndex, tile, numCols, numRows } = this.props
    return {
      data,
      _normalize: false,
      positionFormat: 'XY',
      getPolygon: (x: DataT, objectInfo) => {
        const cellIndex = getIndex(x, objectInfo)
        const uniqueId = generateUniqueId(tile.index.x, tile.index.y, cellIndex)
        const params: GetCellCoordinatesParams = {
          id: uniqueId,
          cellIndex,
          numCols,
          numRows,
          tileBBox: [
            (tile.bbox as GeoBoundingBox).west,
            (tile.bbox as GeoBoundingBox).south,
            (tile.bbox as GeoBoundingBox).east,
            (tile.bbox as GeoBoundingBox).north,
          ],
        }
        return getCellCoordinates(params)
      },
    }
  }
}
