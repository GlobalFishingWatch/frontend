import { Color, CompositeLayer } from '@deck.gl/core/typed'
import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import { maxBy } from 'lodash'
import { PathLayer, TextLayer } from '@deck.gl/layers/typed'
import { GeoBoundingBox } from '@deck.gl/geo-layers/typed'
import { Cell } from '../../loaders/fourwings/fourwingsLayerLoader'
import { TileCell } from '../../loaders/fourwings/fourwingsTileParser'
import FourwingsTileCellLayer from './FourwingsHeatmapCellLayer'
import {
  ColorDomain,
  FourwingsHeatmapTileLayerProps,
  SublayerColorRanges,
} from './FourwingsHeatmapTileLayer'
import { getDatesInIntervalResolution } from './fourwings.config'

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

export const aggregateCell = (
  cell: Cell | TileCell,
  { minFrame, maxFrame }: AggregateCellParams
) => {
  if (!cell) return []
  return Object.keys(cell.timeseries).map((key) => ({
    id: key,
    value: Object.keys(cell.timeseries[key]).reduce((acc, frame) => {
      if (parseInt(frame) >= minFrame && parseInt(frame) <= maxFrame) {
        return acc + cell.timeseries[key][frame]
      }
      return acc
    }, 0) as number,
  }))
}

export type GetFillColorParams = {
  minFrame: number
  maxFrame: number
  colorDomain: number[]
  colorRanges: FourwingsHeatmapLayerProps['colorRanges']
}

export const getFillColor = (
  cell: Cell,
  { minFrame, maxFrame, colorDomain, colorRanges }: GetFillColorParams
): Color => {
  const filteredCellValues = aggregateCell(cell, { minFrame, maxFrame })
  // TODO add more comparison modes
  const cellValueByMode = maxBy(filteredCellValues, 'value')
  if (!colorDomain || !colorRanges || !cellValueByMode?.value) {
    return [0, 0, 0, 0]
  }
  const colorIndex = colorDomain.findIndex((d, i) => {
    if (colorDomain[i + 1]) {
      return cellValueByMode.value > d && cellValueByMode.value <= colorDomain[i + 1]
    }
    return i
  })
  return colorIndex >= 0 ? colorRanges[cellValueByMode.id][colorIndex] : [0, 0, 0, 0]
}

export class FourwingsHeatmapLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsHeatmapLayer'
  renderLayers() {
    const { data, maxFrame, minFrame, rows, cols, colorDomain, colorRanges } = this.props
    if (!data || !colorDomain || !colorRanges) {
      return
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
          getFillColor(cell, { minFrame, maxFrame, colorDomain, colorRanges }),
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
