import { Color, CompositeLayer } from '@deck.gl/core/typed'
// import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import { Tile2DHeader } from '@deck.gl/geo-layers/typed/tileset-2d'
import { max, maxBy } from 'lodash'
import { PathLayer, TextLayer } from '@deck.gl/layers/typed'
import { GeoBoundingBox } from '@deck.gl/geo-layers/typed'
import { CONFIG_BY_INTERVAL } from '@globalfishingwatch/layer-composer'
import { Cell } from '../../loaders/fourwings/fourwingsLayerLoader'
import { TileCell } from '../../loaders/fourwings/fourwingsTileParser'
import FourwingsTileCellLayer from './FourwingsHeatmapCellLayer'
import {
  ColorDomain,
  FourwingsHeatmapTileLayerProps,
  SublayerColorRanges,
} from './FourwingsHeatmapTileLayer'
import { getChunksByInterval, getDatesInIntervalResolution, getInterval } from './fourwings.config'
import { aggregateCell } from './fourwings.utils'

export type FourwingsHeatmapLayerProps = FourwingsHeatmapTileLayerProps & {
  id: string
  tile: Tile2DHeader
  data: any
  cols: number
  rows: number
  colorDomain?: ColorDomain
  colorRanges?: SublayerColorRanges
}

export type AggregateCellParams = {
  minFrame: number
  maxFrame: number
}

export type GetFillColorParams = {
  minFrame: number
  maxFrame: number
  colorDomain: number[]
  colorRanges: FourwingsHeatmapLayerProps['colorRanges']
}

const EMPTY_CELL_COLOR = [0, 0, 0, 0] as Color

export const getFillColor = (
  cell: Cell,
  { minFrame, maxFrame, colorDomain, colorRanges }: GetFillColorParams
): Color => {
  if (!colorDomain || !colorRanges) {
    return EMPTY_CELL_COLOR
  }
  const aggregatedCellValues = aggregateCell(cell, { minFrame, maxFrame })
  // TODO add more comparison modes (bivariate)
  const aggregatedCellValue = max(aggregatedCellValues) as number
  if (!aggregatedCellValue) {
    return EMPTY_CELL_COLOR
  }
  // TODO review performance here
  const maxCellValueIndex = aggregatedCellValues.findIndex((v) => v === aggregatedCellValue)
  const colorIndex = colorDomain.findIndex((d, i) => {
    return colorDomain[i + 1]
      ? aggregatedCellValue > d && aggregatedCellValue <= colorDomain[i + 1]
      : true
  })
  return colorRanges[maxCellValueIndex][colorIndex]
}

export class FourwingsHeatmapLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsHeatmapLayer'
  renderLayers() {
    const { data, maxFrame, minFrame, rows, cols, colorDomain, colorRanges } = this.props
    if (!data || !colorDomain || !colorRanges) {
      return []
    }
    const FourwingsTileCellLayerClass = this.getSubLayerClass('cell', FourwingsTileCellLayer)
    const { west, east, north, south } = this.props.tile.bbox as GeoBoundingBox
    const { start, end } = getDatesInIntervalResolution(minFrame, maxFrame)
    const fourwingsLayer = new FourwingsTileCellLayerClass(
      this.props,
      this.getSubLayerProps({
        id: `fourwings-tile-${this.props.tile.id}`,
        data: data,
        cols,
        rows,
        pickable: true,
        stroked: false,
        getFillColor: (cell: Cell) =>
          // TODO check if this needs updating for different resolutions
          this.props.tile.zoom === Math.round(this.context.viewport.zoom)
            ? getFillColor(cell, { minFrame, maxFrame, colorDomain, colorRanges })
            : [0, 0, 0, 0],
        updateTriggers: {
          // This tells deck.gl to recalculate fillColor on changes
          getFillColor: [start, end, colorDomain, colorRanges],
        },
      })
    )

    if (!this.props.debug) return fourwingsLayer

    const debugLayers = [
      new PathLayer({
        id: `tile-boundary-${this.props.category}-${this.props.tile.id}`,
        data: [
          {
            path: [
              [west, north],
              [west, south],
              [east, south],
              [east, north],
              [west, north],
            ],
          },
        ],
        getPath: (d) => d.path,
        widthMinPixels: 1,
        getColor: [255, 0, 0, 100],
      }),
      new TextLayer({
        id: `tile-id-${this.props.category}-${this.props.tile.id}`,
        data: [
          {
            text: this.props.tile.id,
          },
        ],
        getText: (d) => d.text,
        getPosition: [west, north],
        getColor: [255, 255, 255],
        getSize: 12,
        getAngle: 0,
        getTextAnchor: 'start',
        getAlignmentBaseline: 'top',
      }),
    ]

    return [fourwingsLayer, ...debugLayers]
  }

  getData() {
    return this.props.data
  }
}
