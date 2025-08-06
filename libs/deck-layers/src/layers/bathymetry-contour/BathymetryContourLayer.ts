import type { DefaultProps, LayerContext } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { DataFilterExtensionOptions } from '@deck.gl/extensions'
import { CollisionFilterExtension, DataFilterExtension } from '@deck.gl/extensions'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import { scaleLinear } from 'd3-scale'

import { getLayerGroupOffset, hexToDeckColor, LayerGroup } from '../../utils'
import { LabelLayer } from '../labels/LabelLayer'
import { PMTilesLayer } from '../pm-tiles'

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

const TILES_MAX_ZOOM = 12
const filterRange = [1, 1] as [number, number]

export class BathymetryContourLayer<PropsT = Record<string, unknown>> extends CompositeLayer<
  _ContextLayerProps & PropsT
> {
  static layerName = 'BathymetryContourLayer'
  static defaultProps = defaultProps

  get isOverMaxZoom() {
    return this.context.viewport.zoom >= TILES_MAX_ZOOM
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.setState({ viewportLoaded: false, labels: [] })
  }

  _bathymetryColorScale = scaleLinear([-50, -500, -1000, -6000], [1, 0.3, 0.2, 0.1])

  _getBathymetryColor = (d: BathymetryContourFeature | BathymetryLabelFeature) => {
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
    const { visible, color, tilesUrl, thickness = 1, elevations } = this.props

    if (!visible) return []

    const hasElevationsFilter = elevations !== undefined && elevations.length > 0
    const filterExtensionParams: DataFilterExtensionOptions = {
      filterSize: 1,
      ...(hasElevationsFilter && {
        categorySize: 1,
      }),
    }

    return new PMTilesLayer<TileLayerProps>({
      id: `${this.id}-boundaries-layer`,
      data: tilesUrl,
      maxZoom: TILES_MAX_ZOOM,
      updateTriggers: {
        data: [elevations],
      },
      renderSubLayers: (props: any) => {
        return [
          new GeoJsonLayer(props, {
            id: `${props.id}-bathymetry-contour`,
            lineWidthMinPixels: 0,
            extensions: [new DataFilterExtension(filterExtensionParams)],
            getFilterValue: (d: BathymetryContourFeature | BathymetryLabelFeature) => {
              return d.geometry?.type !== 'Point' ? 1 : 0
            },
            filterRange,
            ...(hasElevationsFilter && {
              getFilterCategory: (d: BathymetryLabelFeature) => d.properties.elevation,
              filterCategories: elevations,
            }),
            filled: false,
            getPolygonOffset: (params: { layerIndex: number }) =>
              getLayerGroupOffset(LayerGroup.Overlay, params),
            getLineColor: this._getBathymetryColor,
            getLineWidth: thickness,
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
            data: props.data?.features,
            extensions: [
              new DataFilterExtension(filterExtensionParams),
              new CollisionFilterExtension(),
            ],
            getFilterValue: (d: BathymetryContourFeature | BathymetryLabelFeature) => {
              return d.geometry?.type === 'Point' ? 1 : 0
            },
            filterRange,
            ...(hasElevationsFilter && {
              getFilterCategory: (d: BathymetryLabelFeature) => d.properties.elevation,
              filterCategories: elevations,
            }),
            getCollisionPriority: (d: BathymetryLabelFeature) => d.properties.length / 1000,
            collisionTestProps: { sizeScale: 5 },
            getSize: 10,
            getPixelOffset: [0, 0],
            getText: (d: BathymetryLabelFeature) => {
              return d.properties.elevation?.toString()
            },
            getPosition: (d: BathymetryLabelFeature) => {
              return d.geometry.coordinates as [number, number]
            },
            getAngle: (d: BathymetryLabelFeature) => {
              return 90 - d.properties.bearing || 0
            },
            getColor: this._getBathymetryColor,
            // outlineColor: hexToDeckColor(BLEND_BACKGROUND, 0.7),
          }),
        ]
      },
    })
  }
}
