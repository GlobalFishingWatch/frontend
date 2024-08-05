import { parse } from '@loaders.gl/core'
import {
  CompositeLayer,
  Layer,
  LayerContext,
  LayersList,
  DefaultProps,
  UpdateParameters,
  PickingInfo,
} from '@deck.gl/core'
import { MVTLayer, MVTLayerProps, TileLayerProps } from '@deck.gl/geo-layers'
import { stringify } from 'qs'
import { GeoBoundingBox, Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { DateTime } from 'luxon'
import { Feature, Polygon } from 'geojson'
import { IconLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import Supercluster, { ClusterFeature, PointFeature } from 'supercluster'
import { ScalePower, scaleSqrt } from 'd3-scale'
import { max } from 'simple-statistics'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'
import { PATH_BASENAME } from '../../layers/layers.config'
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_LINE_COLOR,
  getLayerGroupOffset,
  getUTCDateTime,
  GFWMVTLoader,
  hexToDeckColor,
  LayerGroup,
} from '../../utils'
import { BaseFourwingsLayerProps, getISODateFromTS } from '../fourwings'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'
import {
  POSITIONS_API_TILES_URL,
  POSITIONS_VISUALIZATION_MAX_ZOOM,
} from '../../layers/fourwings/fourwings.config'
import { ClusterEventType } from './cluster.types'

type FourwingsClustersLayerProps = BaseFourwingsLayerProps & Partial<TileLayerProps>

type FourwingsClusterFeature = ClusterFeature<{ count: number }>
type FourwingsPointFeature = PointFeature<{}>

type FourwingsClustersTileLayerState = {
  viewportLoaded: boolean
  clusters?: FourwingsClusterFeature[]
  points?: FourwingsPointFeature[]
  radiusScale?: ScalePower<number, number>
}

const defaultProps: DefaultProps<FourwingsClustersLayerProps> = {
  tilesUrl: POSITIONS_API_TILES_URL,
}

const ICON_SIZE = 16
const MIN_CLUSTER_RADIUS = 12
const MAX_CLUSTER_RADIUS = 30
const ICON_MAPPING: Record<ClusterEventType, any> = {
  encounter: { x: 0, y: 0, width: 36, height: 36, mask: true },
  gap: { x: 40, y: 0, width: 36, height: 36, mask: true },
  port_visit: { x: 80, y: 0, width: 36, height: 36, mask: true },
}

export class FourwingsClusterLayer extends CompositeLayer<
  FourwingsClustersLayerProps & MVTLayerProps
> {
  static layerName = 'FourwingsPositionsTileLayer'
  static defaultProps = defaultProps
  state!: FourwingsClustersTileLayerState
  clusterIndex = new Supercluster({
    radius: 100,
    maxZoom: 8,
    reduce: (accumulated, props) => {
      accumulated.count += props.count
    },
  })

  get isLoaded(): boolean {
    return super.isLoaded && this.state.viewportLoaded
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      viewportLoaded: false,
    }
  }

  updateState({ props, oldProps, context }: UpdateParameters<this>) {}

  getPickingInfo = ({ info }: { info: PickingInfo<FourwingsPositionFeature> }) => {
    if (info.object?.properties.cluster) {
      // const clusterExpansionZoom = this.clusterIndex.getClusterExpansionZoom(
      //   info.object?.properties.cluster_id
      // )
      console.log('getPickingInfo:', info.object)
    } else {
      console.log('getPickingInfo:', info.object)
    }

    return info
  }

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    const { zoom } = this.context.viewport
    const data = tiles.flatMap((tile) => {
      return tile.content
        ? tile.content.map((feature: any) =>
            transformTileCoordsToWGS84(feature, tile.bbox as GeoBoundingBox, this.context.viewport)
          )
        : []
    }) as Feature<Polygon>[]
    const dataAsPoints = data.map((feature) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: feature.geometry.coordinates[0][0],
      },
      properties: feature.properties,
    })) as FourwingsPointFeature[]
    this.clusterIndex.load(dataAsPoints)
    const allClusters = this.clusterIndex.getClusters([-180, -85, 180, 85], Math.round(zoom))
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

  _fetch = async (
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
      throw error
    }
  }

  _getDataUrl() {
    const { startTime, endTime, sublayers, extentStart, extentEnd } = this.props

    const start = extentStart && extentStart > startTime ? extentStart : startTime
    const end =
      extentEnd && extentEnd < endTime
        ? DateTime.fromMillis(extentEnd).plus({ day: 1 }).toMillis()
        : endTime

    const startIso = getUTCDateTime(start < end ? start : end)
      .startOf('hour')
      .toISO()
    const endIso = getUTCDateTime(end).startOf('hour').toISO()
    const params = {
      datasets: sublayers.map((sublayer) => sublayer.datasets.join(',')),
      filters: sublayers.map((sublayer) => sublayer.filter),
      format: 'MVT',
      'temporal-aggregation': true,
      'date-range': `${startIso},${endIso}`,
    }

    const baseUrl = GFWAPI.generateUrl(this.props.tilesUrl as string, { absolute: true })

    return `${baseUrl}?${stringify(params)}`
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
    const { sublayers } = this.props
    const { clusters, points, radiusScale } = this.state
    return [
      new MVTLayer(this.props, {
        id: `${this.props.id}-tiles`,
        data: this._getDataUrl(),
        maxZoom: POSITIONS_VISUALIZATION_MAX_ZOOM,
        binary: false,
        loaders: [GFWMVTLoader],
        fetch: this._fetch,
        onViewportLoad: this._onViewportLoad,
        renderSubLayers: () => null,
      }),
      new ScatterplotLayer({
        id: `${this.props.id}-scatterplot`,
        data: clusters,
        getPosition: this._getPosition,
        getRadius: this._getRadius,
        getFillColor: hexToDeckColor(sublayers[0].color),
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
        getColor: hexToDeckColor(sublayers[0].color),
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

  getIsPositionsAvailable() {
    return true
  }

  getViewportData() {
    return []
  }
}
