import type { Color, DefaultProps, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

import type { PolygonsLayerProps } from '@globalfishingwatch/deck-layers'

import {
  COLOR_HIGHLIGHT_FILL,
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  DEFAULT_BACKGROUND_COLOR,
  getLayerGroupOffset,
  getPickedFeatureToHighlight,
  hexToDeckColor,
  LayerGroup,
} from '../../utils'
import { PREVIEW_BUFFER_GENERATOR_ID } from '../layers.config'

import type { PolygonFeature, PolygonPickingInfo, PolygonPickingObject } from './polygons.types'

const defaultProps: DefaultProps<PolygonsLayerProps> = {
  pickable: true,
}

export class PolygonsLayer<PropsT = Record<string, unknown>> extends CompositeLayer<
  PolygonsLayerProps & PropsT
> {
  static layerName = 'PolygonsLayer'
  static defaultProps = defaultProps

  getPickingInfo = ({ info }: { info: PickingInfo<PolygonFeature> }): PolygonPickingInfo => {
    if (!info.object) return { ...info, object: undefined }

    const object = {
      ...info.object,
      color: this.props.color,
      layerId: this.props.id,
      category: this.props.category,
      title: info.object?.properties?.label || info.object?.properties?.title || this.props.id,
    } as PolygonPickingObject

    return { ...info, object }
  }

  getFillColor(d: PolygonFeature): Color {
    return d.properties?.highlighted ||
      getPickedFeatureToHighlight(d, this.props.highlightedFeatures)
      ? COLOR_HIGHLIGHT_FILL
      : COLOR_TRANSPARENT
  }

  getHighlightLineWidth(d: PolygonFeature, lineWidth = 2): number {
    return d.properties?.highlighted ||
      getPickedFeatureToHighlight(d, this.props.highlightedFeatures)
      ? lineWidth
      : 0
  }

  renderLayers() {
    const {
      id,
      color,
      data,
      group = LayerGroup.OutlinePolygonsBackground,
      highlightedFeatures = [],
    } = this.props

    const showHighlight =
      (data as FeatureCollection<Geometry, GeoJsonProperties>).features?.some(
        (d) => d.properties?.highlighted
      ) ||
      (highlightedFeatures && highlightedFeatures?.length > 0)

    return [
      new GeoJsonLayer<GeoJsonProperties, { data: any }>({
        id: `${id}-highlight-fills`,
        stroked: false,
        data,
        pickable: this.props.pickable,
        getPolygonOffset: (params) => getLayerGroupOffset(group, params),
        getFillColor: (d) => this.getFillColor(d as PolygonFeature),
        updateTriggers: {
          getFillColor: [highlightedFeatures],
        },
      }),
      new GeoJsonLayer<GeoJsonProperties, { data: any }>({
        id: `${id}-lines`,
        data,
        lineWidthUnits: 'pixels',
        lineWidthMinPixels: 0,
        lineWidthMaxPixels: 2,
        filled: false,
        getPolygonOffset: (params) =>
          getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
        getLineWidth: id === PREVIEW_BUFFER_GENERATOR_ID ? 2 : 1,
        getLineColor: hexToDeckColor(color),
      }),
      new GeoJsonLayer<GeoJsonProperties, { data: any }>({
        id: `${id}-highlight-lines-bg`,
        data,
        lineWidthMinPixels: 0,
        lineWidthUnits: 'pixels',
        filled: false,
        lineJointRounded: true,
        lineCapRounded: true,
        visible: showHighlight,
        getPolygonOffset: (params) =>
          getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
        getLineWidth: (d) => this.getHighlightLineWidth(d as PolygonFeature, 4),
        getLineColor: DEFAULT_BACKGROUND_COLOR,
        updateTriggers: {
          getLineWidth: [highlightedFeatures],
        },
      }),
      new GeoJsonLayer<GeoJsonProperties, { data: any }>({
        id: `${id}-highlight-lines-fg`,
        data,
        lineWidthMinPixels: 0,
        lineWidthUnits: 'pixels',
        filled: false,
        lineJointRounded: true,
        lineCapRounded: true,
        visible: showHighlight,
        getPolygonOffset: (params) =>
          getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
        getLineWidth: (d) => this.getHighlightLineWidth(d as PolygonFeature, 2),
        getLineColor: COLOR_HIGHLIGHT_LINE,
        updateTriggers: {
          getLineWidth: [highlightedFeatures],
        },
      }),
    ]
  }
}
