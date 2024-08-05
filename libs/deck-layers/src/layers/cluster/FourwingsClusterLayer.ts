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
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import Supercluster, { ClusterFeature, PointFeature } from 'supercluster'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'
import { getLayerGroupOffset, GFWMVTLoader, LayerGroup } from '../../utils'
import { BaseFourwingsLayerProps, getISODateFromTS } from '../fourwings'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'
import {
  POSITIONS_API_TILES_URL,
  POSITIONS_VISUALIZATION_MAX_ZOOM,
} from '../../layers/fourwings/fourwings.config'

type FourwingsClustersLayerProps = BaseFourwingsLayerProps & Partial<TileLayerProps>

type FourwingsClustersTileLayerState = {
  viewportLoaded: boolean
  clusters?: ClusterFeature<{}>[]
}

const defaultProps: DefaultProps<FourwingsClustersLayerProps> = {
  tilesUrl: POSITIONS_API_TILES_URL,
}

export class FourwingsClusterLayer extends CompositeLayer<
  FourwingsClustersLayerProps & MVTLayerProps
> {
  static layerName = 'FourwingsPositionsTileLayer'
  static defaultProps = defaultProps
  state!: FourwingsClustersTileLayerState

  get isLoaded(): boolean {
    return super.isLoaded
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      viewportLoaded: false,
    }
  }

  updateState({ props, oldProps, context }: UpdateParameters<this>) {}

  getPickingInfo = ({ info }: { info: PickingInfo<FourwingsPositionFeature> }) => {
    return info
  }

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    const { zoom } = this.context.viewport
    console.log('this.context.viewport:', this.context.viewport)
    const data = tiles.flatMap((tile) => {
      return tile.content
        ? tile.content.map((feature: any) =>
            transformTileCoordsToWGS84(feature, tile.bbox as GeoBoundingBox, this.context.viewport)
          )
        : []
    }) as Feature<Polygon>[]
    const points = data.map((feature) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: feature.geometry.coordinates[0][0],
      },
      properties: feature.properties,
    })) as PointFeature<{}>[]
    const index = new Supercluster({ radius: 100, maxZoom: 4 })
    index.load(points)
    const clusters = index.getClusters([-180, -85, 180, 85], Math.round(zoom))

    requestAnimationFrame(() => {
      this.setState({
        viewportLoaded: true,
        clusters,
      } as FourwingsClustersTileLayerState)
    })
  }

  _fetch = async (
    url: string,
    {
      signal,
      layer,
      loadOptions,
    }: {
      layer: Layer
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

    const params = {
      datasets: sublayers.map((sublayer) => sublayer.datasets.join(',')),
      filters: sublayers.map((sublayer) => sublayer.filter),
      format: 'MVT',
      'temporal-aggregation': true,
      'date-range': `${getISODateFromTS(start < end ? start : end)},${getISODateFromTS(end)}`,
    }

    const baseUrl = GFWAPI.generateUrl(this.props.tilesUrl as string, { absolute: true })

    return `${baseUrl}?${stringify(params)}`
  }

  _getRadius(d: ClusterFeature<{}>) {
    return 8 + Math.sqrt(d.properties.point_count) * 2
  }

  renderLayers(): Layer<{}> | LayersList | null {
    const { clusters } = this.state
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
        getPosition: (d) => d.geometry.coordinates,
        getRadius: (d) => this._getRadius(d),
        getFillColor: [255, 255, 255, 255],
        radiusMinPixels: 8,
        radiusUnits: 'pixels',
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Cluster, params),
        getLineWidth: 1,
        pickable: true,
      }),
      new TextLayer({
        id: `${this.props.id}-counts`,
        data: clusters,
        getText: (d) => d.properties.point_count?.toString(),
        getPosition: (d) => d.geometry.coordinates,
        getColor: [22, 63, 137],
        getSize: 14,
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
