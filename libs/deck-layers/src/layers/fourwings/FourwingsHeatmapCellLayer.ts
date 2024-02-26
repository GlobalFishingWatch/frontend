import {
  AccessorFunction,
  DefaultProps,
  GetPickingInfoParams,
  PickingInfo,
} from '@deck.gl/core/typed'
import { _GeoCellLayer, GeoBoundingBox, _GeoCellLayerProps } from '@deck.gl/geo-layers/typed'
// import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import { Tile2DHeader } from '@deck.gl/geo-layers/typed/tileset-2d'
import { Cell, generateUniqueId, getCellCoordinates } from '@globalfishingwatch/deck-loaders'
import { CONFIG_BY_INTERVAL } from '../../utils/time'
import { FourwingsHeatmapLayerProps } from './FourwingsHeatmapLayer'
import { aggregateCell } from './fourwings.utils'
import { getChunks } from './fourwings.config'

const defaultProps: DefaultProps<FourwingsHeatmapCellLayerProps> = {
  getIndex: { type: 'accessor', value: (d) => d.index },
}

/** All properties supported by FourwingsHeatmapCellLayer. */
export type FourwingsHeatmapCellLayerProps<DataT = any> = _FourwingsHeatmapCellLayerProps<DataT> &
  _GeoCellLayerProps<DataT>

/** Properties added by FourwingsHeatmapCellLayer. */
type _FourwingsHeatmapCellLayerProps<DataT> = FourwingsHeatmapLayerProps & {
  /**
   * Called for each data object to retrieve the quadkey string identifier.
   *
   * By default, it reads `token` property of data object.
   */
  getIndex?: AccessorFunction<DataT, string>
  cols: number
  rows: number
  tile: Tile2DHeader
  indexes: number[]
}

/** Render filled and/or stroked polygons based on the fourwings indexing system. */
export default class FourwingsHeatmapCellLayer<DataT = any, ExtraProps = {}> extends _GeoCellLayer<
  DataT,
  Required<_FourwingsHeatmapCellLayerProps<DataT>> & ExtraProps
> {
  static layerName = 'FourwingsHeatmapCellLayer'
  static defaultProps = defaultProps

  getPickingInfo({ info }: GetPickingInfoParams): PickingInfo {
    const { minFrame, maxFrame, startFrames } = this.props
    if (info.object) {
      const chunks = getChunks(minFrame, maxFrame)
      const tileMinIntervalFrame = Math.ceil(
        CONFIG_BY_INTERVAL['DAY'].getIntervalFrame(chunks?.[0].start)
      )

      const cellStartFrame = startFrames[info.index]
      const minIntervalFrame =
        Math.ceil(CONFIG_BY_INTERVAL['DAY'].getIntervalFrame(minFrame)) - tileMinIntervalFrame
      const maxIntervalFrame =
        Math.ceil(CONFIG_BY_INTERVAL['DAY'].getIntervalFrame(maxFrame)) - tileMinIntervalFrame
      const value = aggregateCell(info.object, {
        minIntervalFrame,
        maxIntervalFrame,
        startFrames: cellStartFrame,
      })
      if (value) {
        info.object = {
          ...info.object,
          value,
        }
      }
    }
    return info
  }

  indexToBounds(): Partial<_GeoCellLayer['props']> | null {
    const { data, indexes, tile, cols, rows } = this.props
    const getPolygon = (_: Cell, { index, target }: { index: number; target: number[] }) => {
      const cellIndex = indexes[index]
      target = getCellCoordinates({
        id: generateUniqueId(tile.index.x, tile.index.y, cellIndex),
        cellIndex,
        cols,
        rows,
        tileBBox: [
          (tile.bbox as GeoBoundingBox).west,
          (tile.bbox as GeoBoundingBox).south,
          (tile.bbox as GeoBoundingBox).east,
          (tile.bbox as GeoBoundingBox).north,
        ],
      })
      return target
    }
    return {
      data,
      _normalize: false,
      positionFormat: 'XY',
      getPolygon,
    }
  }
}
