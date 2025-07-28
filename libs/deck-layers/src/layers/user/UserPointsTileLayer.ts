import type {
  Accessor,
  DefaultProps,
  Layer,
  LayerContext,
  Position,
  UpdateParameters,
} from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import type { GeoBoundingBox } from '@deck.gl/geo-layers/dist/tileset-2d'
import { ScatterplotLayer } from '@deck.gl/layers'
import type { ScalePower } from 'd3-scale'
import { scaleSqrt } from 'd3-scale'
import type { Feature, GeoJsonProperties, Point } from 'geojson'

import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import {
  COLOR_HIGHLIGHT_LINE,
  DEFAULT_LINE_COLOR,
  getFeatureInFilter,
  getFetchLoadOptions,
  getLayerGroupOffset,
  getMVTSublayerProps,
  GFWMVTLoader,
  hexToDeckColor,
  LayerGroup,
} from '../../utils'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'
import { filteredPositionsByViewport } from '../fourwings'

import type { UserLayerFeature, UserPointsLayerProps } from './user.types'
import { DEFAULT_USER_TILES_MAX_ZOOM } from './user.utils'
import type { UserBaseLayerState } from './UserBaseLayer'
import { UserBaseLayer } from './UserBaseLayer'

type _UserPointsLayerProps = TileLayerProps & UserPointsLayerProps

export const DEFAULT_POINT_RADIUS = 6
const defaultProps: DefaultProps<_UserPointsLayerProps> = {
  idProperty: 'gfw_id',
  pickable: true,
  valueProperties: [],
  maxRequests: 100,
  debounceTime: 500,
  minPointSize: 3,
  maxPointSize: 15,
  maxZoom: DEFAULT_USER_TILES_MAX_ZOOM,
}

type UserPointsLayerState = UserBaseLayerState & {
  error: string
  scale?: ScalePower<number, number, never>
}
export class UserPointsTileLayer<PropsT = Record<string, unknown>> extends UserBaseLayer<
  _UserPointsLayerProps & PropsT
> {
  static layerName = 'UserPointsTileLayer'
  static defaultProps = defaultProps
  state!: UserPointsLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    const {
      minPointSize = defaultProps.minPointSize,
      maxPointSize = defaultProps.maxPointSize,
      circleRadiusRange,
    } = this.props
    if (circleRadiusRange && circleRadiusRange?.length) {
      this.state = {
        error: '',
        scale: scaleSqrt(circleRadiusRange as [number, number], [
          minPointSize as number,
          maxPointSize as number,
        ]),
      }
    }
  }

  get isLoaded(): boolean {
    return super.isLoaded
  }

  get cacheHash(): string {
    const { startTime, endTime, filters = {} } = this.props
    const interval = startTime && endTime ? getFourwingsInterval(startTime, endTime) : ''
    const filtersHash = Object.values(filters).filter(Boolean).join('-')
    return `${interval}-${filtersHash}`
  }

  updateState({ props, oldProps }: UpdateParameters<this>) {
    const { minPointSize, maxPointSize, circleRadiusRange } = props

    const newPointRange =
      circleRadiusRange?.[0] !== oldProps.circleRadiusRange?.[0] ||
      circleRadiusRange?.[1] !== oldProps.circleRadiusRange?.[1]
    const newPointSize =
      minPointSize !== oldProps.minPointSize || maxPointSize !== oldProps.maxPointSize

    if (newPointRange || newPointSize) {
      if (circleRadiusRange?.length) {
        const scale = scaleSqrt(circleRadiusRange as [number, number], [
          minPointSize as number,
          maxPointSize as number,
        ])
        this.setState({ scale })
      } else if (this.state.scale) {
        this.setState({ scale: undefined })
      }
    }
  }

  _getPosition: Accessor<GeoJsonProperties, Position> = (d) => {
    return d?.geometry?.coordinates
  }

  _getZoomLevel = () => {
    const { zoom } = this.context.viewport
    return Math.floor(zoom)
  }

  _getPointRadiusByZoom = () => {
    const zoom = this._getZoomLevel()
    if (zoom < 2) {
      return 2
    } else if (zoom < DEFAULT_POINT_RADIUS) {
      return zoom
    }
    return DEFAULT_POINT_RADIUS
  }

  _getPointRadius: Accessor<GeoJsonProperties, number> = (d) => {
    const { staticPointRadius, circleRadiusProperty, circleRadiusRange, filters, filterOperators } =
      this.props
    if (!getFeatureInFilter(d, filters, filterOperators)) {
      return 0
    }
    if (staticPointRadius) {
      return staticPointRadius
    }
    const pointRadius = this._getPointRadiusByZoom()
    const { scale } = this.state
    const value = d?.properties?.[circleRadiusProperty!]
    if (!value) {
      return circleRadiusRange && scale ? scale(circleRadiusRange[0]) : pointRadius
    }
    if (circleRadiusRange && scale) {
      return scale(value)
    }
    return pointRadius
  }

  getLayer() {
    return this.getSubLayers()?.[0] as TileLayer<UserLayerFeature>
  }

  getError() {
    return this?.state.error
  }

  getData = (): Feature<Point>[] => {
    // TODO: implement filters here
    return (this.getLayer()?.state.tileset?.tiles || []).flatMap((tile) => {
      return tile.content
        ? tile.content.flatMap((feature: any) => {
            return feature
              ? (transformTileCoordsToWGS84(
                  feature,
                  tile.bbox as GeoBoundingBox,
                  this.context.viewport
                ) as Feature<Point>)
              : []
          })
        : []
    })
  }

  getViewportData = () => {
    return filteredPositionsByViewport(this.getData(), this.context.viewport)
  }

  _onLayerError = (error: Error) => {
    console.warn(error.message)
    this.setState({ error: error.message })
    return true
  }

  renderLayers() {
    const { layers, color, pickable, maxPointSize, maxZoom, filters } = this.props
    const zoom = this._getZoomLevel()
    const highlightedFeatures = this._getHighlightedFeatures()
    const filterProps = this._getTimeFilterProps()
    const renderLayers: Layer[] = layers.map((layer) => {
      return new TileLayer<TileLayerProps<UserLayerFeature>>({
        id: `${layer.id}-base-layer`,
        data: this._getTilesUrl(layer.tilesUrl),
        loaders: [GFWMVTLoader],
        maxZoom,
        loadOptions: {
          ...getFetchLoadOptions(),
        },
        onTileError: this._onLayerError,
        onViewportLoad: this.props.onViewportLoad,
        ...filterProps,
        renderSubLayers: (props) => {
          const mvtSublayerProps = {
            ...props,
            ...getMVTSublayerProps({ tile: props.tile, extensions: props.extensions }),
          }
          return [
            new ScatterplotLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-points`,
              pickable: pickable,
              radiusMinPixels: 0,
              radiusMaxPixels: maxPointSize,
              filled: true,
              stroked: true,
              radiusUnits: 'pixels',
              getPosition: this._getPosition,
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.Default, params),
              getRadius: this._getPointRadius,
              lineWidthUnits: 'pixels',
              lineWidthMinPixels: 1,
              getLineWidth: 1,
              getLineColor: DEFAULT_LINE_COLOR,
              getFillColor: hexToDeckColor(this.props.color, 0.7),
              updateTriggers: {
                getFillColor: [color],
                getRadius: [filters, zoom],
              },
            }),
          ]
        },
      })
    })
    if (highlightedFeatures?.length) {
      renderLayers.push(
        new ScatterplotLayer<GeoJsonProperties, { data: any }>(this.props, {
          id: `${this.props.id}-highlight-points`,
          pickable: false,
          data: highlightedFeatures,
          radiusMinPixels: 0,
          radiusMaxPixels: maxPointSize,
          filled: true,
          radiusUnits: 'pixels',
          getPosition: this._getPosition,
          getPolygonOffset: (params) =>
            getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
          getRadius: this._getPointRadius,
          getFillColor: COLOR_HIGHLIGHT_LINE,
        })
      )
    }
    return renderLayers
  }
}
