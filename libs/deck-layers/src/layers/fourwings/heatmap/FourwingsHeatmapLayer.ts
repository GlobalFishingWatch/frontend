import { Color, CompositeLayer, LayersList, PickingInfo } from '@deck.gl/core'
import { PathLayer, SolidPolygonLayer } from '@deck.gl/layers'
import { PathStyleExtension } from '@deck.gl/extensions'
import { screen } from 'color-blend'
import { FourwingsFeature, getTimeRangeKey } from '@globalfishingwatch/deck-loaders'
import {
  COLOR_HIGHLIGHT_LINE,
  LayerGroup,
  getLayerGroupOffset,
  rgbaStringToComponents,
  rgbaStringToObject,
  rgbaToDeckColor,
} from '../../../utils'
import { HEATMAP_HIGH_RES_ID, HEATMAP_ID } from '../fourwings.config'
import {
  EMPTY_CELL_COLOR,
  aggregateCell,
  compareCell,
  getIntervalFrames,
} from './fourwings-heatmap.utils'
import {
  FourwingsComparisonMode,
  FourwingsHeatmapLayerProps,
  FourwingsHeatmapPickingInfo,
  FourwingsHeatmapPickingObject,
} from './fourwings-heatmap.types'

export class FourwingsHeatmapLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsHeatmapLayer'
  layers: LayersList = []

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
      title: id, // TODO:deck get the proper title
      tile: tile.index,
      category,
      subcategory,
      sublayers,
      startTime,
      endTime,
      interval,
      comparisonMode,
      visualizationMode: resolution === 'high' ? HEATMAP_HIGH_RES_ID : HEATMAP_ID,
    }
    if (info.object) {
      object.sublayers = object.sublayers?.map((sublayer, i) => ({
        ...sublayer,
        value: info.object?.properties?.aggregatedValues?.[i],
      }))
      if (
        !object.sublayers?.filter(
          ({ value }) =>
            value &&
            (!minVisibleValue || value >= minVisibleValue) &&
            (!maxVisibleValue || value <= maxVisibleValue)
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

    if (!colorDomain || !colorRanges || !compareStart || !compareEnd || !scales.length) {
      target = EMPTY_CELL_COLOR
      return target
    }

    const aggregatedCellValues = compareCell({
      cellValues: feature.properties.values,
      aggregationOperation,
    })
    feature.properties.aggregatedValues = aggregatedCellValues
    const chosenValue = aggregatedCellValues[0]

    if (scales[0]) {
      const color = scales[0](chosenValue)
      target = color ? (rgbaStringToComponents(color) as Color) : [0, 0, 0, 0]
      return target
    }
    return EMPTY_CELL_COLOR
  }

  getCompareFillColor = (feature: FourwingsFeature, { target }: { target: Color }) => {
    const {
      endTime,
      startTime,
      colorDomain,
      colorRanges,
      availableIntervals,
      aggregationOperation,
      minVisibleValue,
      maxVisibleValue,
      tilesCache,
      scales,
    } = this.props
    const { startFrame, endFrame } = getIntervalFrames({
      startTime,
      endTime,
      availableIntervals,
      bufferedStart: tilesCache.bufferedStart,
    })
    const timeRangeKey = getTimeRangeKey(startFrame, endFrame)
    if (!colorDomain || !colorRanges) {
      target = EMPTY_CELL_COLOR
      return target
    }
    const aggregatedCellValues =
      feature.properties.initialValues[timeRangeKey] ||
      aggregateCell({
        cellValues: feature.properties.values,
        startFrame,
        endFrame,
        aggregationOperation,
        cellStartOffsets: feature.properties.startOffsets,
      })
    let chosenValueIndex = 0
    let chosenValue: number | undefined
    try {
      feature.properties.aggregatedValues = aggregatedCellValues
    } catch (e: any) {
      console.warn(e.message)
    }
    aggregatedCellValues.forEach((value, index) => {
      if (value && (!chosenValue || value > chosenValue)) {
        chosenValue = value
        chosenValueIndex = index
      }
    })
    if (
      !chosenValue ||
      (minVisibleValue && chosenValue < minVisibleValue) ||
      (maxVisibleValue && chosenValue > maxVisibleValue)
    ) {
      target = EMPTY_CELL_COLOR
      return target
    }
    if (scales[chosenValueIndex]) {
      const color = scales[chosenValueIndex](chosenValue)
      target = color ? (rgbaStringToComponents(color) as Color) : EMPTY_CELL_COLOR
      return target
    }
    const colorIndex = (colorDomain as number[]).findIndex((d, i) =>
      (chosenValue as number) <= d || i === colorRanges[0].length - 1 ? i : 0
    )
    target = rgbaStringToComponents(colorRanges[chosenValueIndex][colorIndex]) as Color
    return target
  }

  getBivariateFillColor = (feature: FourwingsFeature, { target }: { target: Color }) => {
    const {
      endTime,
      startTime,
      colorDomain,
      colorRanges,
      availableIntervals,
      aggregationOperation,
      tilesCache,
      scales,
    } = this.props
    const { startFrame, endFrame } = getIntervalFrames({
      startTime,
      endTime,
      availableIntervals,
      bufferedStart: tilesCache.bufferedStart,
    })
    const timeRangeKey = getTimeRangeKey(startFrame, endFrame)

    if (!colorDomain || !colorRanges) {
      target = EMPTY_CELL_COLOR
      return target
    }
    const aggregatedCellValues =
      feature.properties.initialValues[timeRangeKey] ||
      aggregateCell({
        cellValues: feature.properties.values,
        startFrame,
        endFrame,
        aggregationOperation,
        cellStartOffsets: feature.properties.startOffsets,
      })
    feature.properties.aggregatedValues = aggregatedCellValues
    let chosenValue: number | undefined
    if (scales.length) {
      const colors = scales.map((s, i) =>
        aggregatedCellValues[i] ? s(aggregatedCellValues[i]) : undefined
      )
      const color = screen(rgbaStringToObject(colors[0]), rgbaStringToObject(colors[1]))
      target = color ? [color.r, color.g, color.b, color.a * 255] : EMPTY_CELL_COLOR
      return target
    }
    // chosenValue = getBivariateValue(aggregatedCellValues, colorDomain as number[][])
    if (!chosenValue) {
      target = EMPTY_CELL_COLOR
      return target
    }
    target = rgbaToDeckColor(colorRanges[chosenValue] as unknown as string)
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
      comparisonMode,
      tilesCache,
      minVisibleValue,
      maxVisibleValue,
    } = this.props
    if (!data || !colorDomain || !colorRanges || !tilesCache) {
      return []
    }
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