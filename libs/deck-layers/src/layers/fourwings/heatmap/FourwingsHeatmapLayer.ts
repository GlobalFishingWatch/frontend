import { Color, CompositeLayer, LayersList, PickingInfo } from '@deck.gl/core'
import { PathLayer, SolidPolygonLayer } from '@deck.gl/layers'
import { PathStyleExtension } from '@deck.gl/extensions'
import { screen } from 'color-blend'
import { FourwingsFeature, getTimeRangeKey } from '@globalfishingwatch/deck-loaders'
import {
  COLOR_HIGHLIGHT_LINE,
  EMPTY_RGBA_COLOR,
  LayerGroup,
  getLayerGroupOffset,
} from '../../../utils'
import { FourwingsColorObject } from '../fourwings.types'
import {
  EMPTY_CELL_COLOR,
  aggregateCell,
  compareCell,
  getIntervalFrames,
  getVisualizationModeByResolution,
} from './fourwings-heatmap.utils'
import {
  FourwingsComparisonMode,
  FourwingsHeatmapLayerProps,
  FourwingsHeatmapPickingInfo,
  FourwingsHeatmapPickingObject,
} from './fourwings-heatmap.types'

let count = 0

export class FourwingsHeatmapLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsHeatmapLayer'
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
      resolution,
      sublayers,
      tilesCache,
      comparisonMode,
      minVisibleValue,
      maxVisibleValue,
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
      comparisonMode,
      visualizationMode: getVisualizationModeByResolution(resolution),
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

  getTimeCompareFillColor = (feature: FourwingsFeature, { target }: { target: Color }) => {
    const { compareStart, compareEnd, colorDomain, colorRanges, aggregationOperation, scales } =
      this.props

    if (
      !colorDomain?.length ||
      !colorRanges?.length ||
      !compareStart ||
      !compareEnd ||
      !scales.length
    ) {
      target = EMPTY_CELL_COLOR
      return target
    }

    const aggregatedCellValues = compareCell({
      cellValues: feature.properties.values,
      aggregationOperation,
    })
    feature.aggregatedValues = aggregatedCellValues
    const chosenValue = aggregatedCellValues[0]

    if (scales[0]) {
      const color = scales[0](chosenValue)
      if (color) {
        target = [color.r, color.g, color.b, color.a * 255]
        return target
      }
    }
    return EMPTY_CELL_COLOR
  }

  getCompareFillColor = (feature: FourwingsFeature, { target }: { target: Color }) => {
    const {
      colorDomain,
      colorRanges,
      aggregationOperation,
      minVisibleValue,
      maxVisibleValue,
      scales,
    } = this.props
    if (!colorDomain?.length || !colorRanges?.length) {
      target = EMPTY_CELL_COLOR
      return target
    }
    const a = performance.now()
    const aggregatedCellValues =
      // feature.properties.initialValues[this.timeRangeKey] ||
      aggregateCell({
        cellValues: feature.properties.values,
        startFrame: this.startFrame,
        endFrame: this.endFrame,
        aggregationOperation,
        cellStartOffsets: feature.properties.startOffsets,
      })
    let chosenValueIndex = 0
    let chosenValue: number | undefined
    feature.aggregatedValues = aggregatedCellValues
    feature.properties.initialValues[this.timeRangeKey] = aggregatedCellValues
    aggregatedCellValues.forEach((value, index) => {
      if (value && (!chosenValue || value > chosenValue)) {
        chosenValue = value
        chosenValueIndex = index
      }
    })
    if (
      !chosenValue ||
      (minVisibleValue !== undefined && chosenValue < minVisibleValue) ||
      (maxVisibleValue !== undefined && chosenValue > maxVisibleValue)
    ) {
      target = EMPTY_CELL_COLOR
      return target
    }
    let color: FourwingsColorObject | undefined
    if (scales[chosenValueIndex]) {
      const colorChosen = scales[chosenValueIndex](chosenValue)
      if (colorChosen) {
        color = colorChosen
      }
    } else {
      const colorIndex = (colorDomain as number[]).findIndex((d, i) =>
        (chosenValue as number) <= d || i === colorRanges[0].length - 1 ? i : 0
      )
      color = colorRanges[chosenValueIndex]?.[colorIndex]
    }
    if (color) {
      target = [color.r, color.g, color.b, color.a * 255]
    } else {
      target = EMPTY_CELL_COLOR
    }
    const b = performance.now()
    count += b - a
    // console.log('getCompareFillColor', count)
    return target
  }

  getBivariateFillColor = (feature: FourwingsFeature, { target }: { target: Color }) => {
    const { colorDomain, colorRanges, aggregationOperation, scales } = this.props
    if (!colorDomain || !colorRanges) {
      target = EMPTY_CELL_COLOR
      return target
    }
    const aggregatedCellValues =
      feature.properties.initialValues[this.timeRangeKey] ||
      aggregateCell({
        cellValues: feature.properties.values,
        startFrame: this.startFrame,
        endFrame: this.endFrame,
        aggregationOperation,
        cellStartOffsets: feature.properties.startOffsets,
      })
    feature.aggregatedValues = aggregatedCellValues

    if (!scales.length) {
      target = EMPTY_CELL_COLOR
      return target
    }

    const colors = scales.map((s, i) =>
      aggregatedCellValues[i] ? s(aggregatedCellValues[i]) : undefined
    )
    const color = screen(colors[0] || EMPTY_RGBA_COLOR, colors[1] || EMPTY_RGBA_COLOR)
    target = color ? [color.r, color.g, color.b, color.a * 255] : EMPTY_CELL_COLOR
    return target
  }

  renderLayers() {
    const {
      data,
      endTime,
      startTime,
      colorDomain,
      colorRanges,
      highlightedFeatures,
      availableIntervals,
      comparisonMode,
      tilesCache,
      minVisibleValue,
      maxVisibleValue,
      compareStart,
      compareEnd,
    } = this.props

    if (!data || !colorDomain || !colorRanges || !tilesCache) {
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
          getFillColor:
            comparisonMode === FourwingsComparisonMode.TimeCompare
              ? this.getTimeCompareFillColor
              : comparisonMode === FourwingsComparisonMode.Bivariate
              ? this.getBivariateFillColor
              : this.getCompareFillColor,
          getPolygon: (d: FourwingsFeature) => d.geometry.coordinates[0],
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Heatmap, params),
          updateTriggers: {
            // This tells deck.gl to recalculate fillColor on changes
            getFillColor: [
              startTime,
              endTime,
              colorDomain,
              colorRanges,
              comparisonMode,
              compareStart,
              compareEnd,
              minVisibleValue,
              maxVisibleValue,
            ],
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
