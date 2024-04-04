import { Color, CompositeLayer, LayersList, PickingInfo } from '@deck.gl/core'
import { PathLayer, SolidPolygonLayer, TextLayer } from '@deck.gl/layers'
import { GeoBoundingBox } from '@deck.gl/geo-layers'
import { PathStyleExtension } from '@deck.gl/extensions'
import {
  CONFIG_BY_INTERVAL,
  FourwingsFeature,
  getTimeRangeKey,
} from '@globalfishingwatch/deck-loaders'
import { COLOR_HIGHLIGHT_LINE, LayerGroup, getLayerGroupOffset, rgbaToDeckColor } from '../../utils'
import { getInterval } from './fourwings.config'
import {
  EMPTY_CELL_COLOR,
  aggregateCell,
  getBivariateValue,
  getFourwingsChunk,
  getIntervalFrames,
} from './fourwings.utils'
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
    const { id, startTime, endTime, availableIntervals, category, sublayers } = this.props
    const object: FourwingsPickingObject = {
      ...(info.object || ({} as FourwingsFeature)),
      title: id,
      category,
      sublayers,
    }
    if (info.object) {
      const chunk = getFourwingsChunk(startTime, endTime, availableIntervals)
      const interval = getInterval(startTime, endTime, availableIntervals)
      const tileMinIntervalFrame = CONFIG_BY_INTERVAL[interval].getIntervalFrame(
        chunk.bufferedStart
      )
      const startFrame =
        CONFIG_BY_INTERVAL[interval].getIntervalFrame(startTime) - tileMinIntervalFrame
      const endFrame = CONFIG_BY_INTERVAL[interval].getIntervalFrame(endTime) - tileMinIntervalFrame
      const values = aggregateCell(info.object.properties.values, {
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
    } = this.props
    if (!data || !colorDomain || !colorRanges) {
      return []
    }
    const { startFrame, endFrame } = getIntervalFrames(startTime, endTime, availableIntervals)
    const timeRangeKey = getTimeRangeKey(startFrame, endFrame)

    const getFillColor = (feature: FourwingsFeature, { target }: { target: Color }) => {
      if (!colorDomain || !colorRanges) {
        target = EMPTY_CELL_COLOR
        return target
      }
      const aggregatedCellValues =
        feature.properties.initialValues[timeRangeKey] ||
        aggregateCell(feature.properties.values, {
          startFrame,
          endFrame,
          aggregationOperation,
          cellStartOffsets: feature.properties.startOffsets,
        })
      let chosenValueIndex = 0
      let chosenValue: number | undefined
      if (comparisonMode === FourwingsComparisonMode.Compare) {
        aggregatedCellValues.forEach((value, index) => {
          // TODO add more comparison modes (bivariate)
          if (value && (!chosenValue || value > chosenValue)) {
            chosenValue = value
            chosenValueIndex = index
          }
        })
        // if (scale) {
        //   return rgbaStringToComponents(scale(chosenValue)) as Color
        // }
        const colorIndex = (colorDomain as number[]).findIndex((d, i) =>
          (chosenValue as number) <= d || i === colorRanges[0].length - 1 ? i : 0
        )
        if (!chosenValue) {
          target = EMPTY_CELL_COLOR
          return target
        }
        return colorRanges[chosenValueIndex][colorIndex] as Color
      } else if (comparisonMode === FourwingsComparisonMode.Bivariate) {
        chosenValue = getBivariateValue(aggregatedCellValues, colorDomain as number[][])
        if (!chosenValue) {
          target = EMPTY_CELL_COLOR
          return target
        }
        return rgbaToDeckColor(colorRanges[chosenValue] as unknown as string)
      } else {
        target = EMPTY_CELL_COLOR
        return target
      }
    }

    this.layers = [
      new SolidPolygonLayer(
        this.props,
        this.getSubLayerProps({
          id: `fourwings-tile`,
          pickable: true,
          getPickingInfo: this.getPickingInfo,
          getFillColor,
          getPolygon: (d: FourwingsFeature) => d.geometry.coordinates[0],
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Heatmap, params),
          updateTriggers: {
            // This tells deck.gl to recalculate fillColor on changes
            getFillColor: [startTime, endTime, colorDomain, colorRanges, comparisonMode],
          },
        })
      ),
    ] as LayersList

    const layerHoveredFeature: FourwingsFeature = hoveredFeatures?.find(
      (f) => f.layer?.id === this.root.id
    )?.object
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
