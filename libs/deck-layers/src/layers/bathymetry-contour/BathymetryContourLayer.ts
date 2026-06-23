import type { DefaultProps, LayerContext } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { CollisionFilterExtension } from '@deck.gl/extensions'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { PathLayer } from '@deck.gl/layers'
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
  color: '#ffffff',
  thickness: 1,
  maxRequests: 100,
  debounceTime: 500,
}

const TILES_MAX_ZOOM = 12

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

  _bathymetryColorScale = scaleLinear([-10, -100, -1000, -10000], [0.8, 0.6, 0.4, 0.2]).clamp(true)
  _priorityLengthScale = scaleLinear([5, 10000], [-900, 900]).clamp(true)
  _priorityBearingScale = scaleLinear([-180, 0, 180], [-100, 100, -100]).clamp(true)

  _pathCache = new WeakMap<object, (BathymetryContourFeature & { path: number[][] })[]>()
  _getPaths = (features: BathymetryContourFeature[]) => {
    let paths = this._pathCache.get(features)
    if (!paths) {
      paths = features.flatMap((d) => {
        if (d.geometry?.type === 'MultiLineString') {
          return d.geometry.coordinates.map((path) => ({ ...d, path }))
        }
        if (d.geometry?.type === 'LineString') {
          return [{ ...d, path: d.geometry.coordinates }]
        }
        return []
      })
      this._pathCache.set(features, paths)
    }
    return paths
  }

  _getBathymetryColor = (d: BathymetryContourFeature | BathymetryLabelFeature) => {
    const baseOpacity = this._bathymetryColorScale(d.properties?.depths)
    const zoomOpacityMultiplier = Math.min(1, Math.max(0.2, this.context.viewport.zoom / 8))
    const finalOpacity = baseOpacity * zoomOpacityMultiplier
    return hexToDeckColor(this.props.color, finalOpacity)
  }

  renderLayers() {
    const { visible, color, tilesUrl, depths } = this.props
    if (!visible) return []

    const hasDepthFilter = depths !== undefined && depths.length > 0
    const matchesDepth = (elevation: number) => !hasDepthFilter || depths.includes(0 - elevation)

    return new PMTilesLayer<TileLayerProps>({
      id: `${this.id}-boundaries-layer`,
      data: tilesUrl,
      maxZoom: TILES_MAX_ZOOM,
      updateTriggers: {
        renderSubLayers: [depths, color],
      },
      renderSubLayers: (props: any) => {
        return [
          new PathLayer(props, {
            id: `${props.id}-bathymetry-contour`,
            data: this._getPaths((props.data?.features as BathymetryContourFeature[]) ?? []).filter(
              (d) => matchesDepth(d.properties?.elevation)
            ),
            getPath: (d: any) => d.path,
            positionFormat: 'XY',
            getColor: this._getBathymetryColor,
            getWidth: 1,
            widthUnits: 'pixels',
            jointRounded: true,
            capRounded: true,
            getPolygonOffset: (params: { layerIndex: number }) =>
              getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
            updateTriggers: { getColor: [color] },
          } as any),
          new LabelLayer<BathymetryLabelFeature>({
            id: `${props.id}-labels`,
            data: ((props.data?.features ?? []) as BathymetryLabelFeature[]).filter(
              (d) => d.geometry?.type === 'Point' && matchesDepth(d.properties.elevation)
            ),
            extensions: [new CollisionFilterExtension()],
            getCollisionPriority: (d: BathymetryLabelFeature) => {
              if (d.properties.length === undefined) {
                return -1000
              }
              return (
                this._priorityLengthScale(d.properties.length) +
                this._priorityBearingScale(90 - (d.properties.bearing || 0))
              )
            },
            collisionTestProps: { sizeScale: 5 },
            getSize: 11,
            getText: (d: BathymetryLabelFeature) => {
              return d.properties.elevation?.toString().slice(1)
            },
            getPosition: (d: BathymetryLabelFeature) => {
              return d.geometry.coordinates as [number, number]
            },
            getAngle: (d: BathymetryLabelFeature) => {
              return 90 - (d.properties.bearing || 0)
            },
            getColor: this._getBathymetryColor,
            updateTriggers: { getColor: [color] },
          }),
        ]
      },
    })
  }
}
