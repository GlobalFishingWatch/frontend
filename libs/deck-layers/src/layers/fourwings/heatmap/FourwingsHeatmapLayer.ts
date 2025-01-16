import type { Color, LayersList, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { PathStyleExtension } from '@deck.gl/extensions'
import { PathLayer, SolidPolygonLayer } from '@deck.gl/layers'
import { screen } from 'color-blend'

import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { getTimeRangeKey } from '@globalfishingwatch/deck-loaders'

import {
  COLOR_HIGHLIGHT_LINE,
  EMPTY_RGBA_COLOR,
  getLayerGroupOffset,
  LayerGroup,
} from '../../../utils'

import type {
  FourwingsHeatmapLayerProps,
  FourwingsHeatmapPickingInfo,
  FourwingsHeatmapPickingObject,
} from './fourwings-heatmap.types'
import { FourwingsComparisonMode } from './fourwings-heatmap.types'
import {
  aggregateCell,
  compareCell,
  EMPTY_CELL_COLOR,
  getIntervalFrames,
  getVisualizationModeByResolution,
} from './fourwings-heatmap.utils'

export class FourwingsHeatmapLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsHeatmapLayer'
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
      // zoomOffset = 0,
    } = this.props
    if (
      !colorDomain?.length ||
      !colorRanges?.length
      // TODO research if we can restore this to avoid rendering two zoom levels at the same time
      // || Math.round(this.context.viewport.zoom) + zoomOffset !== this.props.tile.index.z
    ) {
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
    let chosenValueIndex = 0
    let chosenValue: number | undefined

    feature.aggregatedValues = aggregatedCellValues
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
    if (scales[chosenValueIndex]) {
      const colorChosen = scales[chosenValueIndex](chosenValue)
      if (colorChosen) {
        target = [colorChosen.r, colorChosen.g, colorChosen.b, colorChosen.a * 255]
        return target
      }
    } else {
      const colorIndex = (colorDomain as number[]).findIndex((d, i) =>
        (chosenValue as number) <= d || i === colorRanges[0].length - 1 ? i : 0
      )
      const color = colorRanges[chosenValueIndex]?.[colorIndex]
      if (color) {
        target = [color.r, color.g, color.b, color.a * 255]
        return target
      }
    }
    target = EMPTY_CELL_COLOR
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

  renderLayers(): LayersList {
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

    const layerHighlightedFeature = highlightedFeatures?.find((f) => f.layerId === this.root.id)
    return [
      new SolidPolygonLayer(
        this.props,
        this.getSubLayerProps({
          id: `fourwings-tile`,
          pickable: true,
          material: false,
          _normalize: false,
          positionFormat: 'XY',
          getPickingInfo: this.getPickingInfo,
          getFillColor:
            comparisonMode === FourwingsComparisonMode.TimeCompare
              ? this.getTimeCompareFillColor
              : comparisonMode === FourwingsComparisonMode.Bivariate
              ? this.getBivariateFillColor
              : this.getCompareFillColor,
          getPolygon: (d: FourwingsFeature) => d.coordinates,
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
      ...([
        layerHighlightedFeature
          ? new PathLayer(
              this.props,
              this.getSubLayerProps({
                pickable: false,
                material: false,
                _normalize: false,
                positionFormat: 'XY',
                data: [layerHighlightedFeature],
                id: `fourwings-cell-highlight`,
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
          : [],
      ] as LayersList),
    ]
  }

  getData() {
    return this.props.data
  }
}
