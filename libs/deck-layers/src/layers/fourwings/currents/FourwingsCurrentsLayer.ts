import type { LayersList, LayerContext } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { getTimeRangeKey } from '@globalfishingwatch/deck-loaders'
import { getLayerGroupOffset } from '@globalfishingwatch/deck-layers'
import { LayerGroup } from '@globalfishingwatch/deck-layers'
import type { FourwingsHeatmapLayerProps } from '../fourwings.types'
import { getIntervalFrames } from '../heatmap/fourwings-heatmap.utils'
import CurrentsLayer from './CurrentsLayer'

type CurrentsLayerState = {
  time: number
}

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
          radiusMinPixels: 8,
          stroked: false,
          positionFormat: 'XY',
          filled: true,
          billboard: false,
          antialiasing: true,
          time: this.state.time,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.HeatmapStatic, params),
          getVelocity: (d: FourwingsFeature) => {
            return Math.floor(Math.random() * 100)
          },
          getDirection: (d: FourwingsFeature) => {
            return Math.floor(Math.random() * 361)
          },
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
