import { Color, CompositeLayer, LayersList, PickingInfo } from '@deck.gl/core'
import { PathLayer, SolidPolygonLayer } from '@deck.gl/layers'
import { PathStyleExtension } from '@deck.gl/extensions'
import { FourwingsFeature, getTimeRangeKey } from '@globalfishingwatch/deck-loaders'
import { FourwingsAggregationOperation } from '../fourwings.types'
import {
  COLOR_HIGHLIGHT_LINE,
  LayerGroup,
  getLayerGroupOffset,
  hexToDeckColor,
} from '../../../utils'
import {
  aggregateCell,
  EMPTY_CELL_COLOR,
  getIntervalFrames,
} from '../heatmap/fourwings-heatmap.utils'
import {
  FourwingsFootprintLayerProps,
  FourwingsHeatmapPickingInfo,
  FourwingsHeatmapPickingObject,
} from './fourwings-footprint.types'

export class FourwingsFootprintLayer extends CompositeLayer<FourwingsFootprintLayerProps> {
  static layerName = 'FourwingsFootprintLayer'
  layers: LayersList = []
  timeRangeKey!: string
  startFrame!: number
  endFrame!: number

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<FourwingsFeature>
  }): FourwingsHeatmapPickingInfo => {
    const {
      id,
      tile,
      startTime,
      endTime,
      availableIntervals,
      category,
      subcategory,
      sublayers,
      tilesCache,
    } = this.props

    const { interval } = getIntervalFrames({
      startTime,
      endTime,
      availableIntervals,
      bufferedStart: tilesCache.bufferedStart,
    })
    const object: FourwingsHeatmapPickingObject = {
      ...(info.object || ({} as FourwingsFeature)),
      layerId: this.root.id,
      id: id,
      title: id,
      tile: tile.index,
      category,
      subcategory,
      sublayers,
      startTime,
      endTime,
      interval,
    }
    if (info.object) {
      object.sublayers = object.sublayers?.map((sublayer, i) => ({
        ...sublayer,
        value: info.object?.aggregatedValues?.[i],
      }))
      if (!object.sublayers?.filter(({ value }) => value).length) {
        return { ...info, object: undefined }
      }
    }
    return { ...info, object }
  }

  _getFillColor = (feature: FourwingsFeature, { target }: { target: Color }) => {
    const { color } = this.props
    const aggregatedCellValues =
      feature.properties.initialValues[this.timeRangeKey] ||
      aggregateCell({
        cellValues: feature.properties.values,
        startFrame: this.startFrame,
        endFrame: this.endFrame,
        aggregationOperation: FourwingsAggregationOperation.Sum,
        cellStartOffsets: feature.properties.startOffsets,
      })
    feature.aggregatedValues = aggregatedCellValues
    if (aggregatedCellValues[0] > 0 && color) {
      target = hexToDeckColor(color)
    } else {
      target = EMPTY_CELL_COLOR
    }
    return target
  }

  renderLayers() {
    const { data, endTime, startTime, availableIntervals, tilesCache, highlightedFeatures } =
      this.props

    if (!data || !tilesCache) {
      return []
    }

    const { startFrame, endFrame } = getIntervalFrames({
      startTime,
      endTime,
      availableIntervals,
      bufferedStart: tilesCache.bufferedStart,
    })

    this.timeRangeKey = getTimeRangeKey(startFrame, endFrame)
    this.startFrame = startFrame
    this.endFrame = endFrame

    this.layers = [
      new SolidPolygonLayer(
        this.props,
        this.getSubLayerProps({
          id: `fourwings-tile`,
          pickable: true,
          getPickingInfo: this.getPickingInfo,
          getFillColor: this._getFillColor,
          getPolygon: (d: FourwingsFeature) => d.geometry.coordinates[0],
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Heatmap, params),
          updateTriggers: {
            getFillColor: [startTime, endTime],
          },
        })
      ),
    ] as LayersList

    const layerHighlightedFeatures = highlightedFeatures?.filter((f) => f.layerId === this.root.id)
    if (layerHighlightedFeatures) {
      layerHighlightedFeatures.forEach((highlightedFeature, index) => {
        this.layers.push(
          new PathLayer(
            this.props,
            this.getSubLayerProps({
              data: [highlightedFeature],
              id: `fourwings-cell-highlight-${index}`,
              widthUnits: 'pixels',
              widthMinPixels: 4,
              getPath: (d: FourwingsFeature) => d.geometry.coordinates[0],
              getColor: COLOR_HIGHLIGHT_LINE,
              getOffset: 0.5,
              getPolygonOffset: (params: any) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
              extensions: [new PathStyleExtension({ offset: true })],
            })
          )
        )
      })
    }
    return this.layers
  }

  getData() {
    return this.props.data
  }
}
