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
import type { ContextSublayerCallbackParams } from '../context/context.types'
import { filteredPositionsByViewport } from '../fourwings'

import type { UserLayerFeature, UserPointsLayerProps } from './user.types'
import type { IsFeatureInRangeParams } from './user.utils'
import { DEFAULT_USER_TILES_MAX_ZOOM, isFeatureInRange } from './user.utils'
import type { UserBaseLayerState } from './UserBaseLayer'
import { UserBaseLayer } from './UserBaseLayer'

type _UserPointsLayerProps = TileLayerProps & UserPointsLayerProps

export const DEFAULT_POINT_RADIUS = 6
const defaultProps: DefaultProps<_UserPointsLayerProps> = {
  pickable: true,
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
    const { startTime, endTime } = this.props
    const filters = this.props.layers?.[0]?.sublayers?.[0]?.filters || {}
    const filtersHash = Object.values(filters).filter(Boolean).join('-')
    return `${startTime}-${endTime}-${filtersHash}`
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

  _getPointRadius = (d: GeoJsonProperties, { layer, sublayer }: ContextSublayerCallbackParams) => {
    if (!layer || !sublayer) {
      console.warn('TODO: handle user points highlighted features')
      return 0
    }
    const { staticPointRadius, circleRadiusProperty, circleRadiusRange } = this.props
    // TODO: use filter extension instead
    if (!getFeatureInFilter(d, sublayer.filters, sublayer.filterOperators)) {
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
    // TODO: support multiple sublayers
    return this.getSubLayers()?.[0] as TileLayer<UserLayerFeature>
  }

  getError() {
    return this?.state.error
  }

  _getData = (): Feature<Point>[] => {
    const roundedZoom = Math.round(this.context.viewport.zoom)
    return (this.getLayer()?.state.tileset?.tiles || []).flatMap((tile) => {
      return tile.content && tile.zoom === roundedZoom
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

  getData = (): Feature<Point>[] => {
    // TODO: support multiple sublayers
    const data = this._getData().flatMap((feature) => {
      const values: number[] = []
      this.props.layers?.[0]?.sublayers?.forEach((sublayer) => {
        const matchesTimeFilter = isFeatureInRange(feature, this.props as IsFeatureInRangeParams)
        if (
          matchesTimeFilter &&
          sublayer.filters &&
          Object.keys(sublayer.filters).filter(Boolean).length
        ) {
          values.push(
            getFeatureInFilter(feature, sublayer.filters, sublayer.filterOperators) ? 1 : 0
          )
        }
      })
      if (values.every((value) => value === 0)) {
        return []
      }
      return {
        ...feature,
        properties: {
          ...feature.properties,
          values,
        },
      }
    })
    return data
  }

  getViewportData = () => {
    return filteredPositionsByViewport(this.getData(), this.context.viewport)
  }

  _onLayerError = (error: Error) => {
    if (!error.message.includes('404')) {
      this.setState({ error: error.message })
    }
    return true
  }

  renderLayers() {
    const { layers, pickable, maxPointSize, maxZoom } = this.props
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
          return layer.sublayers.map((sublayer) => [
            new ScatterplotLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-${sublayer.dataviewId}-points`,
              pickable: pickable,
              radiusMinPixels: 0,
              radiusMaxPixels: maxPointSize,
              filled: true,
              stroked: true,
              radiusUnits: 'pixels',
              getPosition: this._getPosition,
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.Default, params),
              getRadius: (d) => this._getPointRadius(d, { layer, sublayer }),
              lineWidthUnits: 'pixels',
              lineWidthMinPixels: 1,
              getLineWidth: 1,
              getLineColor: DEFAULT_LINE_COLOR,
              getFillColor: hexToDeckColor(sublayer.color, 0.7),
              updateTriggers: {
                getFillColor: [sublayer.color],
                getRadius: [sublayer.filters, zoom],
              },
            }),
          ])
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
