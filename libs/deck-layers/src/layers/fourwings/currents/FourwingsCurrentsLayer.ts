import type { LayerContext, LayersList, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { SolidPolygonLayer } from '@deck.gl/layers'

import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import {
  FourwingsAggregationOperation,
  getLayerGroupOffset,
  HEATMAP_ID,
  LayerGroup,
} from '@globalfishingwatch/deck-layers'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { getTimeRangeKey } from '@globalfishingwatch/deck-loaders'

import { COLOR_TRANSPARENT, hexToDeckColor } from '../../../utils'
import type { FourwingsHeatmapLayerProps, FourwingsHeatmapPickingObject } from '../fourwings.types'
import { aggregateCell, getIntervalFrames } from '../heatmap/fourwings-heatmap.utils'

import CurrentsLayer from './CurrentsLayer'

const RAD_TO_DEG = 180 / Math.PI

export class FourwingsCurrentsLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsCurrentsLayer'
  timeRangeKey!: string
  startFrame!: number
  endFrame!: number

  initializeState(context: LayerContext) {
    super.initializeState(context)
  }

  getPickingInfo = ({ info }: { info: PickingInfo<FourwingsFeature> }) => {
    const {
      id,
      tile,
      startTime,
      endTime,
      sublayers,
      tilesCache,
      category,
      subcategory,
      availableIntervals,
    } = this.props

    const { interval } = getIntervalFrames({
      startTime,
      endTime,
      bufferedStart: tilesCache.bufferedStart,
      availableIntervals,
    })
    const object: FourwingsHeatmapPickingObject = {
      ...(info.object || ({} as FourwingsFeature)),
      layerId: this.root.id,
      category: category || DataviewCategory.Environment,
      subcategory: subcategory || DataviewType.Currents,
      id: id,
      title: id,
      tile: tile.index,
      sublayers,
      startTime,
      endTime,
      interval,
      visualizationMode: HEATMAP_ID,
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

  getVelocity = (feature: FourwingsFeature, { target }: { target: number }) => {
    const forces = feature.properties.values[0].map((value, i) => {
      const u = value
      const v = feature.properties.values[1][i]
      return Math.sqrt(u * u + v * v)
    })
    const [force] = aggregateCell({
      // TODO:currents get U instead of by index
      cellValues: [forces],
      aggregationOperation: FourwingsAggregationOperation.Avg,
      startFrame: this.startFrame,
      endFrame: this.endFrame,
      cellStartOffsets: feature.properties.startOffsets,
    })
    if (force) {
      target = force
      if (!feature.aggregatedValues) {
        feature.aggregatedValues = []
      }
      feature.aggregatedValues[0] = force
      return target
    }
    target = 0
    return target
  }

  getDirection = (feature: FourwingsFeature, { target }: { target: number }) => {
    const angles = feature.properties.values[1].map((value, i) =>
      Math.round((90 - RAD_TO_DEG * Math.atan2(value, feature.properties.values[0][i])) % 360)
    )

    const [angle] = aggregateCell({
      // TODO:currents get U instead of by index
      cellValues: [angles],
      aggregationOperation: FourwingsAggregationOperation.AvgDegrees,
      startFrame: this.startFrame,
      endFrame: this.endFrame,
      cellStartOffsets: feature.properties.startOffsets,
    })

    if (angle) {
      target = angle
      if (!feature.aggregatedValues) {
        feature.aggregatedValues = []
      }
      feature.aggregatedValues[1] = angle
      return target
    }
    target = 0
    return target
  }

  renderLayers() {
    const { data, endTime, startTime, tilesCache, zoomOffset, availableIntervals, sublayers } =
      this.props
    const color = hexToDeckColor(sublayers?.[0]?.color || '#ffffff')

    if (!data || !tilesCache) {
      return []
    }

    const { startFrame, endFrame } = getIntervalFrames({
      startTime,
      endTime,
      bufferedStart: tilesCache.bufferedStart,
      availableIntervals,
    })

    this.timeRangeKey = getTimeRangeKey(startFrame, endFrame)
    this.startFrame = startFrame
    this.endFrame = endFrame

    return [
      new CurrentsLayer(
        this.props,
        this.getSubLayerProps({
          id: `fourwings-tile`,
          data,
          getFillColor: color,
          getRadius: (d: FourwingsFeature) => {
            return (
              160 *
              ((90 - Math.abs(d.coordinates[1]) / 1.03) / 90) *
              Math.pow(2, Math.abs(Math.round(this.context.viewport.zoom + (zoomOffset || 0)) - 12))
            )
          },
          stroked: false,
          positionFormat: 'XY',
          filled: true,
          billboard: false,
          antialiasing: true,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.HeatmapStatic, params),
          getVelocity: this.getVelocity,
          getDirection: this.getDirection,
          getPosition: (d: FourwingsFeature) => {
            return [
              (d.coordinates[0] + d.coordinates[2]) / 2,
              (d.coordinates[1] + d.coordinates[5]) / 2,
            ]
          },
        })
      ),
      new SolidPolygonLayer(
        this.props,
        this.getSubLayerProps({
          id: `fourwings-currents-interaction`,
          pickable: true,
          material: false,
          _normalize: false,
          stroked: false,
          positionFormat: 'XY',
          getPickingInfo: this.getPickingInfo,
          getFillColor: COLOR_TRANSPARENT,
          getPolygon: (d: FourwingsFeature) => d.coordinates,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Background, params),
        })
      ),
    ] as LayersList
  }

  getData() {
    return this.props.data
  }
}
