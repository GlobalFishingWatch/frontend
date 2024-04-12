import { Color, CompositeLayer, LayersList, PickingInfo } from '@deck.gl/core'
import { PathLayer, SolidPolygonLayer, TextLayer } from '@deck.gl/layers'
import { GeoBoundingBox } from '@deck.gl/geo-layers'
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
} from '../../utils'
import { EMPTY_CELL_COLOR, aggregateCell, getIntervalFrames } from './fourwings.utils'
import {
  FourwingsComparisonMode,
  FourwingsHeatmapLayerProps,
  FourwingsPickingInfo,
  FourwingsPickingObject,
} from './fourwings.types'

export class FourwingsHeatmapLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsHeatmapLayer'
  layers: LayersList = []

  getPickingInfo = ({ info }: { info: PickingInfo<FourwingsFeature> }): FourwingsPickingInfo => {
    const {
      id,
      tile,
      startTime,
      endTime,
      availableIntervals,
      category,
      sublayers,
      tilesCache,
      comparisonMode,
    } = this.props

    const { startFrame, endFrame, interval } = getIntervalFrames({
      startTime,
      endTime,
      availableIntervals,
      bufferedStart: tilesCache.bufferedStart,
    })
    const object: FourwingsPickingObject = {
      ...(info.object || ({} as FourwingsFeature)),
      layerId: this.props.id,
      id: id,
      title: id, // TODO:deck get the proper title
      tile: tile.index,
      category,
      sublayers,
      startTime,
      endTime,
      interval,
      comparisonMode,
    }
    if (info.object) {
      const timeRangeKey = getTimeRangeKey(startFrame, endFrame)
      const values =
        info.object.properties.initialValues[timeRangeKey] ||
        aggregateCell({
          cellValues: info.object.properties.values,
          startFrame,
          endFrame,
          aggregationOperation: this.props.aggregationOperation,
          cellStartOffsets: info.object.properties.startOffsets,
        })
      object.sublayers = object.sublayers.flatMap((sublayer, i) =>
        values[i] ? { ...sublayer, value: values[i] } : []
      )
      if (!object.sublayers.length) {
        return { ...info, object: undefined }
      }
    }
    return { ...info, object }
  }

  renderLayers() {
    const {
      data,
      endTime,
      startTime,
      colorDomain,
      colorRanges,
      hoveredFeatures,
      comparisonMode,
      availableIntervals,
      aggregationOperation,
      tilesCache,
      scales,
      minVisibleValue,
      maxVisibleValue,
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

    const timeRangeKey = getTimeRangeKey(startFrame, endFrame)

    const getCompareFillColor = (feature: FourwingsFeature, { target }: { target: Color }) => {
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

    const getBivariateFillColor = (feature: FourwingsFeature, { target }: { target: Color }) => {
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

    this.layers = [
      new SolidPolygonLayer(
        this.props,
        this.getSubLayerProps({
          id: `fourwings-tile`,
          pickable: true,
          getPickingInfo: this.getPickingInfo,
          getFillColor:
            comparisonMode === FourwingsComparisonMode.Compare
              ? getCompareFillColor
              : getBivariateFillColor,
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

    const layerHoveredFeature = hoveredFeatures?.find((f) => f.layerId === this.root.id)
    if (layerHoveredFeature) {
      this.layers.push(
        new PathLayer(
          this.props,
          this.getSubLayerProps({
            data: [layerHoveredFeature],
            id: `fourwings-cell-highlight`,
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
    }

    if (this.props.debug) {
      const { west, east, north, south } = this.props.tile.bbox as GeoBoundingBox
      this.layers.push(
        new PathLayer(
          this.props,
          this.getSubLayerProps({
            id: `debug-tile-boundary`,
            data: [
              {
                path: [
                  [west, north],
                  [west, south],
                  [east, south],
                  [east, north],
                  [west, north],
                ],
              },
            ],
            getPath: (d: any) => d.path,
            widthMinPixels: 1,
            getColor: [255, 0, 0, 100],
            getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
          })
        ),
        new TextLayer(
          this.props,
          this.getSubLayerProps({
            id: `debug-tile-id`,
            data: [
              {
                text: `${this.props.tile.index.z}/${this.props.tile.index.x}/${this.props.tile.index.y}`,
              },
            ],
            getText: (d: any) => d.text,
            getPosition: [west, north],
            getColor: [255, 255, 255],
            getSize: 12,
            getAngle: 0,
            getTextAnchor: 'start',
            getAlignmentBaseline: 'top',
            getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
          })
        )
      )
    }
    return this.layers
  }

  getData() {
    return this.props.data
  }
}
