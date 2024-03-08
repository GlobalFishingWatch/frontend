import { PickingInfo, Layer, DefaultProps } from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import type { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { PathStyleExtension } from '@deck.gl/extensions/typed'
import {
  hexToDeckColor,
  LayerGroup,
  getLayerGroupOffset,
  GFWContextLoader,
  getMVTSublayerProps,
} from '../../utils'
import { ContextLayer } from './ContextLayer'
import { API_PATH } from './context.config'

type ContextFeature = Feature<Geometry, GeoJsonProperties>
export type EEZLayerProps = {
  id: string
  idProperty: string
  color: string
  areasDatasetId: string
  boundariesDatasetId: string
  hoveredFeatures?: PickingInfo[]
  clickedFeatures?: PickingInfo[]
}

const defaultProps: DefaultProps<EEZLayerProps> = {
  idProperty: 'gfw_id',
}

const settledBoundaries = [
  '200 NM',
  'Treaty',
  'Median line',
  'Joint regime',
  'Connection Line',
  'Unilateral claim (undisputed)',
]

export class EEZLayer extends ContextLayer<EEZLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = defaultProps
  layers: Layer[] = []

  getDashArray(d: ContextFeature): [number, number] {
    return settledBoundaries.includes(d.properties?.LINE_TYPE) ? [0, 0] : [8, 8]
  }

  renderLayers() {
    this.layers = [
      new TileLayer<TileLayerProps>({
        id: `${this.id}-boundaries-layer`,
        data: `${API_PATH}/${this.props.boundariesDatasetId}/context-layers/{z}/{x}/{y}`,
        loaders: [GFWContextLoader],
        renderSubLayers: (props) => {
          const mvtSublayerProps = { ...props, ...getMVTSublayerProps(props) }
          return [
            new GeoJsonLayer(mvtSublayerProps, {
              id: `${props.id}-boundaries`,
              lineWidthMinPixels: 1,
              filled: false,
              getPolygonOffset: (params: { layerIndex: number }) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
              getLineColor: hexToDeckColor(this.props.color),
              lineWidthUnits: 'pixels',
              extensions: [
                ...mvtSublayerProps.extensions,
                new PathStyleExtension({ dash: true, highPrecisionDash: true }),
              ],
              getDashArray: (d: ContextFeature) => this.getDashArray(d),
            } as any),
          ]
        },
      }),
      new TileLayer<TileLayerProps>({
        id: `${this.id}-base-layer`,
        data: `${API_PATH}/${this.props.areasDatasetId}/context-layers/{z}/{x}/{y}`,
        loaders: [GFWContextLoader],
        renderSubLayers: (props) => {
          const mvtSublayerProps = { ...props, ...getMVTSublayerProps(props) }
          return [
            new GeoJsonLayer(mvtSublayerProps, {
              id: `${props.id}-highlight-fills`,
              stroked: false,
              pickable: true,
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsBackground, params),
              getFillColor: (d) => this.getFillColor(d),
              updateTriggers: {
                getFillColor: [this.props.clickedFeatures, this.props.hoveredFeatures],
              },
            }),
            new GeoJsonLayer(mvtSublayerProps, {
              id: `${props.id}-highlight-lines`,
              lineWidthMinPixels: 1,
              filled: false,
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
              getLineColor: (d) => this.getLineColor(d),
              updateTriggers: {
                getLineColor: [this.props.clickedFeatures, this.props.hoveredFeatures],
              },
            }),
          ]
        },
      }),
    ]
    return this.layers
  }
}
