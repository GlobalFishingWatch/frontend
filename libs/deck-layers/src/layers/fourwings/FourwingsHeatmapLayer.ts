import { Color, CompositeLayer, GetPickingInfoParams, LayersList, PickingInfo } from '@deck.gl/core'
import { PathLayer, SolidPolygonLayer, TextLayer } from '@deck.gl/layers'
import { GeoBoundingBox } from '@deck.gl/geo-layers'
import { PathStyleExtension } from '@deck.gl/extensions'
import { CONFIG_BY_INTERVAL, FourWingsFeature } from '@globalfishingwatch/deck-loaders'
import { COLOR_HIGHLIGHT_LINE, LayerGroup, getLayerGroupOffset } from '../../utils'
import { getInterval } from './fourwings.config'
import { aggregateCell, chooseColor, getChunk, getIntervalFrames } from './fourwings.utils'
import { FourwingsHeatmapLayerProps } from './fourwings.types'

export class FourwingsHeatmapLayer extends CompositeLayer<FourwingsHeatmapLayerProps> {
  static layerName = 'FourwingsHeatmapLayer'
  layers: LayersList = []

  getPickingInfo = ({ info }: GetPickingInfoParams): PickingInfo => {
    const { minFrame, maxFrame, availableIntervals, category, sublayers } = this.props
    if (info.object) {
      const chunk = getChunk(minFrame, maxFrame, availableIntervals)
      const interval = getInterval(minFrame, maxFrame, availableIntervals)
      const tileMinIntervalFrame = Math.ceil(
        CONFIG_BY_INTERVAL[interval].getIntervalFrame(chunk.start)
      )
      const minIntervalFrame =
        Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(minFrame)) - tileMinIntervalFrame
      const maxIntervalFrame =
        Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(maxFrame)) - tileMinIntervalFrame
      const values = aggregateCell(info.object.properties.values, {
        minIntervalFrame,
        maxIntervalFrame,
        aggregationOperation: this.props.aggregationOperation,
        startFrames: info.object.properties.startFrames,
      })
      info.object.category = category
      info.object.sublayers = sublayers
      if (values) {
        // TODO: make a decision if send the values within the sublayers or as a separate object
        info.object.values = values
      }
    }
    return info
  }

  renderLayers() {
    const {
      data,
      maxFrame,
      minFrame,
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
    const chunk = getChunk(minFrame, maxFrame, availableIntervals)
    const { minIntervalFrame, maxIntervalFrame } = getIntervalFrames(
      minFrame,
      maxFrame,
      availableIntervals
    )
    const getFillColor = (feature: FourWingsFeature, { target }: { target: Color }) => {
      target = chooseColor(feature, {
        colorDomain,
        colorRanges,
        chunk,
        aggregationOperation,
        minIntervalFrame,
        maxIntervalFrame,
        comparisonMode,
      })
      return target
    }

    this.layers = [
      new SolidPolygonLayer(
        this.props,
        this.getSubLayerProps({
          id: `fourwings-tile`,
          pickable: true,
          getPickingInfo: this.getPickingInfo,
          getFillColor,
          getPolygon: (d: FourWingsFeature) => d.geometry.coordinates[0],
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Heatmap, params),
          updateTriggers: {
            // This tells deck.gl to recalculate fillColor on changes
            getFillColor: [minFrame, maxFrame, colorDomain, colorRanges, comparisonMode],
          },
        })
      ),
    ] as LayersList

    const layerHoveredFeature: FourWingsFeature = hoveredFeatures?.find(
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
            getPath: (d: FourWingsFeature) => d.geometry.coordinates[0],
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
