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
  COLOR_HIGHLIGHT_FILL,
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  hexToDeckColor,
  LayerGroup,
  getLayerGroupOffset,
  getPickedFeatureToHighlight,
  GFWMVTLoader,
  getMVTSublayerProps,
  rgbaStringToComponents,
  getColorRampByOpacitySteps,
} from '../../utils'
import { UserPolygonsLayerProps, UserLayerFeature } from './user.types'
import { UserTileLayer } from './UserTileLayer'

type _UserContextLayerProps = TileLayerProps & UserPolygonsLayerProps

const defaultProps: DefaultProps<_UserContextLayerProps> = {
  idProperty: 'gfw_id',
  valueProperties: [],
  maxRequests: 100,
  debounceTime: 500,
}

type UserContextLayerState = {
  scale: ScaleLinear<string, string, never>
}

export class UserContextTileLayer<PropsT = {}> extends UserTileLayer<
  _UserContextLayerProps & PropsT
> {
  static layerName = 'UserContextTileLayer'
  static defaultProps = defaultProps
  state!: UserContextLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    const colorRange = getColorRampByOpacitySteps(this.props.color)
    if (this.props.steps && this.props.steps?.length > 0 && colorRange) {
      this.state = {
        scale: scaleLinear(this.props.steps as number[], colorRange).clamp(true),
      }
    }
  }

  updateState({ props, oldProps }: UpdateParameters<this>) {
    const { steps, color } = props
    const newColor = color !== oldProps.color
    const newSteps = steps !== oldProps.steps

    if (newColor || newSteps) {
      if (steps && steps.length > 0) {
        const colorRange = getColorRampByOpacitySteps(this.props.color)
        const scale = scaleLinear(steps as number[], colorRange)
        this.setState({ scale })
      } else {
        this.setState({ scale: undefined })
      }
    }
  }

  _getHighlightLineWidth: AccessorFunction<Feature<Geometry, GeoJsonProperties>, number> = (d) => {
    const { highlightedFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!) ? 1 : 0
  }

  _getFillColor: AccessorFunction<Feature<Geometry, GeoJsonProperties>, Color> = (d) => {
    const { highlightedFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!)
      ? COLOR_HIGHLIGHT_FILL
      : COLOR_TRANSPARENT
  }

  _getFillStepsColor: AccessorFunction<Feature<Geometry, GeoJsonProperties>, Color> = (d) => {
    const { highlightedFeatures = [], idProperty } = this.props
    if (getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!)) {
      return COLOR_HIGHLIGHT_FILL
    }

    const value = d.properties?.[this.props.stepsPickValue!]
    if (!value) {
      return COLOR_TRANSPARENT
    }

    const fillColor = this.state.scale(value)
    return fillColor ? (rgbaStringToComponents(fillColor) as Color) : COLOR_TRANSPARENT
  }

  renderLayers() {
    const { highlightedFeatures, color, layers, steps, stepsPickValue } = this.props
    const hasColorSteps = steps !== undefined && steps.length > 0 && stepsPickValue !== undefined
    const filterProps = this._getTimeFilterProps()
    return layers.map((layer) => {
      return new TileLayer<TileLayerProps<UserLayerFeature>>({
        id: `${layer.id}-base-layer`,
        data: this._getTilesUrl(layer.tilesUrl),
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
              id: `${props.id}-highlight-fills`,
              stroked: false,
              pickable: true,
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.Default, params),
              getFillColor: hasColorSteps ? this._getFillStepsColor : this._getFillColor,
              updateTriggers: {
                getFillColor: [highlightedFeatures],
              },
            }),
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-lines`,
              lineWidthMinPixels: 1,
              filled: false,
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.CustomLayer, params),
              getLineColor: hexToDeckColor(color),
            }),
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-highlight-lines`,
              lineWidthMinPixels: 0,
              lineWidthUnits: 'pixels',
              filled: false,
              visible: highlightedFeatures && highlightedFeatures?.length > 0,
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.CustomLayer, params),
              getLineWidth: this._getHighlightLineWidth,
              getLineColor: COLOR_HIGHLIGHT_LINE,
              updateTriggers: {
                getLineWidth: [highlightedFeatures],
              },
            }),
          ]
        },
      })
    })
  }
}
