import type { DefaultProps } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import { scaleLinear } from 'd3-scale'

import {
  getFeatureInFilter,
  getLayerGroupOffset,
  getMVTSublayerProps,
  GFWMVTLoader,
  hexToDeckColor,
  LayerGroup,
} from '../../utils'

import type {
  BathymetryContourFeature,
  BathymetryContourLayerProps,
} from './bathymetry-contour.types'

type _ContextLayerProps = TileLayerProps & BathymetryContourLayerProps
const defaultProps: DefaultProps<_ContextLayerProps> = {
  thickness: 1,
  pickable: true,
  maxRequests: 100,
  debounceTime: 500,
}

const MIN_ELEVATION = -10000

export class BathymetryContourLayer<PropsT = Record<string, unknown>> extends CompositeLayer<
  _ContextLayerProps & PropsT
> {
  static layerName = 'BathymetryContourLayer'
  static defaultProps = defaultProps

  _getLineWidth = (d: BathymetryContourFeature): number => {
    const { thickness, filters } = this.props
    return getFeatureInFilter(d, filters) ? thickness || 1 : 0
  }

  _bathymetryColorScale = scaleLinear([-50, -500, -1000, -6000], [1, 0.3, 0.2, 0.1])

  _getBathymetryLineColor = (d: BathymetryContourFeature) => {
    // return hexToDeckColor(this.props.color)
    // if (this.context.viewport.zoom < 2) {
    //   if ((d.properties.elevation / 2000) % 1 === 0) {
    //     return hexToDeckColor(this.props.color, this._bathymetryColorScale(d.properties.elevation))
    //   }
    //   return COLOR_TRANSPARENT
    // }

    // Get base opacity from elevation scale
    const baseOpacity = this._bathymetryColorScale(d.properties?.elevation)

    // Apply zoom-based opacity multiplier
    // Higher zoom = more opaque features
    const zoom = this.context.viewport.zoom
    const zoomOpacityMultiplier = Math.min(1, Math.max(0.3, zoom / 8)) // Scale from 0.3 at low zoom to 1 at zoom 8+

    const finalOpacity = baseOpacity * zoomOpacityMultiplier
    return hexToDeckColor(this.props.color, finalOpacity)
  }

  renderLayers() {
    const { visible, color, tilesUrl, thickness } = this.props
    console.log('🚀 ~ renderLayers ~ thickness:', thickness)

    if (!visible) return []

    return new TileLayer<TileLayerProps>({
      id: `${this.id}-boundaries-layer`,
      data: tilesUrl,
      loaders: [GFWMVTLoader],
      maxZoom: 12,
      renderSubLayers: (props: any) => {
        const mvtSublayerProps = { ...props, ...getMVTSublayerProps(props) }
        return [
          new GeoJsonLayer(mvtSublayerProps, {
            id: `${props.id}-bathymetry-contour`,
            onViewportLoad: this.props.onViewportLoad,
            lineWidthMinPixels: 0,
            filled: false,
            getPolygonOffset: (params: { layerIndex: number }) =>
              getLayerGroupOffset(LayerGroup.Overlay, params),
            getLineColor: this._getBathymetryLineColor,
            getLineWidth: this._getLineWidth,
            lineWidthUnits: 'pixels',
            lineJointRounded: true,
            lineCapRounded: true,
            updateTriggers: {
              getLineWidth: [thickness],
              getLineColor: [color],
            },
          } as any),
        ]
      },
    })
  }
}
