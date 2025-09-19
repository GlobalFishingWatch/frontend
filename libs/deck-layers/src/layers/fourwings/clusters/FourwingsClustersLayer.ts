import type {
  DefaultProps,
  Layer,
  LayerContext,
  LayersList,
  PickingInfo,
  UpdateParameters,
} from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
// import { CollisionFilterExtension } from '@deck.gl/extensions'
import type {
  GeoBoundingBox,
  Tile2DHeader,
  TileLoadProps,
} from '@deck.gl/geo-layers/dist/tileset-2d'
import { IconLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import { parse } from '@loaders.gl/core'
import type { ScalePower } from 'd3-scale'
import { scaleSqrt } from 'd3-scale'
import { max } from 'simple-statistics'
import Supercluster from 'supercluster'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { GFWAPI } from '@globalfishingwatch/api-client'
import type { ClusterMaxZoomLevelConfig, FourwingsGeolocation } from '@globalfishingwatch/api-types'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { FourwingsClustersLoader, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import {
  COLOR_HIGHLIGHT_LINE,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_LINE_COLOR,
  getLayerGroupOffset,
  GFWMVTLoader,
  hexToDeckColor,
  LayerGroup,
} from '../../../utils'
import { transformTileCoordsToWGS84 } from '../../../utils/coordinates'
import { PATH_BASENAME } from '../../layers.config'
import {
  FOURWINGS_MAX_ZOOM,
  HEATMAP_API_TILES_URL,
  MAX_ZOOM_TO_CLUSTER_POINTS,
  POSITIONS_VISUALIZATION_MAX_ZOOM,
} from '../fourwings.config'
import { getURLFromTemplate } from '../heatmap/fourwings-heatmap.utils'

import type {
  FourwingsClusterEventType,
  FourwingsClusterFeature,
  FourwingsClusterMode,
  FourwingsClusterPickingInfo,
  FourwingsClustersLayerProps,
  FourwingsPointFeature,
} from './fourwings-clusters.types'

type FourwingsClustersTileLayerState = {
  error: string
  clusterIndex: Supercluster
  viewportLoaded: boolean
  data: FourwingsPointFeature[]
  clusters?: FourwingsClusterFeature[]
  points?: FourwingsPointFeature[]
  radiusScale?: ScalePower<number, number>
  currentClustersZoom?: number
}

const defaultProps: DefaultProps<FourwingsClustersLayerProps> = {
  tilesUrl: HEATMAP_API_TILES_URL,
  maxZoom: FOURWINGS_MAX_ZOOM,
  clusterMaxZoomLevels: {
    default: MAX_ZOOM_TO_CLUSTER_POINTS,
  },
}

const GEOLOCATION_PRIORITY: FourwingsGeolocation[] = ['country', 'port', 'default']

const ICON_SIZE: Record<FourwingsClusterEventType, number> = {
  user: 16,
  encounter: 16,
  loitering: 16,
  gap: 14,
  port_visit: 12,
}
const MIN_CLUSTER_RADIUS = 12
const MAX_CLUSTER_RADIUS = 30
const ICON_MAPPING: Record<FourwingsClusterEventType, any> = {
  encounter: { x: 0, y: 0, width: 36, height: 36, mask: true },
  gap: { x: 40, y: 0, width: 36, height: 36, mask: true },
  user: { x: 40, y: 0, width: 36, height: 36, mask: true },
  port_visit: { x: 80, y: 0, width: 36, height: 36, mask: true },
  loitering: { x: 120, y: 0, width: 36, height: 36, mask: true },
}

const CLUSTER_LAYER_ID = 'clusters'
const POINTS_LAYER_ID = 'points'
const MAX_INDIVIDUAL_POINTS = 1000
const MAX_CLUSTER_EXPANSION_ZOOM = 20

export function getFourwingsGeolocation(
  clusterMaxZoomLevels: ClusterMaxZoomLevelConfig,
  zoom: number
) {
  let clusterMode: FourwingsGeolocation | undefined
  for (const geolocation of GEOLOCATION_PRIORITY) {
    if (
      clusterMaxZoomLevels?.[geolocation] !== undefined &&
      zoom <= clusterMaxZoomLevels[geolocation] + 0.5
    ) {
      clusterMode = geolocation
      break
    }
  }
  return clusterMode
}

export class FourwingsClustersLayer extends CompositeLayer<
  FourwingsClustersLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsClusterTileLayer'
  static defaultProps = defaultProps
  state!: FourwingsClustersTileLayerState

  get isLoaded(): boolean {
    return super.isLoaded && this.state.viewportLoaded
  }

  get clusterMode(): FourwingsClusterMode {
    const { clusterMaxZoomLevels } = this.props
    if (!clusterMaxZoomLevels) {
      return 'default'
    }
    const geolocation = getFourwingsGeolocation(clusterMaxZoomLevels, this.context.viewport.zoom)
    const clusterMode = geolocation || 'positions'
    return clusterMode
  }

  get interval(): FourwingsInterval {
    return getFourwingsInterval(this.props.startTime, this.props.endTime)
  }

  getError(): string {
    return this.state.error
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      error: '',
      data: [],
      viewportLoaded: false,
      currentClustersZoom: Math.round(context.viewport.zoom),
      clusterIndex: new Supercluster({
        radius: 70,
        maxZoom: 24,
        reduce: (accumulated, props) => {
          return (accumulated.value += props.value)
        },
      }),
    }
  }

  _isIndividualPoints = (data: FourwingsPointFeature[]) => {
    const { zoom } = this.context.viewport
    return this.clusterMode === 'positions'
      ? data.length < MAX_INDIVIDUAL_POINTS || zoom >= MAX_CLUSTER_EXPANSION_ZOOM - 1
      : false
  }

  updateState({ props, oldProps, context, changeFlags }: UpdateParameters<this>) {
    const { zoom } = context.viewport
    const { data, currentClustersZoom, clusters, clusterIndex } = this.state
    const zoomDiff =
      currentClustersZoom !== undefined ? Math.round(zoom) - Math.round(currentClustersZoom) : 0

    if (Math.abs(zoomDiff) >= 1 && data.length > 0) {
      if (this._isIndividualPoints(data)) {
        if (clusters !== undefined) {
          this.setState({
            points: data,
            clusters: undefined,
            radiusScale: undefined,
          })
        }
      } else if (clusterIndex !== undefined) {
        const { clusters, points, radiusScale } = this._getClustersByZoom(Math.round(zoom))
        this.setState({
          clusters: clusters,
          points: points,
          radiusScale: radiusScale,
          currentClustersZoom: Math.round(zoom),
        })
      }
    }

    super.updateState({ props, oldProps, context, changeFlags })
  }

  _onLayerError = (error: Error) => {
    console.warn(error.message)
    this.setState({ error: error.message })
    return true
  }

  getClusterId = (feature: FourwingsClusterFeature | undefined) => {
    return `${this.id}-${feature?.properties.id || (feature?.geometry?.coordinates || []).join('-')}`
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<FourwingsClusterFeature>
  }): FourwingsClusterPickingInfo => {
    let expansionZoom: number | undefined
    let expansionBounds: Bbox | undefined
    const { zoom } = this.context.viewport
    if ((this.state.clusterIndex as any)?.points?.length && info.object?.properties.cluster_id) {
      const points = this.state.clusterIndex.getLeaves(info.object?.properties.cluster_id, Infinity)
      const areAllPointsInSameCell =
        points?.length > 0 &&
        points[0]?.properties?.cellNum !== undefined &&
        points.every((p) => p.properties.cellNum === points[0].properties.cellNum)

      if (!areAllPointsInSameCell) {
        let newExpansionZoom = Math.min(
          this.state.clusterIndex.getClusterExpansionZoom(info.object?.properties.cluster_id),
          MAX_CLUSTER_EXPANSION_ZOOM
        )
        newExpansionZoom = newExpansionZoom > zoom ? newExpansionZoom : Math.round(zoom) + 0.5
        if (newExpansionZoom <= MAX_CLUSTER_EXPANSION_ZOOM) {
          expansionZoom = newExpansionZoom
        }
        if (points[0]?.properties?.cellBounds) {
          const bounds = points.reduce(
            (acc, point) => {
              return [
                Math.min(acc[0], point.properties.cellBounds?.[0]),
                Math.min(acc[1], point.properties.cellBounds?.[1]),
                Math.max(acc[2], point.properties.cellBounds?.[2]),
                Math.max(acc[3], point.properties.cellBounds?.[3]),
              ] as Bbox
            },
            [Infinity, Infinity, -Infinity, -Infinity] as Bbox
          )
          expansionBounds = bounds
        }
      }
    }
    const object = {
      ...(info.object || ({} as FourwingsClusterFeature)),
      id: this.getClusterId(info.object),
      ...(this.clusterMode === 'positions' &&
        info.object?.properties.id && {
          eventId: info.object?.properties.id,
        }),
      color: this.props.color,
      layerId: this.root.id,
      datasetId: this.props.datasetId,
      category: this.props.category,
      subcategory: this.props.subcategory,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      eventType: this.props.eventType,
      uniqueFeatureInteraction: false,
      groupFeatureInteraction: true,
      clusterMode: this.clusterMode,
      expansionZoom,
      expansionBounds,
    }
    return { ...info, object }
  }

  _getClustersByZoom = (zoom: number) => {
    if (!this.state.clusterIndex) {
      return { clusters: undefined, points: undefined, radiusScale: undefined }
    }
    const allClusters = this.state.clusterIndex.getClusters([-180, -85, 180, 85], Math.round(zoom))
    const clusters: FourwingsClusterFeature[] = []
    const points: FourwingsPointFeature[] = []

    if (allClusters.length) {
      allClusters.forEach((f) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        f.properties.value > 1
          ? clusters.push(f as FourwingsClusterFeature)
          : points.push(f as FourwingsPointFeature)
      })
    }

    const counts = clusters.map((cluster) => cluster.properties.value)
    const radiusScale = scaleSqrt()
      .domain([1, counts.length ? max(counts) : 1])
      .range([MIN_CLUSTER_RADIUS, MAX_CLUSTER_RADIUS])

    return { clusters, points, radiusScale }
  }

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    const { zoom } = this.context.viewport
    const data: FourwingsPointFeature[] = tiles.flatMap((tile) => {
      return this.clusterMode === 'positions'
        ? (tile.content || []).map((feature: FourwingsPointFeature) =>
            transformTileCoordsToWGS84(feature, tile.bbox as GeoBoundingBox, this.context.viewport)
          )
        : tile.content || []
    })
    if (this._isIndividualPoints(data)) {
      requestAnimationFrame(() => {
        this.setState({
          data,
          viewportLoaded: true,
          points: data,
          clusters: undefined,
          radiusScale: undefined,
        })
      })
    } else {
      this.state.clusterIndex.load(data)
      const currentClustersZoom = Math.round(zoom)
      const { clusters, points, radiusScale } = this._getClustersByZoom(currentClustersZoom)
      requestAnimationFrame(() => {
        this.setState({
          data,
          viewportLoaded: true,
          currentClustersZoom,
          clusters,
          points,
          radiusScale,
        })
      })
    }
  }

  _fetchClusters = async (
    url: string,
    {
      signal,
      tile,
    }: {
      signal?: AbortSignal
      tile: TileLoadProps
    }
  ) => {
    this.setState({ viewportLoaded: false })
    const cols: number[] = []
    const rows: number[] = []
    const scale: number[] = []
    const offset: number[] = []
    const noDataValue: number[] = []
    try {
      const response = await GFWAPI.fetch<any>(url, {
        signal,
        method: 'GET',
        responseType: 'default',
      })
      if (response.status >= 400 && response.status !== 404) {
        throw new Error(response.statusText || response.status)
      }
      if (response.headers.get('X-columns') && !cols[0]) {
        cols[0] = parseInt(response.headers.get('X-columns') as string)
      }
      if (response.headers.get('X-rows') && !rows[0]) {
        rows[0] = parseInt(response.headers.get('X-rows') as string)
      }
      if (response.headers.get('X-scale') && !scale[0]) {
        scale[0] = parseFloat(response.headers.get('X-scale') as string)
      }
      if (response.headers.get('X-offset') && !offset[0]) {
        offset[0] = parseInt(response.headers.get('X-offset') as string)
      }
      if (response.headers.get('X-empty-value') && !noDataValue[0]) {
        noDataValue[0] = parseInt(response.headers.get('X-empty-value') as string)
      }

      if (signal?.aborted) {
        return
      }
      const data = await response.arrayBuffer()
      if (data.byteLength === 0) {
        return
      }
      return await parse(data, FourwingsClustersLoader, {
        worker: true,
        fourwingsClusters: {
          cols,
          rows,
          scale,
          offset,
          tile,
          noDataValue,
          interval: this.interval,
          temporalAggregation: this.props.temporalAggregation,
        },
      })
    } catch (error: any) {
      throw new Error(error.statusText || error.status)
    }
  }

  _fetchPositions = async (
    url: string,
    {
      signal,
      loadOptions,
    }: {
      signal?: AbortSignal
      loadOptions?: any
    }
  ) => {
    this.setState({ viewportLoaded: false })
    try {
      const response = await GFWAPI.fetch<any>(url, {
        signal,
        method: 'GET',
        responseType: 'arrayBuffer',
      })
      return await parse(response, GFWMVTLoader, loadOptions)
    } catch (error: any) {
      if ((error as ParsedAPIError).status === 404) {
        return null
      }
      throw error
    }
  }

  _getTileData: TileLayerProps['getTileData'] = (tile) => {
    if (!tile.url || tile.signal?.aborted) {
      return null
    }
    let url = getURLFromTemplate(tile.url!, tile)
    if (this.clusterMode === 'positions') {
      url = url?.replace('{{type}}', 'position').concat(`&format=MVT`)
      return this._fetchPositions(url!, { signal: tile.signal })
    }
    url = url
      ?.replace('{{type}}', 'heatmap')
      .concat(`&format=4WINGS&interval=${this.interval}&geolocation=${this.clusterMode}`)
    if (this.props.temporalAggregation) {
      url = url?.concat(`&temporal-aggregation=true`)
    }
    return this._fetchClusters(url!, { signal: tile.signal, tile })
  }

  _getPosition = (d: FourwingsClusterFeature) => {
    return d.geometry.coordinates as [number, number]
  }

  _getRadius = (d: FourwingsClusterFeature) => {
    return this.state.radiusScale?.(d.properties.value) || MIN_CLUSTER_RADIUS
  }

  _getLineColor = (d: FourwingsClusterFeature) => {
    const isHighlighted = this.props.highlightedFeatures?.some(
      (feature) => feature.id === this.getClusterId(d)
    )
    return isHighlighted ? COLOR_HIGHLIGHT_LINE : DEFAULT_LINE_COLOR
  }

  _getColor = (d: FourwingsClusterFeature) => {
    const isHighlighted = this.props.highlightedFeatures?.some(
      (feature) => feature.id === this.getClusterId(d)
    )
    return isHighlighted ? COLOR_HIGHLIGHT_LINE : hexToDeckColor(this.props.color)
  }

  _getClusterLabel = (d: FourwingsClusterFeature) => {
    if (d.properties.value > 1000000) {
      return `>${Math.floor(d.properties.value / 1000000)}M`
    }
    if (d.properties.value > 1000) {
      return `>${Math.floor(d.properties.value / 1000)}k`
    }
    return d.properties.value.toString()
  }

  renderLayers(): Layer<Record<string, unknown>> | LayersList | null {
    const { color, tilesUrl, eventType = 'encounter', highlightedFeatures } = this.props
    const { clusters, points, radiusScale } = this.state

    return [
      new TileLayer<FourwingsPointFeature, any>(this.props, {
        id: `${this.props.id}-tiles`,
        data: tilesUrl,
        maxZoom: POSITIONS_VISUALIZATION_MAX_ZOOM,
        binary: false,
        loaders: [GFWMVTLoader],
        debounceTime: 200,
        onTileError: this._onLayerError,
        onViewportLoad: this._onViewportLoad,
        renderSubLayers: () => null,
        getTileData: this._getTileData,
      }),
      new IconLayer({
        id: `${this.props.id}-${POINTS_LAYER_ID}-icons`,
        data: points,
        getPosition: this._getPosition,
        getSize: ICON_SIZE[eventType],
        sizeUnits: 'pixels',
        iconAtlas: `${PATH_BASENAME}/events-color-sprite.png`,
        iconMapping: ICON_MAPPING,
        getIcon: () => eventType,
        getColor: this._getColor,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Cluster, params),
        pickable: true,
        updateTriggers: {
          getColor: [highlightedFeatures],
        },
      }),
      new ScatterplotLayer({
        id: `${this.props.id}-${CLUSTER_LAYER_ID}`,
        data: clusters,
        getPosition: this._getPosition,
        getRadius: this._getRadius,
        getFillColor: hexToDeckColor(color),
        radiusMinPixels: MIN_CLUSTER_RADIUS,
        radiusUnits: 'pixels',
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Cluster, params),
        getLineColor: this._getLineColor,
        stroked: true,
        lineWidthMinPixels: 0.5,
        lineWidthUnits: 'pixels',
        pickable: true,
        updateTriggers: {
          getRadius: [radiusScale],
          getLineColor: [highlightedFeatures],
        },
      }),
      new TextLayer({
        id: `${this.props.id}-${CLUSTER_LAYER_ID}-counts`,
        data: clusters,
        getText: this._getClusterLabel,
        getPosition: this._getPosition,
        getColor: DEFAULT_BACKGROUND_COLOR,
        getSize: 12,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Cluster, params),
        sizeUnits: 'pixels',
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
        // extensions: [new CollisionFilterExtension()],
        // collisionTestProps: { sizeScale: 1 },
        // getCollisionPriority: (d: any) => parseInt(d.properties.value || 1),
        // collisionGroup: 'text',
      }),
    ]
  }

  getData() {
    return this.state.data as FourwingsPointFeature[]
  }

  getViewportData() {
    const data = this.getData()
    const { viewport } = this.context
    const [west, north] = viewport.unproject([0, 0])
    const [east, south] = viewport.unproject([viewport.width, viewport.height])
    if (data?.length) {
      const dataFiltered = filterFeaturesByBounds({
        features: data as any,
        bounds: { north, south, west, east },
      })
      return dataFiltered as FourwingsPointFeature[]
    }
    return []
  }
}
