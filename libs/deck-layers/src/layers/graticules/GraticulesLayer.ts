import type {
  Accessor,
  AccessorFunction,
  DefaultProps,
  LayerContext,
  Position,
  UpdateParameters,
} from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { PathLayer, TextLayer } from '@deck.gl/layers'
import type { PathGeometry } from '@deck.gl/layers/dist/path-layer/path'
import type { GeoJsonProperties } from 'geojson'

import {
  BLEND_BACKGROUND,
  getLayerGroupOffset,
  getViewportHash,
  hexToDeckColor,
  LayerGroup,
} from '../../utils'

import { generateGraticulesFeatures } from './graticules.data'
import type {
  GraticulesFeature,
  GraticulesLayerProps,
  GraticulesLayerState,
} from './graticules.types'
import { checkScaleRankByViewport } from './graticules.utils'

const defaultProps: DefaultProps<GraticulesLayerProps> = {
  color: '#fff',
}

export class GraticulesLayer<PropsT = Record<string, unknown>> extends CompositeLayer<
  GraticulesLayerProps & PropsT
> {
  static layerName = 'ContextLayer'
  static defaultProps = defaultProps
  state!: GraticulesLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      viewportHash: getViewportHash({ viewport: context.viewport }),
      data: generateGraticulesFeatures(),
    }
  }

  shouldUpdateState({ context, oldProps, props }: UpdateParameters<this>) {
    const viewportHash = getViewportHash({ viewport: context.viewport })
    return this.state.viewportHash !== viewportHash || oldProps.color !== props.color
  }

  updateState({ context }: UpdateParameters<this>) {
    this.setState({
      viewportHash: getViewportHash({ viewport: context.viewport }),
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
    const { color } = this.props
    const { viewportHash, data } = this.state
    return [
      new PathLayer<GraticulesFeature>({
        id: `${this.props.id}-lines`,
        data: data,
        widthUnits: 'pixels',
        getPath: (d) => d.geometry.coordinates as PathGeometry,
        getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.Overlay, params),
        getWidth: this._getLineWidth,
        getColor: hexToDeckColor(color, 0.3),
        updateTriggers: {
          getWidth: [viewportHash],
          getColor: [color],
        },
      }),
      new TextLayer<GraticulesFeature>({
        id: `${this.props.id}-labels`,
        data: data,
        getText: this._getLabel,
        getPosition: this._getLabelPosition,
        getColor: hexToDeckColor(color, 0.5),
        outlineColor: hexToDeckColor(BLEND_BACKGROUND, 0.7),
        fontFamily: 'Roboto',
        outlineWidth: 200,
        fontSettings: { sdf: true, smoothing: 0.2, buffer: 10 },
        sizeUnits: 'pixels',
        getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.Overlay, params),
        getSize: 12,
        getTextAnchor: this._getTextAnchor,
        getAlignmentBaseline: this._getAlignmentBaseline,
        getPixelOffset: this._getPixelOffset,
        updateTriggers: {
          getText: [viewportHash],
          getPosition: [viewportHash],
          getColor: [color],
        },
      }),
    ]
  }
}
