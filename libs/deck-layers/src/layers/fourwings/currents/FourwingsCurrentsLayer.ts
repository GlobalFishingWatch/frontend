import type { LayerContext, LayersList } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'

import {
  FourwingsAggregationOperation,
  getLayerGroupOffset,
  LayerGroup,
} from '@globalfishingwatch/deck-layers'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { getTimeRangeKey } from '@globalfishingwatch/deck-loaders'

import type { FourwingsHeatmapLayerProps } from '../fourwings.types'
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

  // getPickingInfo = ({ info }: { info: PickingInfo<FourwingsFeature> }) => {
  //   const { id, tile, startTime, endTime, sublayers, tilesCache } = this.props

  //   const { interval } = getIntervalFrames({
  //     startTime,
  //     endTime,
  //     bufferedStart: tilesCache.bufferedStart,
  //   })
  //   const object = {
  //     ...(info.object || ({} as FourwingsFeature)),
  //     layerId: this.root.id,
  //     id: id,
  //     title: id,
  //     tile: tile.index,
  //     sublayers,
  //     startTime,
  //     endTime,
  //     interval,
  //     visualizationMode: HEATMAP_ID,
  //   }
  //   if (info.object) {
  //     object.sublayers = object.sublayers?.map((sublayer, i) => ({
  //       ...sublayer,
  //       value: info.object?.aggregatedValues?.[i],
  //     }))
  //     if (!object.sublayers?.filter(({ value }) => value).length) {
  //       return { ...info, object: undefined }
  //     }
  //   }
  //   return { ...info, object }
  // }

  // getCompareFillColor = (feature: FourwingsFeature, { target }: { target: Color }) => {
  //   const { colorDomain, colorRanges, aggregationOperation, scales } = this.props
  //   if (!colorDomain?.length || !colorRanges?.length) {
  //     target = EMPTY_CELL_COLOR
  //     return target
  //   }
  //   const aggregatedCellValues =
  //     feature.properties.initialValues[this.timeRangeKey] ||
  //     aggregateCell({
  //       cellValues: feature.properties.values,
  //       startFrame: this.startFrame,
  //       endFrame: this.endFrame,
  //       aggregationOperation,
  //       cellStartOffsets: feature.properties.startOffsets,
  //     })
  //   let chosenValueIndex = 0
  //   let chosenValue: number | undefined
  //   feature.aggregatedValues = aggregatedCellValues
  //   aggregatedCellValues.forEach((value, index) => {
  //     if (value && (!chosenValue || value > chosenValue)) {
  //       chosenValue = value
  //       chosenValueIndex = index
  //     }
  //   })
  //   if (!chosenValue) {
  //     target = EMPTY_CELL_COLOR
  //     return target
  //   }
  //   let color: FourwingsColorObject | undefined
  //   if (scales[chosenValueIndex]) {
  //     const colorChosen = scales[chosenValueIndex](chosenValue)
  //     if (colorChosen) {
  //       color = colorChosen
  //     }
  //   } else {
  //     const colorIndex = (colorDomain as number[]).findIndex((d, i) =>
  //       (chosenValue as number) <= d || i === colorRanges[0].length - 1 ? i : 0
  //     )
  //     color = colorRanges[chosenValueIndex]?.[colorIndex]
  //   }
  //   if (color) {
  //     target = [color.r, color.g, color.b, color.a * 255]
  //   } else {
  //     target = EMPTY_CELL_COLOR
  //   }
  //   return target
  // }

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
      return target
    }
    return EMPTY_CELL_COLOR
  }
  getDirection = (feature: FourwingsFeature, { target }: { target: number }) => {
    const angles = feature.properties.values[1].map((value, i) => {
      const v = value
      const u = feature.properties.values[0][i]
      return Math.round(180 + ((RAD_TO_DEG * Math.atan2(v, u)) % 360))
    })
    const [angle] = aggregateCell({
      // TODO:currents get U instead of by index
      cellValues: [angles],
      aggregationOperation: FourwingsAggregationOperation.Avg,
      startFrame: this.startFrame,
      endFrame: this.endFrame,
      cellStartOffsets: [31],
    })

    if (angle) {
      target = angle
      return target
    }
    return EMPTY_CELL_COLOR
  }

  renderLayers() {
    const { data, endTime, startTime, tilesCache } = this.props

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

    return [
      new CurrentsLayer(
        this.props,
        this.getSubLayerProps({
          id: `fourwings-tile`,
          data,
          getFillColor: [255, 255, 255, 255],
          getLineColor: [0, 0, 0, 255],
          getRadius: 1,
          radiusMinPixels: 12,
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
            return [d.coordinates[0], d.coordinates[1]]
          },
          // getLineWidth: 1,
          // updateTriggers: {
          //   // This tells deck.gl to recalculate fillColor on changes
          //   getFillColor: [startTime, endTime, colorDomain, colorRanges],
          // },
        })
      ),
    ] as LayersList
  }

  getData() {
    return this.props.data
  }
}
