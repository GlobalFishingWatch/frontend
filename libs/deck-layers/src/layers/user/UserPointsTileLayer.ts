import type {
  Accessor,
  DefaultProps,
  Layer,
  LayerContext,
  Position,
  UpdateParameters,
} from '@deck.gl/core'
import type { GeoBoundingBox, TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { ScatterplotLayer } from '@deck.gl/layers'
import type { ScalePower } from 'd3-scale'
import { scaleSqrt } from 'd3-scale'
import type { Feature, GeoJsonProperties, Point } from 'geojson'

import { isFeatureInFilters } from '@globalfishingwatch/deck-loaders'

import {
  COLOR_HIGHLIGHT_LINE,
  DEFAULT_LINE_COLOR,
  getFetchLoadOptions,
  getLayerGroupOffset,
  getMVTSublayerProps,
  GFWMVTLoader,
  hexToDeckColor,
  LayerGroup,
} from '../../utils'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'
import type { ContextSublayerCallbackParams } from '../context/context.types'
import {
  getContextFiltersHash,
  hasSublayerFilters,
  supportDataFilterExtension,
} from '../context/context.utils'
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

type GetUserPointsDataParams = {
  skipTemporalFilter?: boolean
  includeNonTemporalFeatures?: boolean
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
        ...this.state,
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

  get filtersHash(): string {
    const filters =
      this.props.layers?.flatMap((layer) =>
        layer.sublayers.flatMap((sublayer) => sublayer.filters || {})
      ) || {}
    return filters.length > 0
      ? filters.reduce((acc, filter) => `${acc}-${getContextFiltersHash(filter)}`, '')
      : ''
  }

  get aggregatedPropertyHash(): string {
    const aggregatedProperty =
      this.props.layers?.flatMap((layer) =>
        layer.sublayers.flatMap((sublayer) => sublayer.aggregateByProperty || [])
      ) || []
    return aggregatedProperty.length > 0
      ? aggregatedProperty.reduce((acc, property) => `${acc}-${property}`, '')
      : ''
  }

  get cacheHash(): string {
    const { id, startTime, endTime } = this.props
    return `${id}-${startTime}-${endTime}${this.filtersHash}${this.aggregatedPropertyHash}`
  }

  get debounceTime(): number {
    return this.props.debounceTime || 0
  }

  forceUpdate = () => {
    this.setNeedsUpdate?.()
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

  _getPointRadiusValue = (d: GeoJsonProperties) => {
    const { staticPointRadius, circleRadiusProperty, circleRadiusRange } = this.props

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

  _getPointRadius = (d: GeoJsonProperties, { sublayer }: ContextSublayerCallbackParams) => {
    if (
      hasSublayerFilters(sublayer) &&
      !supportDataFilterExtension(sublayer, this._getTimeFilterProps()) &&
      !isFeatureInFilters(d, sublayer.filters, sublayer.filterOperators)
    ) {
      return 0
    }
    return this._getPointRadiusValue(d)
  }

  getLayer() {
    // TODO: support multiple sublayers
    return this.getSubLayers()?.[0] as TileLayer<UserLayerFeature>
  }

  getError() {
    return this?.state.error
  }

  _getData = (): Feature<Point>[] => {
    // Use Math.round() to match deck.gl's tile zoom selection logic
    const roundedZoom = Math.round(this.context.viewport.zoom)
    const zoom =
      roundedZoom > DEFAULT_USER_TILES_MAX_ZOOM ? DEFAULT_USER_TILES_MAX_ZOOM : roundedZoom
    return (this.getLayer()?.state.tileset?.tiles || []).flatMap((tile) => {
      return tile.content && tile.zoom === zoom
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
  getData = ({
    skipTemporalFilter = false,
    includeNonTemporalFeatures = false,
  }: GetUserPointsDataParams = {}): Feature<Point>[] => {
    const data = this._getData().flatMap((feature) => {
      const values = new Array(this.props.layers?.[0]?.sublayers?.length).fill(0)
      this.props.layers?.[0]?.sublayers?.forEach((sublayer, index) => {
        const { aggregateByProperty } = sublayer
        const matchesTimeFilter = skipTemporalFilter
          ? true
          : isFeatureInRange(feature, this.props as IsFeatureInRangeParams)
        if (includeNonTemporalFeatures || matchesTimeFilter) {
          const matchesFilters = hasSublayerFilters(sublayer)
            ? isFeatureInFilters(feature, sublayer.filters, sublayer.filterOperators)
            : true

          values[index] =
            matchesFilters && matchesTimeFilter
              ? aggregateByProperty
                ? Number(feature.properties?.[aggregateByProperty] ?? 0)
                : 1
              : 0
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

  getViewportData = (params: GetUserPointsDataParams = {}) => {
    return filteredPositionsByViewport(this.getData(params), this.context.viewport)
  }

  getColor() {
    return this.props.layers?.[0]?.sublayers?.[0]?.color
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
        onViewportLoad: this.onViewportLoad,
        renderSubLayers: (props) => {
          const mvtSublayerProps = {
            ...props,
            ...getMVTSublayerProps({ tile: props.tile, extensions: props.extensions }),
          }
          return layer.sublayers.map((sublayer) => {
            const filtersHash = getContextFiltersHash(sublayer.filters)
            const { extensionFilterProps, updateTrigger } = this._getExtensionFilterProps(sublayer)
            return [
              new ScatterplotLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                id: `${props.id}-${sublayer.dataviewId}-points`,
                pickable: pickable,
                radiusMinPixels: 0,
                radiusMaxPixels: maxPointSize,
                filled: true,
                stroked: true,
                radiusUnits: 'pixels',
                getPosition: this._getPosition,
                ...extensionFilterProps,
                getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.Default, params),
                getRadius: (d) => this._getPointRadius(d, { layer, sublayer }),
                lineWidthUnits: 'pixels',
                lineWidthMinPixels: 1,
                getLineWidth: 1,
                getLineColor: DEFAULT_LINE_COLOR,
                getFillColor: hexToDeckColor(sublayer.color, 0.7),
                updateTriggers: {
                  getFillColor: [sublayer.color],
                  getRadius: [filtersHash, zoom],
                  ...updateTrigger,
                },
              }),
            ]
          })
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
          getRadius: this._getPointRadiusValue,
          getFillColor: COLOR_HIGHLIGHT_LINE,
        })
      )
    }
    return renderLayers
  }
}
