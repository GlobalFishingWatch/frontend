import type { Color, DefaultProps, LayerContext, UpdateParameters } from '@deck.gl/core'
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
  getFeatureInFilters,
  getFetchLoadOptions,
  getLayerGroupOffset,
  getMVTSublayerProps,
  getPickedFeatureToHighlight,
  GFWMVTLoader,
  hexToDeckColor,
  LayerGroup,
  rgbaStringToComponents,
} from '../../utils'
import type { ContextSublayerCallbackParams } from '../context/context.types'
import { hasSublayerFilters, supportDataFilterExtension } from '../context/context.utils'

import type { UserLayerFeature, UserPolygonsLayerProps } from './user.types'
import { DEFAULT_USER_TILES_MAX_ZOOM } from './user.utils'
import type { UserBaseLayerState } from './UserBaseLayer'
import { UserBaseLayer } from './UserBaseLayer'

type _UserContextLayerProps = TileLayerProps & UserPolygonsLayerProps

const defaultProps: DefaultProps<_UserContextLayerProps> = {
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
    // TODO: support multiple sublayers
    const color = this.props.layers?.[0]?.sublayers?.[0]?.color
    const colorRange = getColorRampByOpacitySteps(color)
    if (this.props.steps && this.props.steps?.length > 0 && colorRange) {
      this.state = {
        scale: scaleLinear(this.props.steps as number[], colorRange).clamp(true),
      }
    }
  }

  updateState({ props, oldProps }: UpdateParameters<this>) {
    const { steps } = props
    // TODO: support multiple sublayers
    const color = props.layers?.[0]?.sublayers?.[0]?.color
    const oldColor = oldProps.layers?.[0]?.sublayers?.[0]?.color
    const newColor = color !== oldColor
    const newSteps = steps !== oldProps.steps

    if (newColor || newSteps) {
      if (steps && steps.length > 0) {
        const colorRange = getColorRampByOpacitySteps(color)
        const scale = scaleLinear(steps as number[], colorRange)
        this.setState({ scale })
      } else {
        this.setState({ scale: undefined })
      }
    }
  }

  _getHighlightLineWidth = (
    d: Feature<Geometry, GeoJsonProperties>,
    { layer, sublayer, lineWidth }: ContextSublayerCallbackParams<{ lineWidth: number }>
  ) => {
    const highlightedFeatures = this._getHighlightedFeatures()
    return getPickedFeatureToHighlight(d, highlightedFeatures, {
      idProperty: layer.idProperty,
      datasetId: layer.datasetId,
    })
      ? Math.max(sublayer.thickness || 1, lineWidth)
      : 0
  }

  _getLineColor = (d: GeoJsonProperties, { sublayer }: ContextSublayerCallbackParams): Color => {
    if (
      hasSublayerFilters(sublayer) &&
      !supportDataFilterExtension(sublayer) &&
      !getFeatureInFilters(d, sublayer.filters, sublayer.filterOperators)
    ) {
      return COLOR_TRANSPARENT
    }
    return hexToDeckColor(sublayer.color)
  }

  _getLineWidth = (d: GeoJsonProperties, { sublayer }: ContextSublayerCallbackParams): number => {
    if (
      hasSublayerFilters(sublayer) &&
      !supportDataFilterExtension(sublayer) &&
      !getFeatureInFilters(d, sublayer.filters, sublayer.filterOperators)
    ) {
      return 0
    }
    return sublayer.thickness || 1
  }

  _getFillColor = (
    d: GeoJsonProperties,
    { layer, sublayer }: ContextSublayerCallbackParams
  ): Color => {
    if (
      hasSublayerFilters(sublayer) &&
      !supportDataFilterExtension(sublayer) &&
      !getFeatureInFilters(d, sublayer.filters, sublayer.filterOperators)
    ) {
      return COLOR_TRANSPARENT
    }
    const highlightedFeatures = this._getHighlightedFeatures()
    return getPickedFeatureToHighlight(d, highlightedFeatures, {
      idProperty: layer.idProperty,
      datasetId: layer.datasetId,
    })
      ? COLOR_HIGHLIGHT_FILL
      : COLOR_TRANSPARENT
  }

  _getFillStepsColor = (
    d: GeoJsonProperties,
    { layer, sublayer }: ContextSublayerCallbackParams
  ): Color => {
    if (
      hasSublayerFilters(sublayer) &&
      !supportDataFilterExtension(sublayer) &&
      !getFeatureInFilters(d, sublayer.filters, sublayer.filterOperators)
    ) {
      return COLOR_TRANSPARENT
    }
    const highlightedFeatures = this._getHighlightedFeatures()
    if (
      getPickedFeatureToHighlight(d, highlightedFeatures, {
        idProperty: layer.idProperty,
        datasetId: layer.datasetId,
      })
    ) {
      return COLOR_HIGHLIGHT_FILL
    }

    const value = d?.properties?.[this.props.stepsPickValue!]
    if (!value) {
      return COLOR_TRANSPARENT
    }

    const fillColor = this.state.scale(value)
    return fillColor ? (rgbaStringToComponents(fillColor) as Color) : COLOR_TRANSPARENT
  }

  renderLayers() {
    const { layers, steps, stepsPickValue, pickable, maxZoom } = this.props

    const highlightedFeatures = this._getHighlightedFeatures()
    const hasColorSteps = steps !== undefined && steps.length > 0 && stepsPickValue !== undefined
    const filterProps = this._getTimeFilterProps()
    return layers.map((layer) => {
      return new TileLayer<TileLayerProps<UserLayerFeature>>({
        id: `${layer.id}-base-layer`,
        data: this._getTilesUrl(layer.tilesUrl),
        loaders: [GFWMVTLoader],
        maxZoom: maxZoom || DEFAULT_USER_TILES_MAX_ZOOM,
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
          return layer.sublayers.map((sublayer) => {
            const filtersHash = Object.values(sublayer.filters || {})
              .flatMap((value) => value || [])
              .join('')
            const sublayerFilterExtensionProps = this._getSublayerFilterExtensionProps(sublayer)
            const hasFilters = Object.keys(sublayerFilterExtensionProps).length > 0
            return [
              new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                id: `${props.id}-highlight-fills`,
                stroked: false,
                pickable: pickable,
                ...sublayerFilterExtensionProps,
                getPolygonOffset: (params) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygonsBackground, params),
                getFillColor: (d) =>
                  hasColorSteps
                    ? this._getFillStepsColor(d, { layer, sublayer })
                    : this._getFillColor(d, { layer, sublayer }),
                updateTriggers: {
                  getFillColor: [highlightedFeatures, filtersHash, sublayer.color],
                  ...(hasFilters && {
                    getFilterValue: [filtersHash],
                  }),
                },
              }),
              new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                id: `${props.id}-lines`,
                lineWidthMinPixels: 0,
                lineWidthUnits: 'pixels',
                filled: false,
                ...sublayerFilterExtensionProps,
                getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.CustomLayer, params),
                getLineColor: hexToDeckColor(sublayer.color),
                getLineWidth: sublayer.thickness || 1,
                updateTriggers: {
                  getLineColor: [filtersHash, sublayer.color],
                  getLineWidth: [filtersHash, sublayer.thickness],
                  ...(hasFilters && {
                    getFilterValue: [filtersHash],
                  }),
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
                ...sublayerFilterExtensionProps,
                getPolygonOffset: (params) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
                getLineWidth: (d) =>
                  this._getHighlightLineWidth(d, { layer, sublayer, lineWidth: 4 }),
                getLineColor: DEFAULT_BACKGROUND_COLOR,
                updateTriggers: {
                  getLineWidth: [highlightedFeatures],
                  ...(hasFilters && {
                    getFilterValue: [filtersHash],
                  }),
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
                ...sublayerFilterExtensionProps,
                getPolygonOffset: (params) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
                getLineWidth: (d) =>
                  this._getHighlightLineWidth(d, { layer, sublayer, lineWidth: 2 }),
                getLineColor: COLOR_HIGHLIGHT_LINE,
                updateTriggers: {
                  getLineWidth: [highlightedFeatures],
                  ...(hasFilters && {
                    getFilterValue: [filtersHash],
                  }),
                },
              }),
            ]
          })
        },
      })
    })
  }
}
