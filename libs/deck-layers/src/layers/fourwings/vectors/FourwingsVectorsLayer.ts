import type { LayerContext, LayersList, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { SolidPolygonLayer } from '@deck.gl/layers'

import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import { getLayerGroupOffset, HEATMAP_ID, LayerGroup } from '@globalfishingwatch/deck-layers'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { getTimeRangeKey } from '@globalfishingwatch/deck-loaders'

import { COLOR_TRANSPARENT, hexToDeckColor } from '../../../utils'
import type { FourwingsHeatmapLayerProps, FourwingsHeatmapPickingObject } from '../fourwings.types'
import { FourwingsAggregationOperation } from '../heatmap/fourwings-heatmap.types'
import {
  aggregateSublayerValues,
  getIntervalFrames,
  sliceCellValues,
} from '../heatmap/fourwings-heatmap.utils'

import VectorsLayer from './VectorsLayer'

export class FourwingsVectorsLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsVectorsLayer'
  timeRangeKey!: string
  startFrame!: number
  endFrame!: number
  // Maximum expected velocity in m/s for normalization
  private static readonly MAX_VELOCITY = 5.0

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.startFrame = 0
    this.endFrame = 0
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
      subcategory: subcategory || DataviewType.FourwingsVector,
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
    const velocities = feature.properties.velocities
    if (
      !velocities ||
      velocities.length === 0 ||
      this.startFrame === undefined ||
      this.endFrame === undefined
    ) {
      target = 0
      return target
    }

    let aggregatedVelocity = aggregateSublayerValues(
      sliceCellValues({
        values: velocities,
        startFrame: this.startFrame,
        endFrame: this.endFrame,
        startOffset: feature.properties.startOffsets[0] ?? 0,
      }),
      FourwingsAggregationOperation.Avg
    )

    if (!Number.isFinite(aggregatedVelocity) || aggregatedVelocity < 0) {
      aggregatedVelocity = 0
    }
    const normalizedVelocity = Math.min(
      aggregatedVelocity / FourwingsVectorsLayer.MAX_VELOCITY,
      1.0
    )

    target = normalizedVelocity

    if (!feature.aggregatedValues) {
      feature.aggregatedValues = []
    }
    feature.aggregatedValues[0] = normalizedVelocity

    return target
  }

  getDirection = (feature: FourwingsFeature, { target }: { target: number }) => {
    const directions = feature.properties.directions
    if (
      !directions ||
      directions.length === 0 ||
      this.startFrame === undefined ||
      this.endFrame === undefined
    ) {
      target = 0
      return target
    }
    const slicedDirections = sliceCellValues({
      values: directions,
      startFrame: this.startFrame,
      endFrame: this.endFrame,
      startOffset: feature.properties.startOffsets[1] ?? 0,
    })
    let aggregatedDirection = aggregateSublayerValues(
      slicedDirections,
      FourwingsAggregationOperation.AvgDegrees
    )

    if (!Number.isFinite(aggregatedDirection)) {
      aggregatedDirection = 0
    }
    const normalizedDirection = ((aggregatedDirection % 360) + 360) % 360

    target = normalizedDirection

    // Store in aggregatedValues for compatibility with picking info
    if (!feature.aggregatedValues) {
      feature.aggregatedValues = []
    }
    feature.aggregatedValues[1] = normalizedDirection

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
      new VectorsLayer(
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
          id: `fourwings-vectors-interaction`,
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
