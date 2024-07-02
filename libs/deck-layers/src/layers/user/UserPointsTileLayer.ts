import {
  DefaultProps,
  UpdateParameters,
  LayerContext,
  Layer,
  Accessor,
  Position,
} from '@deck.gl/core'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { ScatterplotLayer } from '@deck.gl/layers'
import { GeoJsonProperties } from 'geojson'
import { ScalePower, scaleSqrt } from 'd3-scale'
import {
  COLOR_HIGHLIGHT_LINE,
  hexToDeckColor,
  LayerGroup,
  getLayerGroupOffset,
  GFWMVTLoader,
  getMVTSublayerProps,
  DEFAULT_LINE_COLOR,
  getFetchLoadOptions,
} from '../../utils'
import { UserPointsLayerProps, UserLayerFeature } from './user.types'
import { UserBaseLayer, UserBaseLayerState } from './UserBaseLayer'
import { DEFAULT_USER_TILES_MAX_ZOOM } from './user.utils'

type _UserPointsLayerProps = TileLayerProps & UserPointsLayerProps

export const DEFAULT_POINT_RADIUS = 4
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
  scale?: ScalePower<number, number, never>
}
export class UserPointsTileLayer<PropsT = {}> extends UserBaseLayer<
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
        scale: scaleSqrt(circleRadiusRange as [number, number], [
          minPointSize as number,
          maxPointSize as number,
        ]),
      }
    }
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

  _getPointRadius: Accessor<GeoJsonProperties, number> = (d) => {
    const { staticPointRadius, circleRadiusProperty, circleRadiusRange } = this.props
    if (staticPointRadius) {
      return staticPointRadius
    }
    const { scale } = this.state
    const value = d?.properties?.[circleRadiusProperty!]
    if (!value) {
      return circleRadiusRange && scale ? scale(circleRadiusRange[0]) : DEFAULT_POINT_RADIUS
    }
    if (circleRadiusRange && scale) {
      return scale(value)
    }
    return DEFAULT_POINT_RADIUS
  }

  renderLayers() {
    const { layers, color, pickable, maxPointSize, maxZoom } = this.props
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
