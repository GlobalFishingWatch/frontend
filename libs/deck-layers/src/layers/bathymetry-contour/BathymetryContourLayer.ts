import type {
  Accessor,
  DefaultProps,
  LayerContext,
  PickingInfo,
  Position,
  UpdateParameters,
} from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { CollisionFilterExtension } from '@deck.gl/extensions'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import type { PathLayerProps } from '@deck.gl/layers'
import { PathLayer } from '@deck.gl/layers'
import { scaleLinear } from 'd3-scale'
import { debounce } from 'es-toolkit'

import { DataviewType } from '@globalfishingwatch/api-types'

import { HOVER_DEBOUNCE_DELAY } from '#config/layers.config'
import { LayerGroup } from '#config/sort.config'
import { LabelLayer } from '#layers/labels/LabelLayer'
import { PMTilesLayer } from '#layers/pm-tiles/index'
import { getLayerGroupOffset, hexToDeckColor } from '#utils'
import { colorToVec } from '#utils/colors'

import { BATHYMETRY_DEPTH_GROUPS } from './bathymetry-contour.config'
import type {
  BathymetryContourFeature,
  BathymetryContourLayerProps,
  BathymetryContourPickingInfo,
  BathymetryContourPickingObject,
  BathymetryLabelFeature,
  BathymetryTileFeature,
} from './bathymetry-contour.types'

type _ContextLayerProps = TileLayerProps & BathymetryContourLayerProps
const defaultProps: DefaultProps<_ContextLayerProps> = {
  color: '#ffffff',
  thickness: 1,
  maxRequests: 100,
  debounceTime: 500,
}

const TILES_MAX_ZOOM = 12
const INDEX_DEPTHS = new Set(BATHYMETRY_DEPTH_GROUPS['pelagic zones'])
const INDEX_WIDTH_SCALE = 1.5
const INTERMEDIATE_WIDTH_SCALE = 0.75
const LINE_WIDTH_MIN_PIXELS = 0.75
const INTERMEDIATE_OPACITY_SCALE = 0.5
const MIN_INTERMEDIATE_OPACITY = 0.25
const INDEX_PRIORITY_BONUS = 500
const LABEL_OPACITY = 0.9
const PICK_TARGET_WIDTH = 5
const MIN_PICK_ZOOM = 3
const HIGHLIGHT_WIDTH = 1.5
const NO_HIGHLIGHT_ELEVATION = 1

const isIndexContour = (elevation: number) => INDEX_DEPTHS.has(0 - elevation)

type _BathymetryContourPathLayerProps<DataT = any> = {
  /** Elevation of the contour a segment belongs to, as a per-instance attribute. */
  getElevation?: Accessor<DataT, number>
  /** Elevation currently hovered, or `NO_HIGHLIGHT_ELEVATION`. */
  highlightedElevation?: number
  /** Hex colour drawn on the hovered contour. Not `highlightColor` — that name is taken by
   * the base Layer's `autoHighlight` prop. */
  highlightLineColor?: string
  /** Fades every non-highlighted contour out as the map zooms away. */
  zoomOpacity?: number
}

const uniformBlock = /*glsl*/ `
  uniform bathymetryUniforms {
    uniform float highlightedElevation;
    uniform float zoomOpacity;
    uniform vec4 highlightColor;
    uniform float highlightWidth;
  } bathymetry;
`

const bathymetryLayerUniforms = {
  name: 'bathymetry',
  vs: uniformBlock,
  uniformTypes: {
    highlightedElevation: 'f32',
    zoomOpacity: 'f32',
    highlightColor: 'vec4<f32>',
    highlightWidth: 'f32',
  },
}

type BathymetryContourPathLayerProps<DataT = any> = _BathymetryContourPathLayerProps<DataT> &
  PathLayerProps<DataT>

const contourPathDefaultProps: DefaultProps<BathymetryContourPathLayerProps> = {
  getElevation: { type: 'accessor', value: NO_HIGHLIGHT_ELEVATION },
  highlightedElevation: { type: 'number', value: NO_HIGHLIGHT_ELEVATION },
  highlightLineColor: '#ffffff',
  zoomOpacity: { type: 'number', value: 1 },
}

/**
 * Contour lines are dense enough that recomputing per-vertex colors and widths on hover is
 * visibly slow. Elevation rides along as an instanced attribute instead, and both the highlight
 * and the zoom fade are resolved in the vertex shader against uniforms, so hovering costs one
 * uniform write rather than a re-tesselation and an attribute re-upload per tile.
 */
class BathymetryContourPathLayer<DataT = any> extends PathLayer<
  DataT,
  _BathymetryContourPathLayerProps<DataT>
> {
  static layerName = 'BathymetryContourPathLayer'
  static defaultProps = contourPathDefaultProps

  getShaders() {
    const shaders = super.getShaders()
    shaders.modules = [...(shaders.modules || []), bathymetryLayerUniforms]
    shaders.inject = {
      ...(shaders.inject || {}),
      'vs:#decl': /*glsl*/ `
        in float instanceElevations;
        bool bathymetry_isHighlighted() {
          return abs(instanceElevations - bathymetry.highlightedElevation) < 0.5;
        }
      `,
      'vs:DECKGL_FILTER_SIZE': /*glsl*/ `
        if (bathymetry_isHighlighted()) {
          size.xy = max(size.xy, project_pixel_size(vec2(bathymetry.highlightWidth * 0.5)));
        }
        // same trick as VesselTrackPathLayer for the picking target width
        if (picking.isActive > 0.5) {
          size.xy = max(size.xy, project_pixel_size(vec2(${(PICK_TARGET_WIDTH / 2).toFixed(1)})));
        }
      `,
      'vs:DECKGL_FILTER_COLOR': /*glsl*/ `
        if (bathymetry_isHighlighted()) {
          color = bathymetry.highlightColor;
        } else {
          color.a *= bathymetry.zoomOpacity;
        }
      `,
    }
    return shaders
  }

  initializeState() {
    super.initializeState()
    this.getAttributeManager()?.addInstanced({
      elevations: {
        size: 1,
        accessor: 'getElevation',
        shaderAttributes: { instanceElevations: {} },
      },
    })
  }

  draw(params: { uniforms: any }) {
    const { model } = this.state
    if (model) {
      const {
        highlightedElevation = NO_HIGHLIGHT_ELEVATION,
        highlightLineColor = '#ffffff',
        zoomOpacity = 1,
      } = this.props
      model.shaderInputs.setProps({
        bathymetry: {
          highlightedElevation,
          zoomOpacity,
          highlightColor: hexToDeckColor(highlightLineColor, 1).map((c) => colorToVec(c)),
          highlightWidth: HIGHLIGHT_WIDTH,
        },
      })
    }
    super.draw(params)
  }
}

const isBelowSeaLevel = (elevation: number) => elevation !== undefined && elevation <= 0

type BathymetryPathFeature = BathymetryContourFeature & { path: number[][] }

const isLabelFeature = (feature: BathymetryTileFeature): feature is BathymetryLabelFeature =>
  feature.geometry?.type === 'Point'

const EMPTY_VISIBLE_DATA = {
  depthsKey: '',
  paths: [] as BathymetryPathFeature[],
  labels: [] as BathymetryLabelFeature[],
}

export class BathymetryContourLayer<PropsT = Record<string, unknown>> extends CompositeLayer<
  _ContextLayerProps & PropsT
> {
  static layerName = 'BathymetryContourLayer'
  static defaultProps = defaultProps
  declare state: { zoomBucket: number; highlightedElevation: number | null }

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

  _visibleCache = new WeakMap<
    object,
    {
      depthsKey: string
      paths: BathymetryPathFeature[]
      labels: BathymetryLabelFeature[]
    }
  >()
  _getVisibleData = (
    features: BathymetryTileFeature[] | undefined,
    depthsKey: string,
    matchesDepth: (elevation: number) => boolean
  ) => {
    if (!features?.length) {
      return EMPTY_VISIBLE_DATA
    }
    const cached = this._visibleCache.get(features)
    if (cached?.depthsKey === depthsKey) {
      return cached
    }
    const paths: BathymetryPathFeature[] = []
    const labels: BathymetryLabelFeature[] = []
    for (const feature of features) {
      if (!matchesDepth(feature.properties?.elevation)) {
        continue
      }
      if (isLabelFeature(feature)) {
        labels.push(feature)
      } else if (feature.geometry?.type === 'MultiLineString') {
        for (const path of feature.geometry.coordinates) {
          paths.push({ ...feature, path })
        }
      } else if (feature.geometry?.type === 'LineString') {
        paths.push({ ...feature, path: feature.geometry.coordinates })
      }
    }
    const entry = { depthsKey, paths, labels }
    this._visibleCache.set(features, entry)
    return entry
  }

  _getZoomOpacity = () => Math.min(1, Math.max(0.2, this.context.viewport.zoom / 8))

  _getLineColor = (d: BathymetryContourFeature) => {
    const elevation = d.properties?.elevation
    const base = this._bathymetryColorScale(elevation)
    const opacity = isIndexContour(elevation)
      ? base
      : Math.max(MIN_INTERMEDIATE_OPACITY, base * INTERMEDIATE_OPACITY_SCALE)
    return hexToDeckColor(this.props.color, opacity)
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
    if (elevation === undefined) {
      return { ...info, object: undefined }
    }
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

  _setHighlightedElevation = debounce((highlightedElevation: number | null) => {
    if (highlightedElevation !== this.state?.highlightedElevation) {
      this.setState({ highlightedElevation })
    }
  }, HOVER_DEBOUNCE_DELAY)

  setHighlightedFeatures(highlightedFeatures: BathymetryContourPickingObject[]) {
    this._setHighlightedElevation(highlightedFeatures?.[0]?.properties?.elevation ?? null)
  }

  finalizeState(context: LayerContext) {
    this._setHighlightedElevation.cancel()
    super.finalizeState(context)
  }

  _getLabelAngle = (d: BathymetryLabelFeature) => {
    const angle = 90 - (d.properties.bearing || 0)
    const wrapped = ((((angle + 180) % 360) + 360) % 360) - 180
    if (wrapped > 90) {
      return wrapped - 180
    }
    if (wrapped <= -90) {
      return wrapped + 180
    }
    return wrapped
  }

  renderLayers() {
    const { visible, color, tilesUrl, depths, thickness, maxRequests, debounceTime } = this.props
    if (!visible) {
      return []
    }

    const { zoomBucket, highlightedElevation } = this.state
    const hasDepthFilter = depths !== undefined && depths.length > 0
    const depthsKey = hasDepthFilter ? depths.join(',') : ''
    const matchesDepth = (elevation: number) =>
      isBelowSeaLevel(elevation) && (!hasDepthFilter || depths.includes(0 - elevation))

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
        const { paths, labels } = this._getVisibleData(
          props.data?.features as BathymetryTileFeature[],
          depthsKey,
          matchesDepth
        )
        return [
          new BathymetryContourPathLayer<BathymetryPathFeature>(props, {
            id: `${props.id}-bathymetry-contour`,
            data: paths,
            getPath: (d: BathymetryPathFeature) => d.path as unknown as Position[],
            positionFormat: 'XY',
            getColor: this._getLineColor,
            getWidth: this._getLineWidth,
            getElevation: (d: BathymetryContourFeature) =>
              d.properties?.elevation ?? NO_HIGHLIGHT_ELEVATION,
            highlightedElevation: highlightedElevation ?? NO_HIGHLIGHT_ELEVATION,
            highlightLineColor: color,
            zoomOpacity: this._getZoomOpacity(),
            widthUnits: 'pixels',
            widthMinPixels: LINE_WIDTH_MIN_PIXELS,
            jointRounded: true,
            capRounded: true,
            pickable: zoomBucket > MIN_PICK_ZOOM,
            getPolygonOffset: (params: { layerIndex: number }) =>
              getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
            updateTriggers: {
              getColor: [color],
              getWidth: [thickness],
            },
          }),
          new LabelLayer<BathymetryLabelFeature>({
            id: `${props.id}-labels`,
            data: labels,
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
