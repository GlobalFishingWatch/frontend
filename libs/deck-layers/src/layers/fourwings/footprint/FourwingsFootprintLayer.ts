import type { Color, LayersList, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { PathStyleExtension } from '@deck.gl/extensions'
import { PathLayer, SolidPolygonLayer } from '@deck.gl/layers'

import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { getTimeRangeKey } from '@globalfishingwatch/deck-loaders'

import {
  COLOR_HIGHLIGHT_LINE,
  getLayerGroupOffset,
  hexToDeckColor,
  LayerGroup,
} from '../../../utils'
import { FOOTPRINT_ID } from '../fourwings.config'
import type { FourwingsHeatmapPickingInfo, FourwingsHeatmapPickingObject } from '../fourwings.types'
import { FourwingsAggregationOperation } from '../fourwings.types'
import {
  aggregateCell,
  EMPTY_CELL_COLOR,
  getIntervalFrames,
} from '../heatmap/fourwings-heatmap.utils'

import type { FourwingsFootprintLayerProps } from './fourwings-footprint.types'

export class FourwingsFootprintLayer extends CompositeLayer<FourwingsFootprintLayerProps> {
  static layerName = 'FourwingsFootprintLayer'
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
      title: (sublayers?.[0].vesselGroups as string) || id,
      tile: tile.index,
      category,
      subcategory,
      sublayers,
      startTime,
      endTime,
      visualizationMode: FOOTPRINT_ID,
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
    if (aggregatedCellValues[0] > 0) {
      target = hexToDeckColor(color!, Math.min(0.5 + aggregatedCellValues[0] * 0.01, 1))
    } else {
      target = EMPTY_CELL_COLOR
    }
    return target
  }

  renderLayers() {
    const { data, endTime, startTime, availableIntervals, tilesCache, highlightedFeatures, color } =
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

    const layers = [
      new SolidPolygonLayer(
        this.props,
        this.getSubLayerProps({
          id: `fourwings-tile`,
          pickable: true,
          material: false,
          _normalize: false,
          positionFormat: 'XY',
          getPickingInfo: this.getPickingInfo,
          getFillColor: this._getFillColor,
          getPolygon: (d: FourwingsFeature) => d.coordinates,
          getPolygonOffset: (params: any) =>
            getLayerGroupOffset(LayerGroup.HeatmapFootprint, params),
          updateTriggers: {
            getFillColor: [startTime, endTime, color],
          },
        })
      ),
    ] as LayersList

    const layerHighlightedFeatures = highlightedFeatures?.filter((f) => f.layerId === this.root.id)
    if (layerHighlightedFeatures) {
      layerHighlightedFeatures.forEach((highlightedFeature, index) => {
        layers.push(
          new PathLayer(
            this.props,
            this.getSubLayerProps({
              material: false,
              _normalize: false,
              positionFormat: 'XY',
              data: [highlightedFeature],
              id: `fourwings-cell-highlight-${index}`,
              widthUnits: 'pixels',
              widthMinPixels: 4,
              getPath: (d: FourwingsFeature) => d.coordinates,
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
    return layers
  }

  getData() {
    return this.props.data
  }
}
