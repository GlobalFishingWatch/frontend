import {
  CompositeLayer,
  Color,
  DefaultProps,
  Accessor,
  LayerContext,
  UpdateParameters,
} from '@deck.gl/core'
import { PathLayer } from '@deck.gl/layers'
import { Feature, GeoJsonProperties, LineString } from 'geojson'
import { PathGeometry } from '@deck.gl/layers/dist/path-layer/path'
import { hexToDeckColor, LayerGroup, getLayerGroupOffset } from '../../utils'
import { GraticulesLayerProps, GraticulesLayerState } from './graticules.types'
import { generateGraticulesFeatures } from './graticules.data'

const defaultProps: DefaultProps<GraticulesLayerProps> = {
  color: '#fff',
}

export class GraticulesLayer<PropsT = {}> extends CompositeLayer<GraticulesLayerProps & PropsT> {
  static layerName = 'ContextLayer'
  static defaultProps = defaultProps
  state!: GraticulesLayerState

  _getContextZoom = (context: LayerContext) => Math.round(context.viewport.zoom * 10) / 10

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      zoom: this._getContextZoom(context),
      data: generateGraticulesFeatures(),
    }
  }

  shouldUpdateState({ context }: UpdateParameters<this>) {
    const newZoom = this._getContextZoom(context)
    return this.state.zoom !== newZoom
  }

  updateState({ context }: UpdateParameters<this>) {
    this.setState({
      zoom: this._getContextZoom(context),
    })
  }

  _getLineWidth: Accessor<GeoJsonProperties, number> = (d) => {
    const { zoom } = this.state
    if (zoom < 4) {
      return d?.properties.scaleRank >= 30 ? 1 : 0
    } else if (zoom >= 4 && zoom < 5.7) {
      return d?.properties.scaleRank >= 10 ? 1 : 0
    } else if (zoom >= 5.7 && zoom < 7) {
      return d?.properties.scaleRank >= 5 ? 1 : 0
    } else {
      return 1
    }
  }

  _getLineColor: Accessor<GeoJsonProperties, Color> = (d) => {
    return hexToDeckColor(this.props.color, 0.3)
  }

  renderLayers() {
    return new PathLayer<Feature<LineString>>({
      id: `${this.props.id}-lines`,
      data: this.state.data,
      pickable: false,
      widthMinPixels: 0,
      widthUnits: 'pixels',
      getPath: (d) => d.geometry.coordinates as PathGeometry,
      getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.BasemapFill, params),
      getWidth: this._getLineWidth,
      getColor: this._getLineColor,
      updateTriggers: {
        getWidth: [this.state.zoom],
        getColor: [this.props.color],
      },
    })
  }
}
