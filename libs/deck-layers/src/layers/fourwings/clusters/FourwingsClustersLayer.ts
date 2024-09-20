import { parse } from '@loaders.gl/core'
import {
  CompositeLayer,
  Layer,
  LayerContext,
  LayersList,
  DefaultProps,
  PickingInfo,
  FilterContext,
} from '@deck.gl/core'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
// import { CollisionFilterExtension } from '@deck.gl/extensions'
import { GeoBoundingBox, Tile2DHeader, TileLoadProps } from '@deck.gl/geo-layers/dist/tileset-2d'
import { IconLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import Supercluster from 'supercluster'
import { ScalePower, scaleSqrt } from 'd3-scale'
import { max } from 'simple-statistics'
import { GFWAPI, ParsedAPIError } from '@globalfishingwatch/api-client'
import { FourwingsClustersLoader } from '@globalfishingwatch/deck-loaders'
import { PATH_BASENAME } from '../../layers.config'
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_LINE_COLOR,
  getLayerGroupOffset,
  GFWMVTLoader,
  hexToDeckColor,
  LayerGroup,
} from '../../../utils'
import {
  HEATMAP_API_TILES_URL,
  MAX_ZOOM_TO_CLUSTER_POINTS,
  POSITIONS_VISUALIZATION_MAX_ZOOM,
} from '../fourwings.config'
import { getURLFromTemplate } from '../heatmap/fourwings-heatmap.utils'
import { transformTileCoordsToWGS84 } from '../../../utils/coordinates'
import {
  FourwingsClusterEventType,
  FourwingsClusterFeature,
  FourwingsClusterPickingInfo,
  FourwingsClustersLayerProps,
  FourwingsPointFeature,
} from './fourwings-clusters.types'

type ClusterMode = 'positions' | 'country' | 'proximity'

type FourwingsClustersTileLayerState = {
  error: string
  clusterIndex: Supercluster
  viewportLoaded: boolean
  clusters?: FourwingsClusterFeature[]
  points?: FourwingsPointFeature[]
  radiusScale?: ScalePower<number, number>
}

const defaultProps: DefaultProps<FourwingsClustersLayerProps> = {
  tilesUrl: HEATMAP_API_TILES_URL,
}

const ICON_SIZE: Record<FourwingsClusterEventType, number> = {
  encounter: 16,
  loitering: 16,
  gap: 14,
  port_visit: 12,
}
const MIN_CLUSTER_RADIUS = 12
const MAX_CLUSTER_RADIUS = 30
const ICON_MAPPING: Record<FourwingsClusterEventType, any> = {
  encounter: { x: 0, y: 0, width: 36, height: 36 },
  gap: { x: 40, y: 0, width: 36, height: 36, mask: true },
  port_visit: { x: 80, y: 0, width: 36, height: 36 },
  loitering: { x: 120, y: 0, width: 36, height: 36 },
}

const CLUSTER_LAYER_ID = 'clusters'
const POINTS_LAYER_ID = 'points'

export class FourwingsClustersLayer extends CompositeLayer<
  FourwingsClustersLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsClusterTileLayer'
  static defaultProps = defaultProps
  state!: FourwingsClustersTileLayerState

  get isLoaded(): boolean {
    return super.isLoaded && this.state.viewportLoaded
  }

  get clusterMode(): ClusterMode {
    if (
      this.props.maxCountryClusterZoom !== undefined &&
      this.context.viewport.zoom <= this.props.maxCountryClusterZoom + 0.5
    ) {
      console.log('country')

      return 'country'
    }
    if (
      this.props.maxProximityClusterZoom !== undefined &&
      this.context.viewport.zoom <=
        (this.props.maxProximityClusterZoom || MAX_ZOOM_TO_CLUSTER_POINTS) + 0.5
    ) {
      console.log('proximity')
      return 'proximity'
    }
    console.log('positions')
    return 'positions'
  }

  getError(): string {
    return this.state.error
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      error: '',
      viewportLoaded: false,
      clusterIndex: new Supercluster({
        radius: 70,
        maxZoom: Math.floor(this.props.maxProximityClusterZoom || MAX_ZOOM_TO_CLUSTER_POINTS),
        reduce: (accumulated, props) => {
          accumulated.count += props.count
        },
      }),
    }
  }

  // updateState({ props, oldProps, context }: UpdateParameters<this>) { }

  _onLayerError = (error: Error) => {
    console.warn(error.message)
    this.setState({ error: error.message })
    return true
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<FourwingsClusterFeature>
  }): FourwingsClusterPickingInfo => {
    let expansionZoom: number | undefined
    if ((this.state.clusterIndex as any)?.points?.length && info.object?.properties.cluster_id) {
      expansionZoom = this.state.clusterIndex.getClusterExpansionZoom(
        info.object?.properties.cluster_id
      )
    }
    const object = {
      ...(info.object || ({} as FourwingsClusterFeature)),
      id: info.object?.properties.id || `${(info.object?.geometry?.coordinates || []).join('-')}`,
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
      uniqueFeatureInteraction: true,
      expansionZoom,
    }
    return { ...info, object }
  }

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    const { zoom } = this.context.viewport
    if (this.clusterMode === 'positions') {
      const points = tiles.flatMap((tile) => {
        return tile.content
          ? tile.content.map((feature: any) =>
              transformTileCoordsToWGS84(
                feature,
                tile.bbox as GeoBoundingBox,
                this.context.viewport
              )
            )
          : []
      }) as FourwingsPointFeature[]
      requestAnimationFrame(() => {
        this.setState({
          viewportLoaded: true,
          points,
          clusters: undefined,
          radiusScale: undefined,
        } as FourwingsClustersTileLayerState)
      })
    } else {
      const data = tiles.flatMap((tile) => {
        return tile.content || []
      }) as FourwingsPointFeature[]

      this.state.clusterIndex.load(data)
      const allClusters = this.state.clusterIndex.getClusters(
        [-180, -85, 180, 85],
        Math.round(zoom)
      )
      let clusters: FourwingsClusterFeature[] = []
      let points: FourwingsPointFeature[] = []
      if (allClusters.length) {
        allClusters.forEach((f) => {
          f.properties.count > 1
            ? clusters.push(f as FourwingsClusterFeature)
            : points.push(f as FourwingsPointFeature)
        })
      }

      const counts = clusters.map((cluster) => cluster.properties.count)
      const radiusScale = scaleSqrt()
        .domain([1, counts.length ? max(counts) : 1])
        .range([MIN_CLUSTER_RADIUS, MAX_CLUSTER_RADIUS])
      requestAnimationFrame(() => {
        this.setState({
          viewportLoaded: true,
          clusters,
          points,
          radiusScale,
        } as FourwingsClustersTileLayerState)
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
    let cols: number = 0
    let rows: number = 0
    let scale: number = 0
    let offset: number = 0
    try {
      const response = await GFWAPI.fetch<any>(url, {
        signal,
        method: 'GET',
        responseType: 'default',
      })
      if (response.status >= 400 && response.status !== 404) {
        throw new Error(response.statusText || response.status)
      }
      if (response.headers.get('X-columns') && !cols) {
        cols = parseInt(response.headers.get('X-columns') as string)
      }
      if (response.headers.get('X-rows') && !rows) {
        rows = parseInt(response.headers.get('X-rows') as string)
      }
      if (response.headers.get('X-scale') && !scale) {
        scale = parseFloat(response.headers.get('X-scale') as string)
      }
      if (response.headers.get('X-offset') && !offset) {
        offset = parseInt(response.headers.get('X-offset') as string)
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
    if (this.isInPositionsMode) {
      url = url?.replace('{{type}}', 'position').concat(`&format=MVT`)
      return this._fetchPositions(url!, { signal: tile.signal })
    }
    // this.clusterMode === 'positions'
    url = url?.replace('{{type}}', 'position').concat(`&format=MVT`)
    return this._fetchPositions(url!, { signal: tile.signal })
  }

  _getPosition = (d: FourwingsClusterFeature) => {
    return d.geometry.coordinates as [number, number]
  }

  _getRadius = (d: FourwingsClusterFeature) => {
    return this.state.radiusScale?.(d.properties.count) || MIN_CLUSTER_RADIUS
  }

  _getClusterLabel = (d: FourwingsClusterFeature) => {
    if (d.properties.count > 1000000) {
      return `>${Math.floor(d.properties.count / 1000000)}M`
    }
    if (d.properties.count > 1000) {
      return `>${Math.floor(d.properties.count / 1000)}k`
    }
    return d.properties.count.toString()
  }

  filterSubLayer({ layer }: FilterContext) {
    if (this.clusterMode === 'positions') {
      return !layer.id.includes(CLUSTER_LAYER_ID)
    } else {
      return true
    }
  }

  renderLayers(): Layer<{}> | LayersList | null {
    const { color, tilesUrl, icon = 'encounter' } = this.props
    const { clusters, points, radiusScale } = this.state
    return [
      new TileLayer<FourwingsPointFeature, any>(this.props, {
        id: `${this.props.id}-tiles`,
        data: tilesUrl,
        maxZoom: POSITIONS_VISUALIZATION_MAX_ZOOM,
        binary: false,
        loaders: [GFWMVTLoader],
        onTileError: this._onLayerError,
        onViewportLoad: this._onViewportLoad,
        renderSubLayers: () => null,
        getTileData: this._getTileData,
      }),
      new IconLayer({
        id: `${this.props.id}-${POINTS_LAYER_ID}-icons`,
        data: points,
        getPosition: this._getPosition,
        getSize: ICON_SIZE[icon],
        sizeUnits: 'pixels',
        iconAtlas: `${PATH_BASENAME}/events-color-sprite.png`,
        iconMapping: ICON_MAPPING,
        getIcon: () => icon,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Cluster, params),
        pickable: true,
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
        stroked: true,
        getLineColor: DEFAULT_LINE_COLOR,
        lineWidthMinPixels: 1,
        pickable: true,
        updateTriggers: {
          getRadius: [radiusScale],
        },
      }),
      new TextLayer({
        id: `${this.props.id}-${CLUSTER_LAYER_ID}-counts`,
        data: clusters,
        getText: this._getClusterLabel,
        getPosition: this._getPosition,
        getColor: DEFAULT_BACKGROUND_COLOR,
        getSize: 12,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Label, params),
        sizeUnits: 'pixels',
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
        // extensions: [new CollisionFilterExtension()],
        // collisionTestProps: { sizeScale: 1 },
        // getCollisionPriority: (d: any) => parseInt(d.properties.count || 1),
        collisionGroup: 'text',
      }),
    ]
  }

  getViewportData() {
    return []
  }
}
