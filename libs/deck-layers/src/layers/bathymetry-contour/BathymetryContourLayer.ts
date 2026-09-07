import type { DefaultProps, PickingInfo, UpdateParameters } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { CollisionFilterExtension } from '@deck.gl/extensions'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { PathLayer } from '@deck.gl/layers'
import { scaleLinear } from 'd3-scale'

import { DataviewType } from '@globalfishingwatch/api-types'

import { COLOR_TRANSPARENT } from '#config/colors.config'
import { LayerGroup } from '#config/sort.config'
import { LabelLayer } from '#layers/labels/LabelLayer'
import { PMTilesLayer } from '#layers/pm-tiles/index'
import { getLayerGroupOffset, hexToDeckColor } from '#utils'

import type {
  BathymetryContourFeature,
  BathymetryContourLayerProps,
  BathymetryContourPickingInfo,
  BathymetryContourPickingObject,
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
const INDEX_DEPTHS = new Set([200, 1000, 4000, 6000])
const INDEX_WIDTH_SCALE = 1.5
const INTERMEDIATE_WIDTH_SCALE = 0.75
const LINE_WIDTH_MIN_PIXELS = 0.75
const INTERMEDIATE_OPACITY_SCALE = 0.5
const MIN_INTERMEDIATE_OPACITY = 0.25
const INDEX_PRIORITY_BONUS = 500
const LABEL_OPACITY = 0.9
const PICK_TARGET_WIDTH = 5
const HIGHLIGHT_WIDTH_SCALE = 1.5

const isIndexContour = (elevation: number) => INDEX_DEPTHS.has(0 - elevation)

const isBelowSeaLevel = (elevation: number) => elevation !== undefined && elevation <= 0

export class BathymetryContourLayer<PropsT = Record<string, unknown>> extends CompositeLayer<
  _ContextLayerProps & PropsT
> {
  static layerName = 'BathymetryContourLayer'
  static defaultProps = defaultProps

  _bathymetryColorScale = scaleLinear([-10, -100, -1000, -10000], [0.8, 0.6, 0.4, 0.2]).clamp(true)
  _priorityLengthScale = scaleLinear([5, 10000], [-350, 350]).clamp(true)
  _priorityBearingScale = scaleLinear([-90, 0, 90], [-100, 100, -100]).clamp(true)

  _getZoomBucket = () => Math.round(this.context.viewport.zoom * 2) / 2

  shouldUpdateState({ changeFlags }: UpdateParameters<this>) {
    return changeFlags.propsOrDataChanged || this.state?.zoomBucket !== this._getZoomBucket()
  }

  updateState() {
    this.setState({ zoomBucket: this._getZoomBucket() })
  }

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

  _getZoomOpacity = () => Math.min(1, Math.max(0.2, this.context.viewport.zoom / 8))

  _getLineColor = (d: BathymetryContourFeature) => {
    const elevation = d.properties?.elevation
    const base = this._bathymetryColorScale(elevation)
    const opacity = isIndexContour(elevation)
      ? base
      : Math.max(MIN_INTERMEDIATE_OPACITY, base * INTERMEDIATE_OPACITY_SCALE)
    return hexToDeckColor(this.props.color, opacity * this._getZoomOpacity())
  }

  _getLineWidth = (d: BathymetryContourFeature) => {
    const thickness = this.props.thickness || 1
    return isIndexContour(d.properties?.elevation)
      ? thickness * INDEX_WIDTH_SCALE
      : thickness * INTERMEDIATE_WIDTH_SCALE
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<BathymetryContourFeature>
  }): BathymetryContourPickingInfo => {
    const elevation = info.object?.properties?.elevation
    if (elevation === undefined) return { ...info, object: undefined }
    return {
      ...info,
      object: {
        id: `${this.props.id}-${elevation}`,
        layerId: this.props.id,
        category: this.props.category,
        subcategory: DataviewType.Bathymetry,
        color: this.props.color,
        properties: { elevation },
      },
    }
  }

  setHighlightedFeatures(highlightedFeatures: BathymetryContourPickingObject[]) {
    const highlightedElevation = highlightedFeatures?.[0]?.properties?.elevation ?? null
    if (highlightedElevation !== this.state.highlightedElevation) {
      this.setState({ highlightedElevation })
    }
  }

  _getLabelAngle = (d: BathymetryLabelFeature) => {
    const angle = 90 - (d.properties.bearing || 0)
    const wrapped = ((((angle + 180) % 360) + 360) % 360) - 180
    if (wrapped > 90) return wrapped - 180
    if (wrapped <= -90) return wrapped + 180
    return wrapped
  }

  renderLayers() {
    const { visible, color, tilesUrl, depths, thickness, maxRequests, debounceTime } = this.props
    if (!visible) return []

    const { zoomBucket, highlightedElevation } = this.state
    const hasDepthFilter = depths !== undefined && depths.length > 0
    const matchesDepth = (elevation: number) =>
      isBelowSeaLevel(elevation) && (!hasDepthFilter || depths.includes(0 - elevation))
    const getVisiblePaths = (features: BathymetryContourFeature[]) =>
      this._getPaths(features ?? []).filter((d) => matchesDepth(d.properties?.elevation))

    return new PMTilesLayer<TileLayerProps>({
      id: `${this.id}-boundaries-layer`,
      data: tilesUrl,
      maxZoom: TILES_MAX_ZOOM,
      maxRequests,
      debounceTime,
      updateTriggers: {
        renderSubLayers: [depths, color, thickness, zoomBucket, highlightedElevation],
      },
      renderSubLayers: (props: any) => {
        const paths = getVisiblePaths(props.data?.features as BathymetryContourFeature[])
        return [
          new PathLayer(props, {
            id: `${props.id}-bathymetry-contour`,
            data: paths,
            getPath: (d: any) => d.path,
            positionFormat: 'XY',
            getColor: this._getLineColor,
            getWidth: this._getLineWidth,
            widthUnits: 'pixels',
            widthMinPixels: LINE_WIDTH_MIN_PIXELS,
            jointRounded: true,
            capRounded: true,
            pickable: false,
            getPolygonOffset: (params: { layerIndex: number }) =>
              getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
            updateTriggers: {
              getColor: [color, zoomBucket],
              getWidth: [thickness],
            },
          } as any),
          new PathLayer(props, {
            id: `${props.id}-bathymetry-contour-pick-target`,
            data: paths,
            getPath: (d: any) => d.path,
            positionFormat: 'XY',
            getColor: COLOR_TRANSPARENT,
            getWidth: PICK_TARGET_WIDTH,
            widthUnits: 'pixels',
            jointRounded: false,
            capRounded: false,
            pickable: true,
            getPolygonOffset: (params: { layerIndex: number }) =>
              getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
          } as any),
          new PathLayer(props, {
            id: `${props.id}-bathymetry-contour-highlight`,
            visible: highlightedElevation !== null && highlightedElevation !== undefined,
            data: paths.filter((d) => d.properties?.elevation === highlightedElevation),
            getPath: (d: any) => d.path,
            positionFormat: 'XY',
            getColor: hexToDeckColor(color, 1),
            getWidth: (thickness || 1) * HIGHLIGHT_WIDTH_SCALE,
            widthUnits: 'pixels',
            widthMinPixels: 1.5,
            jointRounded: true,
            capRounded: true,
            pickable: false,
            getPolygonOffset: (params: { layerIndex: number }) =>
              getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
            updateTriggers: {
              getColor: [color],
              getWidth: [thickness],
            },
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
                (isIndexContour(d.properties.elevation)
                  ? INDEX_PRIORITY_BONUS
                  : -INDEX_PRIORITY_BONUS) +
                this._priorityLengthScale(d.properties.length) +
                this._priorityBearingScale(this._getLabelAngle(d))
              )
            },
            collisionTestProps: { sizeScale: 5 },
            getSize: 11,
            getText: (d: BathymetryLabelFeature) => {
              return Math.abs(d.properties.elevation).toString()
            },
            getPosition: (d: BathymetryLabelFeature) => {
              return d.geometry.coordinates as [number, number]
            },
            getAngle: this._getLabelAngle,
            getPixelOffset: [0, 0],
            getColor: hexToDeckColor(color, LABEL_OPACITY * this._getZoomOpacity()),
            updateTriggers: { getColor: [color, zoomBucket] },
          }),
        ]
      },
    })
  }
}
