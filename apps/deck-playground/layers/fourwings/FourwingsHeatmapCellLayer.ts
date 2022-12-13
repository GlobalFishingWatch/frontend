import { AccessorFunction, DefaultProps } from '@deck.gl/core'
import { _GeoCellLayer, GeoBoundingBox, _GeoCellLayerProps } from '@deck.gl/geo-layers/typed'
import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import {
  GetCellCoordinatesParams,
  generateUniqueId,
  getCellCoordinates,
} from 'loaders/fourwings/fourwingsTileParser'

const defaultProps: DefaultProps<FourwingsHeatmapCellLayerProps> = {
  getIndex: { type: 'accessor', value: (d) => d.index },
}

/** All properties supported by FourwingsHeatmapCellLayer. */
export type FourwingsHeatmapCellLayerProps<DataT = any> = _FourwingsHeatmapCellLayerProps<DataT> &
  _GeoCellLayerProps<DataT>

/** Properties added by FourwingsHeatmapCellLayer. */
type _FourwingsHeatmapCellLayerProps<DataT> = {
  /**
   * Called for each data object to retrieve the quadkey string identifier.
   *
   * By default, it reads `token` property of data object.
   */
  getIndex?: AccessorFunction<DataT, string>
  cols: number
  rows: number
  tile: Tile2DHeader
}

/** Render filled and/or stroked polygons based on the fourwings indexing system. */
export default class FourwingsHeatmapCellLayer<DataT = any, ExtraProps = {}> extends _GeoCellLayer<
  DataT,
  Required<_FourwingsHeatmapCellLayerProps<DataT>> & ExtraProps
> {
  static layerName = 'FourwingsHeatmapCellLayer'
  static defaultProps = defaultProps

  indexToBounds(): Partial<_GeoCellLayer['props']> | null {
    const { data, getIndex, tile, cols, rows } = this.props
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
          cols,
          rows,
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
