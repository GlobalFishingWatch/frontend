import { CompositeLayer, Color, PickingInfo, Layer, DefaultProps, LayerProps } from '@deck.gl/core'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { Feature, GeoJsonProperties, Geometry } from 'geojson'
import {
  COLOR_HIGHLIGHT_FILL,
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  hexToDeckColor,
  LayerGroup,
  getLayerGroupOffset,
  getPickedFeatureToHighlight,
  GFWMVTLoader,
  getMVTSublayerProps,
} from '../../utils'
import { API_PATH } from './context.config'

export type ContextLayerProps = {
  id: string
  idProperty: string
  color: string
  datasetId: string
  hoveredFeatures?: PickingInfo[]
  clickedFeatures?: PickingInfo[]
}
type ContextFeature = Feature<Geometry, GeoJsonProperties>

const defaultProps: DefaultProps<ContextLayerProps> = {
  idProperty: 'gfw_id',
}

export class ContextLayer<PropsT = {}> extends CompositeLayer<
  LayerProps & TileLayerProps & ContextLayerProps & PropsT
> {
  static layerName = 'ContextLayer'
  static defaultProps = defaultProps
  layers: Layer[] = []

  getLineColor(d: ContextFeature): Color {
    const { hoveredFeatures = [], clickedFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, clickedFeatures, idProperty) ||
      getPickedFeatureToHighlight(d, hoveredFeatures, idProperty)
      ? COLOR_HIGHLIGHT_LINE
      : COLOR_TRANSPARENT
  }

  getFillColor(d: ContextFeature): Color {
    const { hoveredFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, hoveredFeatures, idProperty)
      ? COLOR_HIGHLIGHT_FILL
      : COLOR_TRANSPARENT
  }

  renderLayers() {
    const { hoveredFeatures, clickedFeatures, color } = this.props
    this.layers = [
      new TileLayer<TileLayerProps>({
        id: `${this.id}-base-layer`,
        data: `${API_PATH}/${this.props.datasetId}/context-layers/{z}/{x}/{y}`,
        loaders: [GFWMVTLoader],
        maxRequests: 100,
        debounceTime: 500,
        renderSubLayers: (props: any) => {
          const mvtSublayerProps = { ...props, ...getMVTSublayerProps(props) }
          return [
            new GeoJsonLayer(mvtSublayerProps, {
              id: `${props.id}-highlight-fills`,
              stroked: false,
              pickable: true,
              visible:
                (hoveredFeatures && hoveredFeatures?.length > 0) ||
                (clickedFeatures && clickedFeatures?.length > 0),
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsBackground, params),
              getFillColor: (d) => this.getFillColor(d),
              updateTriggers: {
                getFillColor: [clickedFeatures, hoveredFeatures],
              },
            }),
            new GeoJsonLayer(mvtSublayerProps, {
              id: `${props.id}-lines`,
              lineWidthMinPixels: 1,
              filled: false,
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
              getLineColor: hexToDeckColor(color),
            }),
            new GeoJsonLayer(mvtSublayerProps, {
              id: `${props.id}-highlight-lines`,
              lineWidthMinPixels: 1,
              filled: false,
              visible:
                (hoveredFeatures && hoveredFeatures?.length > 0) ||
                (clickedFeatures && clickedFeatures?.length > 0),
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
              getLineColor: (d) => this.getLineColor(d),
              updateTriggers: {
                getLineColor: [clickedFeatures, hoveredFeatures],
              },
            }),
          ]
        },
      }),
    ]
    return this.layers
  }
}
