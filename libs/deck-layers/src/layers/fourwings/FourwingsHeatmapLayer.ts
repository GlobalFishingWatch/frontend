import { Color, CompositeLayer, LayersList } from '@deck.gl/core/typed'
import { Tile2DHeader } from '@deck.gl/geo-layers/typed/tileset-2d'
import { PathLayer, TextLayer } from '@deck.gl/layers/typed'
import { GeoBoundingBox } from '@deck.gl/geo-layers/typed'
import { Cell, getTimeRangeKey } from '@globalfishingwatch/deck-loaders'
import { CONFIG_BY_INTERVAL } from '../../utils/time'
import FourwingsTileCellLayer from './FourwingsHeatmapCellLayer'
import {
  ColorDomain,
  FourwingsHeatmapTileLayerProps,
  SublayerColorRanges,
} from './FourwingsHeatmapTileLayer'
import { Chunk, getChunks, getInterval } from './fourwings.config'
import { aggregateCell } from './fourwings.utils'

export type FourwingsHeatmapLayerProps = FourwingsHeatmapTileLayerProps & {
  id: string
  tile: Tile2DHeader
  data: any
  cols: number
  rows: number
  indexes: number[]
  startFrames: number[][]
  initialValues: Record<string, number[][]>
  colorDomain?: ColorDomain
  colorRanges?: SublayerColorRanges
}

export type AggregateCellParams = {
  minIntervalFrame: number
  maxIntervalFrame?: number
  startFrames: number[]
}

export type GetFillColorParams = {
  colorDomain: number[]
  colorRanges: FourwingsHeatmapLayerProps['colorRanges']
  chunks: Chunk[]
  minIntervalFrame: number
  maxIntervalFrame: number
  initialValues: number[]
  startFrames: number[]
}

const EMPTY_CELL_COLOR: Color = [0, 0, 0, 0]

// let fillColorTime = 0
// let fillColorCount = 0

export const chooseColor = (
  cell: Cell,
  {
    colorDomain,
    colorRanges,
    chunks,
    minIntervalFrame,
    maxIntervalFrame,
    initialValues,
    startFrames,
  }: GetFillColorParams
): Color => {
  // const a = performance.now()
  // fillColorCount++
  if (!colorDomain || !colorRanges || !chunks) {
    return EMPTY_CELL_COLOR
  }

  const aggregatedCellValues =
    initialValues ||
    aggregateCell(cell, {
      minIntervalFrame,
      maxIntervalFrame: maxIntervalFrame > 0 ? maxIntervalFrame : undefined,
      startFrames,
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
    return EMPTY_CELL_COLOR
  }
  const colorIndex = colorDomain.findIndex((d, i) =>
    (chosenValue as number) <= d || i === colorRanges[0].length - 1 ? i : 0
  )
  // const b = performance.now()
  // fillColorTime += b - a

  // if (fillColorCount === 460816) {
  //   console.log('cells: ', fillColorCount, ', time to get fill color:', fillColorTime)
  // }
  return colorRanges[chosenValueIndex][colorIndex]
}

export class FourwingsHeatmapLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsHeatmapLayer'

  renderLayers() {
    const { data, maxFrame, minFrame, startFrames, initialValues, colorDomain, colorRanges } =
      this.props
    if (!data || !colorDomain || !colorRanges) {
      return []
    }
    const interval = getInterval(minFrame, maxFrame)
    const chunks = getChunks(minFrame, maxFrame)
    const tileMinIntervalFrame = Math.ceil(
      CONFIG_BY_INTERVAL[interval].getIntervalFrame(chunks?.[0].start)
    )
    const minIntervalFrame = Math.ceil(
      CONFIG_BY_INTERVAL[interval].getIntervalFrame(minFrame) - tileMinIntervalFrame
    )
    const maxIntervalFrame = Math.ceil(
      CONFIG_BY_INTERVAL[interval].getIntervalFrame(maxFrame) - tileMinIntervalFrame
    )

    const getFillColor = (cell: Cell, { index, target }: { index: number; target: Color }) => {
      target = chooseColor(cell, {
        colorDomain,
        colorRanges,
        chunks,
        minIntervalFrame: minIntervalFrame,
        maxIntervalFrame: maxIntervalFrame,
        startFrames: startFrames[index],
        initialValues: initialValues[getTimeRangeKey(minIntervalFrame, maxIntervalFrame)]?.[index],
      })
      return target
    }

    const fourwingsLayer = new FourwingsTileCellLayer(
      this.props,
      this.getSubLayerProps({
        id: `${this.id}-fourwings-tile-${this.props.tile.id}`,
        pickable: true,
        stroked: false,
        getFillColor,
        updateTriggers: {
          // This tells deck.gl to recalculate fillColor on changes
          getFillColor: [minFrame, maxFrame, colorDomain, colorRanges],
        },
      })
    )

    if (!this.props.debug) return fourwingsLayer as FourwingsTileCellLayer

    const { west, east, north, south } = this.props.tile.bbox as GeoBoundingBox
    const debugLayers = [
      new PathLayer({
        id: `${this.id}-tile-boundary-${this.props.tile.id}`,
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
        id: `${this.id}-tile-id-${this.props.tile.id}`,
        data: [
          {
            text: `${this.props.tile.index.z}/${this.props.tile.index.x}/${this.props.tile.index.y}`,
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

    return [fourwingsLayer, ...debugLayers] as LayersList
  }

  getData() {
    return this.props.data
  }
}
