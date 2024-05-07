import {
  CompositeLayer,
  DefaultProps,
  Accessor,
  LayerContext,
  UpdateParameters,
  AccessorFunction,
  Position,
} from '@deck.gl/core'
import { PathLayer, TextLayer } from '@deck.gl/layers'
import { GeoJsonProperties } from 'geojson'
import { PathGeometry } from '@deck.gl/layers/dist/path-layer/path'
import { hexToDeckColor, LayerGroup, getLayerGroupOffset, BLEND_BACKGROUND } from '../../utils'
import { GraticulesFeature, GraticulesLayerProps, GraticulesLayerState } from './graticules.types'
import { generateGraticulesFeatures } from './graticules.data'
import { checkScaleRankByViewport } from './graticules.utils'

const defaultProps: DefaultProps<GraticulesLayerProps> = {
  color: '#fff',
}

export class GraticulesLayer<PropsT = {}> extends CompositeLayer<GraticulesLayerProps & PropsT> {
  static layerName = 'ContextLayer'
  static defaultProps = defaultProps
  state!: GraticulesLayerState

  _getContextZoom = (context: LayerContext) => Math.round(context.viewport.zoom * 1000) / 1000

  _getViewportHash = (context: LayerContext) =>
    [
      ...context.viewport.getBounds().map((n) => Math.round(n * 1000) / 1000),
      this._getContextZoom(context),
    ].join(',')

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      viewportHash: this._getViewportHash(context),
      zoom: this._getContextZoom(context),
      data: generateGraticulesFeatures(),
    }
  }

  shouldUpdateState({ context }: UpdateParameters<this>) {
    const viewportHash = this._getViewportHash(context)
    return this.state.viewportHash !== viewportHash
  }
  // TODO:deck check against changeFlags.onViewportChange instead this manual check
  updateState({ context }: UpdateParameters<this>) {
    this.setState({
      zoom: this._getContextZoom(context),
      viewportHash: this._getViewportHash(context),
    })
  }

  _getLineWidth: Accessor<GeoJsonProperties, number> = (d) => {
    return checkScaleRankByViewport(d as GraticulesFeature, this.context.viewport) ? 1 : 0
  }

  _getLabel: AccessorFunction<GeoJsonProperties, string> = (d) => {
    if (d?.properties.label === '0') {
      const bounds = this.context.viewport.getBounds()
      const lonDelta = Math.abs(bounds[0] - bounds[2])
      return lonDelta >= 360 && d?.properties.type === 'lat' ? '' : d?.properties.label
    }
    return checkScaleRankByViewport(d as GraticulesFeature, this.context.viewport)
      ? d?.properties.label
      : ''
  }

  _getLabelPosition: AccessorFunction<GeoJsonProperties, Position> = (d) => {
    const bounds = this.context.viewport.getBounds()
    return d?.properties.type === 'lat'
      ? [bounds[0], d?.geometry.coordinates[0][1]]
      : [d?.geometry.coordinates[0][0], bounds[3]]
  }

  _getTextAnchor: AccessorFunction<GeoJsonProperties, 'start' | 'middle' | 'end'> = (d) => {
    return d?.properties.type === 'lat' ? 'start' : 'middle'
  }

  _getAlignmentBaseline: AccessorFunction<GeoJsonProperties, 'top' | 'center' | 'bottom'> = (d) => {
    return d?.properties.type === 'lat' ? 'center' : 'top'
  }

  _getPixelOffset: AccessorFunction<GeoJsonProperties, [number, number]> = (d) => {
    return d?.properties.type === 'lat' ? [5, 0] : [0, 5]
  }

  renderLayers() {
    return [
      new PathLayer<GraticulesFeature>({
        id: `${this.props.id}-lines`,
        data: this.state.data,
        widthUnits: 'pixels',
        getPath: (d) => d.geometry.coordinates as PathGeometry,
        getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.OutlinePolygonsFill, params),
        getWidth: this._getLineWidth,
        getColor: hexToDeckColor(this.props.color, 0.3),
        updateTriggers: {
          getWidth: [this.state.zoom],
          getColor: [this.props.color],
        },
      }),
      new TextLayer<GraticulesFeature>({
        id: `${this.props.id}-labels`,
        data: this.state.data,
        getText: this._getLabel,
        getPosition: this._getLabelPosition,
        getColor: hexToDeckColor(this.props.color, 0.5),
        outlineColor: hexToDeckColor(BLEND_BACKGROUND),
        fontFamily: 'Roboto',
        outlineWidth: 200,
        fontSettings: { sdf: true, smoothing: 0.2 },
        sizeUnits: 'pixels',
        getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.Overlay, params),
        getSize: 12,
        getTextAnchor: this._getTextAnchor,
        getAlignmentBaseline: this._getAlignmentBaseline,
        getPixelOffset: this._getPixelOffset,
        updateTriggers: {
          getText: [this.state.zoom],
          getPosition: [this.state.viewportHash],
          getColor: [this.props.color],
        },
      }),
    ]
  }
}
