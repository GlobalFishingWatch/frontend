import { Color, CompositeLayer } from '@deck.gl/core/typed'
// import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import { Tile2DHeader } from '@deck.gl/geo-layers/typed/tileset-2d'
import { max } from 'lodash'
import { PathLayer, TextLayer } from '@deck.gl/layers/typed'
import { GeoBoundingBox } from '@deck.gl/geo-layers/typed'
import { CONFIG_BY_INTERVAL } from '../../utils/time'
import { Cell } from '../../loaders/fourwings/fourwingsLayerLoader'
import FourwingsTileCellLayer from './FourwingsHeatmapCellLayer'
import {
  ColorDomain,
  FourwingsHeatmapTileLayerProps,
  SublayerColorRanges,
} from './FourwingsHeatmapTileLayer'
import { Chunk, getChunks, getDatesInIntervalResolution } from './fourwings.config'
import { aggregateCell } from './fourwings.utils'

export type FourwingsHeatmapLayerProps = FourwingsHeatmapTileLayerProps & {
  id: string
  tile: Tile2DHeader
  data: any
  cols: number
  rows: number
  indexes: number[]
  colorDomain?: ColorDomain
  colorRanges?: SublayerColorRanges
}

export type AggregateCellParams = {
  minIntervalFrame: number
  maxIntervalFrame: number
}

export type GetFillColorParams = {
  colorDomain: number[]
  colorRanges: FourwingsHeatmapLayerProps['colorRanges']
  chunks: Chunk[]
  minIntervalFrame: number
  maxIntervalFrame: number
}

const EMPTY_CELL_COLOR = [0, 0, 0, 0] as Color

// let fillColorTime = 0
// let fillColorCount = 0

export const chooseColor = (
  cell: Cell,
  { colorDomain, colorRanges, chunks, minIntervalFrame, maxIntervalFrame }: GetFillColorParams
): Color => {
  // const a = performance.now()
  // fillColorCount++
  if (!colorDomain || !colorRanges || !chunks) {
    return EMPTY_CELL_COLOR
  }
  const aggregatedCellValues = aggregateCell(cell, {
    minIntervalFrame,
    maxIntervalFrame,
  })
  let chosenValueIndex = 0
  let chosenValue: number | undefined
  aggregatedCellValues.forEach((value, index) => {
    // TODO add more comparison modes (bivariate)
    if (value && (!chosenValue || value > chosenValue)) {
      chosenValue = value
      chosenValueIndex = index
    }
  })
  if (!chosenValue) {
    // const b = performance.now()
    // fillColorTime += b - a
    return [255, 0, 0, 100]
    // return EMPTY_CELL_COLOR
  }
  const colorIndex = colorDomain.findIndex((d, i) =>
    (chosenValue as number) <= d || i === colorRanges[0].length - 1 ? i : 0
  )
  // const b = performance.now()
  // fillColorTime += b - a

  // if (fillColorCount === 125385) {
  //   // console.log('time to get fill color for 10000:', fillColorTime, fillColorCount)
  //   // fillColorCount = 0
  //   // fillColorTime = 0
  // }
  return colorRanges[chosenValueIndex][colorIndex]
}

export class FourwingsHeatmapLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsHeatmapLayer'
  renderLayers() {
    const { data, indexes, maxFrame, minFrame, rows, cols, colorDomain, colorRanges } = this.props
    if (!data || !colorDomain || !colorRanges) {
      return []
    }
    const FourwingsTileCellLayerClass = this.getSubLayerClass('cell', FourwingsTileCellLayer)
    const { west, east, north, south } = this.props.tile.bbox as GeoBoundingBox
    const { start, end } = getDatesInIntervalResolution(minFrame, maxFrame)
    const chunks = getChunks(minFrame, maxFrame)
    const tileMinIntervalFrame = Math.ceil(
      CONFIG_BY_INTERVAL['DAY'].getIntervalFrame(chunks?.[0].start)
    )
    const minIntervalFrame =
      Math.ceil(CONFIG_BY_INTERVAL['DAY'].getIntervalFrame(minFrame)) - tileMinIntervalFrame
    const maxIntervalFrame =
      Math.ceil(CONFIG_BY_INTERVAL['DAY'].getIntervalFrame(maxFrame)) - tileMinIntervalFrame

    const getFillColor = (cell: Cell, { target }: { target: Color }): Color => {
      target = chooseColor(cell, {
        colorDomain,
        colorRanges,
        chunks,
        minIntervalFrame,
        maxIntervalFrame,
      })
      return target
    }

    const fourwingsLayer = new FourwingsTileCellLayerClass(
      this.props,
      this.getSubLayerProps({
        id: `fourwings-tile-${this.props.tile.id}`,
        data,
        indexes,
        cols,
        rows,
        pickable: true,
        stroked: false,
        getFillColor,
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
