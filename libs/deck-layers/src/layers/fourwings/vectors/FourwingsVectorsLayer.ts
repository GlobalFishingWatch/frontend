import type { LayerContext, LayersList, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { PathStyleExtension } from '@deck.gl/extensions'
import { PathLayer } from '@deck.gl/layers'
import type { Feature } from 'geojson'

import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import { getLayerGroupOffset, HEATMAP_ID, LayerGroup } from '@globalfishingwatch/deck-layers'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { getTimeRangeKey } from '@globalfishingwatch/deck-loaders'

import { hexToDeckColor } from '../../../utils'
import type { FourwingsHeatmapPickingObject, FourwingsVectorsLayerProps } from '../fourwings.types'
import { FourwingsAggregationOperation } from '../heatmap/fourwings-heatmap.types'
import {
  aggregateSublayerValues,
  getIntervalFrames,
  sliceCellValues,
} from '../heatmap/fourwings-heatmap.utils'

import type { VectorsLayerProps } from './VectorsLayer'
import VectorsLayer from './VectorsLayer'

export class FourwingsVectorsLayer extends CompositeLayer<FourwingsVectorsLayerProps> {
  static layerName = 'FourwingsVectorsLayer'
  timeRangeKey!: string
  startFrame!: number
  endFrame!: number

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
      minVisibleValue,
      maxVisibleValue,
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
      if (
        !object.sublayers?.filter(
          ({ value }) =>
            value &&
            (minVisibleValue === undefined || value >= minVisibleValue) &&
            (maxVisibleValue === undefined || value <= maxVisibleValue)
        ).length
      ) {
        return { ...info, object: undefined }
      }
    }
    return { ...info, object }
  }

  getVelocity = (feature: FourwingsFeature, { target }: { target: number }) => {
    if (!feature.aggregatedValues) {
      feature.aggregatedValues = []
    }

    const value =
      feature.properties.velocities &&
      feature.properties.velocities.length > 0 &&
      this.startFrame !== undefined &&
      this.endFrame !== undefined
        ? aggregateSublayerValues(
            sliceCellValues({
              values: feature.properties.velocities,
              startFrame: this.startFrame,
              endFrame: this.endFrame,
              startOffset: feature.properties.startOffsets[0] ?? 0,
            }),
            FourwingsAggregationOperation.Avg
          )
        : 0

    feature.aggregatedValues[0] = value

    const { minVisibleValue, maxVisibleValue } = this.props
    if (
      value &&
      ((minVisibleValue !== undefined && value < minVisibleValue) ||
        (maxVisibleValue !== undefined && value > maxVisibleValue))
    ) {
      target = 0
      return target
    }

    target = value

    return target
  }

  getDirection = (feature: FourwingsFeature, { target }: { target: number }) => {
    if (!feature.aggregatedValues) {
      feature.aggregatedValues = []
    }

    const value =
      feature.properties.directions &&
      feature.properties.directions.length > 0 &&
      this.startFrame !== undefined &&
      this.endFrame !== undefined
        ? aggregateSublayerValues(
            sliceCellValues({
              values: feature.properties.directions,
              startFrame: this.startFrame,
              endFrame: this.endFrame,
              startOffset: feature.properties.startOffsets[1] ?? 0,
            }),
            FourwingsAggregationOperation.AvgDegrees
          )
        : 0

    feature.aggregatedValues[1] = value
    target = value

    return target
  }

  renderLayers() {
    const {
      data,
      endTime,
      startTime,
      tilesCache,
      highlightedFeatures,
      availableIntervals,
      sublayers,
      minVisibleValue,
      maxVisibleValue,
    } = this.props
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

    const vectorLayerProps: VectorsLayerProps<FourwingsFeature> = {
      id: `fourwings-vectors`,
      data,
      getFillColor: color,
      getRadius: (d: FourwingsFeature) => {
        // Calculate cell size to ensure arrow covers the cell
        const cellWidth = d.coordinates[2] - d.coordinates[0]
        const cellHeight = d.coordinates[5] - d.coordinates[1]
        const latitude = (d.coordinates[1] + d.coordinates[5]) / 2
        const metersPerDegreeLon = 111000 * Math.cos((latitude * Math.PI) / 180)
        return Math.min(cellWidth * metersPerDegreeLon, cellHeight * 111000) * 1.5
      },
      radiusUnits: 'meters',
      stroked: false,
      positionFormat: 'XY',
      filled: true,
      billboard: false,
      antialiasing: true,
      getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.HeatmapStatic, params),
      getVelocity: this.getVelocity as any,
      getDirection: this.getDirection as any,
      maxVelocity: this.props.maxVelocity,
      getPosition: (d: FourwingsFeature) => {
        return [
          (d.coordinates[0] + d.coordinates[2]) / 2,
          (d.coordinates[1] + d.coordinates[5]) / 2,
        ]
      },
      updateTriggers: {
        getVelocity: [startTime, endTime, minVisibleValue, maxVisibleValue],
      },
    }

    return [
      new VectorsLayer(
        this.props,
        this.getSubLayerProps({
          ...vectorLayerProps,
          pickable: true,
        })
      ),
      ...(highlightedFeatures && highlightedFeatures?.length > 0
        ? [
            new VectorsLayer(
              this.props,
              this.getSubLayerProps({
                ...vectorLayerProps,
                pickable: false,
                id: `fourwings-vectors-highlighted`,
                data: highlightedFeatures,
                getVelocity: (d: FourwingsFeature) => d.aggregatedValues?.[0] || 0,
                getDirection: (d: FourwingsFeature) => d.aggregatedValues?.[1] || 0,
              })
            ),
          ]
        : []),
      ...(this.props.debugTiles
        ? [
            new PathLayer(
              this.props,
              this.getSubLayerProps({
                pickable: false,
                material: false,
                _normalize: false,
                positionFormat: 'XY',
                id: `fourwings-cell-borders`,
                widthUnits: 'pixels',
                widthMinPixels: 1,
                getPath: (feature: FourwingsFeature | Feature) =>
                  (feature as FourwingsFeature).coordinates
                    ? (feature as FourwingsFeature).coordinates
                    : (feature as Feature<any>).geometry.coordinates[0].flat(),
                getColor: [255, 255, 255, 50],
                getOffset: 0.5,
                getPolygonOffset: (params: any) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
                extensions: [new PathStyleExtension({ offset: true })],
              })
            ),
          ]
        : []),
    ] as LayersList
  }

  getData() {
    return this.props.data
  }
}
