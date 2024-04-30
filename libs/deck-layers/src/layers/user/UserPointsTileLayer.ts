import {
  Color,
  DefaultProps,
  AccessorFunction,
  UpdateParameters,
  LayerContext,
} from '@deck.gl/core'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { ScaleLinear, scaleLinear } from 'd3-scale'
import {
  COLOR_HIGHLIGHT_LINE,
  hexToDeckColor,
  LayerGroup,
  getLayerGroupOffset,
  getPickedFeatureToHighlight,
  GFWMVTLoader,
  getMVTSublayerProps,
} from '../../utils'
import { UserPointsLayerProps, UserContextFeature } from './user.types'
import { getTilesUrl, getTimeFilterProps } from './user.utils'
import { UserTileLayer } from './UserTileLayer'

type _UserPointsLayerProps = TileLayerProps & UserPointsLayerProps

export const POINT_SIZES_DEFAULT_RANGE = [3, 15]
const defaultProps: DefaultProps<_UserPointsLayerProps> = {
  idProperty: 'gfw_id',
  pickable: true,
  valueProperties: [],
  maxRequests: 100,
  debounceTime: 500,
  minPointSize: 3,
  maxPointSize: 15,
  circleRadiusRange: POINT_SIZES_DEFAULT_RANGE,
}

type UserPointsLayerState = {
  scale: ScaleLinear<number, number, never>
}
export class UserPointsTileLayer<PropsT = {}> extends UserTileLayer<
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
      circleRadiusRange = POINT_SIZES_DEFAULT_RANGE,
    } = this.props
    this.state = {
      scale: scaleLinear(circleRadiusRange as [number, number], [
        minPointSize as number,
        maxPointSize as number,
      ]),
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
      const scale = scaleLinear(circleRadiusRange as [number, number], [
        minPointSize as number,
        maxPointSize as number,
      ])
      this.setState({ scale })
    }
  }

  _getFillColor: AccessorFunction<Feature<Geometry, GeoJsonProperties>, Color> = (d) => {
    const { highlightedFeatures = [], idProperty, color } = this.props
    return getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!)
      ? COLOR_HIGHLIGHT_LINE
      : hexToDeckColor(color)
  }

  _getPointRadius: AccessorFunction<Feature<Geometry, GeoJsonProperties>, number> = (d): number => {
    const { scale } = this.state
    const { circleRadiusProperty, circleRadiusRange } = this.props
    const value = d?.properties?.[circleRadiusProperty!]
    if (!value) {
      return 0
    }
    if (circleRadiusRange && scale) {
      return scale(value)
    }
    return 1
  }

  renderLayers() {
    const { highlightedFeatures, layers, color, pickable, maxPointSize } = this.props
    const filterProps = getTimeFilterProps(this.props)
    return layers.map((layer) => {
      return new TileLayer<TileLayerProps<UserContextFeature>>({
        id: `${layer.id}-base-layer`,
        data: getTilesUrl(layer.tilesUrl, this.props),
        loaders: [GFWMVTLoader],
        onViewportLoad: this.props.onViewportLoad,
        ...filterProps,
        renderSubLayers: (props) => {
          const mvtSublayerProps = {
            ...props,
            ...getMVTSublayerProps({ tile: props.tile, extensions: props.extensions }),
          }
          return [
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-points`,
              pickable: pickable,
              pointRadiusMinPixels: 0,
              pointRadiusMaxPixels: maxPointSize,
              filled: true,
              pointType: 'circle',
              pointRadiusUnits: 'pixels',
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.Default, params),
              getPointRadius: this._getPointRadius,
              getLineColor: this._getFillColor,
              getFillColor: this._getFillColor,
              updateTriggers: {
                getFillColor: [color, highlightedFeatures],
              },
            }),
          ]
        },
      })
    })
  }
}
