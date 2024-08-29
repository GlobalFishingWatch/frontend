import { parse } from '@loaders.gl/core'
import {
  CompositeLayer,
  Layer,
  LayerContext,
  LayersList,
  DefaultProps,
  PickingInfo,
} from '@deck.gl/core'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { Tile2DHeader, TileLoadProps } from '@deck.gl/geo-layers/dist/tileset-2d'
import { IconLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import Supercluster from 'supercluster'
import { ScalePower, scaleSqrt } from 'd3-scale'
import { max } from 'simple-statistics'
import { GFWAPI } from '@globalfishingwatch/api-client'
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
import { HEATMAP_API_TILES_URL, POSITIONS_VISUALIZATION_MAX_ZOOM } from '../fourwings.config'
import { getURLFromTemplate } from '../heatmap/fourwings-heatmap.utils'
import {
  FourwingsClusterEventType,
  FourwingsClusterFeature,
  FourwingsClusterPickingInfo,
  FourwingsClustersLayerProps,
  FourwingsPointFeature,
} from './fourwings-clusters.types'

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

const ICON_SIZE = 16
const MIN_CLUSTER_RADIUS = 12
const MAX_CLUSTER_RADIUS = 30
const ICON_MAPPING: Record<FourwingsClusterEventType, any> = {
  encounter: { x: 0, y: 0, width: 36, height: 36, mask: true },
  gap: { x: 40, y: 0, width: 36, height: 36, mask: true },
  port_visit: { x: 80, y: 0, width: 36, height: 36, mask: true },
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

  getError(): string {
    return this.state.error
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      error: '',
      viewportLoaded: false,
      clusterIndex: new Supercluster({
        radius: 100,
        maxZoom: 8,
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
      color: this.props.color,
      layerId: this.root.id,
      datasetId: this.props.datasetId,
      category: this.props.category,
      subcategory: this.props.subcategory,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      expansionZoom,
    }
    return { ...info, object }
  }

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    const { zoom } = this.context.viewport
    const data = tiles.flatMap((tile) => {
      return tile.content || []
    }) as FourwingsPointFeature[]
    this.state.clusterIndex.load(data)
    const allClusters = this.state.clusterIndex.getClusters([-180, -85, 180, 85], Math.round(zoom))
    let clusters: FourwingsClusterFeature[] = []
    let points: FourwingsPointFeature[] = []
    if (allClusters.length) {
      allClusters.forEach((f) => {
        f.properties.count > 2
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

  _fetch = async (
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

      return await parse(response.arrayBuffer(), FourwingsClustersLoader, {
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

  _getTileData: TileLayerProps['getTileData'] = (tile) => {
    if (tile.signal?.aborted) {
      return null
    }
    const url = getURLFromTemplate(tile.url!, tile)
    return this._fetch(url!, { signal: tile.signal, tile })
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

  renderLayers(): Layer<{}> | LayersList | null {
    const { color, tilesUrl } = this.props
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
      new ScatterplotLayer({
        id: `${this.props.id}-scatterplot`,
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
      new IconLayer({
        id: `${this.props.id}-icons`,
        data: points,
        getPosition: this._getPosition,
        getColor: hexToDeckColor(color),
        getSize: ICON_SIZE,
        sizeUnits: 'pixels',
        iconAtlas: `${PATH_BASENAME}/events-sprite.png`,
        iconMapping: ICON_MAPPING,
        //TODO remove fixed value
        // getIcon: () => this.props.eventType
        getIcon: () => 'encounter',
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Cluster, params),
        pickable: true,
      }),
      new TextLayer({
        id: `${this.props.id}-counts`,
        data: clusters,
        getText: this._getClusterLabel,
        getPosition: this._getPosition,
        getColor: DEFAULT_BACKGROUND_COLOR,
        getSize: 12,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Label, params),
        sizeUnits: 'pixels',
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
      }),
    ]
  }

  getViewportData() {
    return []
  }
}
