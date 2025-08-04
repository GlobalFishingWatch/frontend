import type { DefaultProps, LayerContext } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { CollisionFilterExtension, DataFilterExtension } from '@deck.gl/extensions'
import type { GeoBoundingBox, TileLayerProps } from '@deck.gl/geo-layers'
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
import { transformCoordinates } from '../../utils/coordinates'
import { LabelLayer } from '../labels/LabelLayer'

import type {
  BathymetryContourFeature,
  BathymetryContourLayerProps,
  BathymetryLabelFeature,
} from './bathymetry-contour.types'

type _ContextLayerProps = TileLayerProps & BathymetryContourLayerProps
const defaultProps: DefaultProps<_ContextLayerProps> = {
  thickness: 1,
  pickable: true,
  maxRequests: 100,
  debounceTime: 500,
}

const MIN_ELEVATION = -10000
const TILES_MAX_ZOOM = 9
const LABELS_ZOOM_THRESHOLD = 6

export class BathymetryContourLayer<PropsT = Record<string, unknown>> extends CompositeLayer<
  _ContextLayerProps & PropsT
> {
  static layerName = 'BathymetryContourLayer'
  static defaultProps = defaultProps

  get renderLabels() {
    return this.context.viewport.zoom > LABELS_ZOOM_THRESHOLD
  }

  get isOverMaxZoom() {
    return this.context.viewport.zoom >= TILES_MAX_ZOOM
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.setState({ viewportLoaded: false, labels: [] })
  }

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

    if (!visible) return []

    return new TileLayer<TileLayerProps>({
      id: `${this.id}-boundaries-layer`,
      data: tilesUrl,
      loaders: [GFWMVTLoader],
      maxZoom: TILES_MAX_ZOOM,
      renderSubLayers: (props: any) => {
        const mvtSublayerProps = { ...props, ...getMVTSublayerProps(props) }
        return [
          new GeoJsonLayer(mvtSublayerProps, {
            id: `${props.id}-bathymetry-contour`,
            lineWidthMinPixels: 0,
            extensions: [new DataFilterExtension({ filterSize: 1 })],
            getFilterValue: (d: BathymetryContourFeature | BathymetryLabelFeature) => {
              return d.geometry?.type === 'Point' ? 0 : 1
            },
            filterRange: [1, 1],
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
          new LabelLayer<BathymetryLabelFeature>({
            id: `${props.id}-labels`,
            data: mvtSublayerProps.data,
            extensions: [
              new DataFilterExtension({ filterSize: 1 }),
              new CollisionFilterExtension(),
            ],
            getFilterValue: (d: BathymetryContourFeature | BathymetryLabelFeature) => {
              return d.geometry?.type === 'Point' ? 1 : 0
            },
            filterRange: [1, 1],
            visible: this.renderLabels,
            getCollisionPriority: (d: BathymetryLabelFeature) => Math.abs(d.properties.elevation),
            collisionTestProps: { sizeScale: 3 },
            getSize: 9,
            getPixelOffset: [0, 0],
            getText: (d: BathymetryLabelFeature) => {
              return d.properties.elevation?.toString()
            },
            getPosition: (d: BathymetryLabelFeature) => {
              return transformCoordinates(
                d.geometry,
                props.tile.bbox as GeoBoundingBox,
                this.context.viewport
              ).coordinates
            },
            getAngle: (d: BathymetryLabelFeature) => {
              return 0
              return 90 - d.properties.angle || 0
            },
            getColor: hexToDeckColor(color),
            // outlineColor: hexToDeckColor(BLEND_BACKGROUND, 0.7),
          }),
        ]
      },
    })
  }
}
