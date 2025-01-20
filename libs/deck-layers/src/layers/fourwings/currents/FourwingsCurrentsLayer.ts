import type { LayerContext, LayersList, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { PathStyleExtension } from '@deck.gl/extensions'
import { PathLayer, SolidPolygonLayer } from '@deck.gl/layers'

import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import {
  FourwingsAggregationOperation,
  getLayerGroupOffset,
  HEATMAP_ID,
  LayerGroup,
} from '@globalfishingwatch/deck-layers'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { getTimeRangeKey } from '@globalfishingwatch/deck-loaders'

import { COLOR_HIGHLIGHT_LINE, COLOR_TRANSPARENT } from '../../../utils'
import type { FourwingsHeatmapLayerProps, FourwingsHeatmapPickingObject } from '../fourwings.types'
import {
  aggregateCell,
  EMPTY_CELL_COLOR,
  getIntervalFrames,
} from '../heatmap/fourwings-heatmap.utils'

import CurrentsLayer from './CurrentsLayer'

type CurrentsLayerState = {
  time: number
}

const RAD_TO_DEG = 180 / Math.PI
function getUTime() {
  return (Date.now() % 3000) / 3000
}

export class FourwingsCurrentsLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsCurrentsLayer'
  timeRangeKey!: string
  startFrame!: number
  endFrame!: number
  state!: CurrentsLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      time: getUTime(),
    }
    setInterval(() => {
      this.setState({ time: getUTime() })
    }, 16)
  }

  getPickingInfo = ({ info }: { info: PickingInfo<FourwingsFeature> }) => {
    const { id, tile, startTime, endTime, sublayers, tilesCache, category, subcategory } =
      this.props

    const { interval } = getIntervalFrames({
      startTime,
      endTime,
      bufferedStart: tilesCache.bufferedStart,
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
      cellStartOffsets: [31],
    })
    if (force) {
      target = force
      if (!feature.aggregatedValues) {
        feature.aggregatedValues = []
      }
      feature.aggregatedValues[0] = force
      return target
    }
    return EMPTY_CELL_COLOR
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
      cellStartOffsets: [31],
    })

    if (angle) {
      target = angle
      if (!feature.aggregatedValues) {
        feature.aggregatedValues = []
      }
      feature.aggregatedValues[1] = angle
      return target
    }
    return EMPTY_CELL_COLOR
  }

  renderLayers() {
    const { data, endTime, startTime, tilesCache, zoomOffset } = this.props

    if (!data || !tilesCache) {
      return []
    }

    const { startFrame, endFrame } = getIntervalFrames({
      startTime,
      endTime,
      bufferedStart: tilesCache.bufferedStart,
    })

    this.timeRangeKey = getTimeRangeKey(startFrame, endFrame)
    this.startFrame = startFrame
    this.endFrame = endFrame

    // const layerHighlightedFeature = highlightedFeatures?.find((f) => f.layerId === this.root.id)

    return [
      new CurrentsLayer(
        this.props,
        this.getSubLayerProps({
          id: `fourwings-tile`,
          data,
          getFillColor: [255, 255, 255, 255],
          getLineColor: [0, 0, 0, 255],
          getRadius:
            160 *
            Math.pow(2, Math.abs(Math.round(this.context.viewport.zoom + (zoomOffset || 0)) - 12)),
          stroked: false,
          positionFormat: 'XY',
          filled: true,
          billboard: false,
          antialiasing: true,
          // time: this.state.time,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.HeatmapStatic, params),
          getVelocity: this.getVelocity,
          getDirection: this.getDirection,
          getPosition: (d: FourwingsFeature) => {
            return [
              (d.coordinates[0] + d.coordinates[2]) / 2,
              (d.coordinates[1] + d.coordinates[5]) / 2,
            ]
          },
          // getLineWidth: 1,
          // updateTriggers: {
          //   // This tells deck.gl to recalculate fillColor on changes
          //   getFillColor: [startTime, endTime, colorDomain, colorRanges],
          // },
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
      // ...([
      //   layerHighlightedFeature
      //     ? new PathLayer(
      //         this.props,
      //         this.getSubLayerProps({
      //           pickable: false,
      //           material: false,
      //           _normalize: false,
      //           positionFormat: 'XY',
      //           data: [layerHighlightedFeature],
      //           id: `fourwings-cell-highlight`,
      //           widthUnits: 'pixels',
      //           widthMinPixels: 1,
      //           getPath: (d: FourwingsFeature) => d.coordinates,
      //           getColor: COLOR_HIGHLIGHT_LINE,
      //           getOffset: 0.5,
      //           getPolygonOffset: (params: any) =>
      //             getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
      //           extensions: [new PathStyleExtension({ offset: true })],
      //         })
      //       )
      //     : [],
      // ] as LayersList),
    ] as LayersList
  }

  getData() {
    return this.props.data
  }
}
