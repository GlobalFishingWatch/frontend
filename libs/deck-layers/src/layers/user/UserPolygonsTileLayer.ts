import type {
  AccessorFunction,
  Color,
  DefaultProps,
  LayerContext,
  UpdateParameters,
} from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { ScaleLinear } from 'd3-scale'
import { scaleLinear } from 'd3-scale'
import type { Feature, GeoJsonProperties, Geometry } from 'geojson'

import {
  COLOR_HIGHLIGHT_FILL,
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  DEFAULT_BACKGROUND_COLOR,
  getColorRampByOpacitySteps,
  getFeatureInFilter,
  getFetchLoadOptions,
  getLayerGroupOffset,
  getMVTSublayerProps,
  getPickedFeatureToHighlight,
  GFWMVTLoader,
  hexToDeckColor,
  LayerGroup,
  rgbaStringToComponents,
} from '../../utils'

import type { UserLayerFeature, UserPolygonsLayerProps } from './user.types'
import type { UserBaseLayerState } from './UserBaseLayer'
import { UserBaseLayer } from './UserBaseLayer'

type _UserContextLayerProps = TileLayerProps & UserPolygonsLayerProps

const defaultProps: DefaultProps<_UserContextLayerProps> = {
  idProperty: 'gfw_id',
  valueProperties: [],
  maxRequests: 100,
  debounceTime: 500,
}

type UserContextLayerState = UserBaseLayerState & {
  scale: ScaleLinear<string, string, never>
}

export class UserContextTileLayer<PropsT = Record<string, unknown>> extends UserBaseLayer<
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

  _getHighlightLineWidth = (d: Feature<Geometry, GeoJsonProperties>, lineWidth = 2) => {
    const { idProperty, layers } = this.props
    const highlightedFeatures = this._getHighlightedFeatures()
    return getPickedFeatureToHighlight(d, highlightedFeatures, {
      idProperty,
      datasetId: layers?.[0].datasetId,
    })
      ? lineWidth
      : 0
  }

  _getLineColor: AccessorFunction<Feature<Geometry, GeoJsonProperties>, Color> = (d) => {
    const { color, filters, filterOperators } = this.props
    if (!getFeatureInFilter(d, filters, filterOperators)) {
      return COLOR_TRANSPARENT
    }
    return hexToDeckColor(color)
  }

  _getLineWidth: AccessorFunction<Feature<Geometry, GeoJsonProperties>, number> = (d) => {
    const { filters, filterOperators } = this.props
    if (!getFeatureInFilter(d, filters, filterOperators)) {
      return 0
    }
    return 1
  }

  _getFillColor: AccessorFunction<Feature<Geometry, GeoJsonProperties>, Color> = (d) => {
    const { idProperty, layers, filters, filterOperators } = this.props
    if (!getFeatureInFilter(d, filters, filterOperators)) {
      return COLOR_TRANSPARENT
    }
    const highlightedFeatures = this._getHighlightedFeatures()
    return getPickedFeatureToHighlight(d, highlightedFeatures, {
      idProperty,
      datasetId: layers?.[0].datasetId,
    })
      ? COLOR_HIGHLIGHT_FILL
      : COLOR_TRANSPARENT
  }

  _getFillStepsColor: AccessorFunction<Feature<Geometry, GeoJsonProperties>, Color> = (d) => {
    const { idProperty, layers, filters, filterOperators } = this.props
    if (!getFeatureInFilter(d, filters, filterOperators)) {
      return COLOR_TRANSPARENT
    }
    const highlightedFeatures = this._getHighlightedFeatures()
    if (
      getPickedFeatureToHighlight(d, highlightedFeatures, {
        idProperty,
        datasetId: layers?.[0].datasetId,
      })
    ) {
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
    const { layers, steps, stepsPickValue, filters, color, pickable } = this.props
    const highlightedFeatures = this._getHighlightedFeatures()
    const hasColorSteps = steps !== undefined && steps.length > 0 && stepsPickValue !== undefined
    const filterProps = this._getTimeFilterProps()
    return layers.map((layer) => {
      return new TileLayer<TileLayerProps<UserLayerFeature>>({
        id: `${layer.id}-base-layer`,
        data: this._getTilesUrl(layer.tilesUrl),
        loaders: [GFWMVTLoader],
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
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-highlight-fills`,
              stroked: false,
              pickable: pickable,
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsBackground, params),
              getFillColor: hasColorSteps ? this._getFillStepsColor : this._getFillColor,
              updateTriggers: {
                getFillColor: [highlightedFeatures, filters, color],
              },
            }),
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-lines`,
              lineWidthMinPixels: 0,
              lineWidthUnits: 'pixels',
              filled: false,
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.CustomLayer, params),
              getLineColor: this._getLineColor,
              getLineWidth: this._getLineWidth,
              updateTriggers: {
                getLineColor: [filters, color],
                getLineWidth: [filters],
              },
            }),
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-highlight-lines-bg`,
              lineWidthMinPixels: 0,
              lineWidthUnits: 'pixels',
              filled: false,
              lineJointRounded: true,
              lineCapRounded: true,
              visible: highlightedFeatures && highlightedFeatures?.length > 0,
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
              getLineWidth: (d) => this._getHighlightLineWidth(d, 4),
              getLineColor: DEFAULT_BACKGROUND_COLOR,
              updateTriggers: {
                getLineWidth: [highlightedFeatures],
              },
            }),
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-highlight-lines-fg`,
              lineWidthMinPixels: 0,
              lineWidthUnits: 'pixels',
              filled: false,
              lineJointRounded: true,
              lineCapRounded: true,
              visible: highlightedFeatures && highlightedFeatures?.length > 0,
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
              getLineWidth: (d) => this._getHighlightLineWidth(d, 2),
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
