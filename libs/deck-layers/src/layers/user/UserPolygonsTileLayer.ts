import type { Color, DefaultProps, LayerContext, UpdateParameters } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { ScaleLinear } from 'd3-scale'
import { scaleLinear } from 'd3-scale'
import type { Feature, GeoJsonProperties, Geometry } from 'geojson'

import { isFeatureInFilters } from '@globalfishingwatch/deck-loaders'

import {
  COLOR_HIGHLIGHT_FILL,
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_ID_PROPERTY,
  getColorRampByOpacitySteps,
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
import {
  getContextFiltersHash,
  hasSublayerFilters,
  supportDataFilterExtension,
} from '../context/context.utils'

import type { UserLayerFeature, UserPolygonsLayerProps } from './user.types'
import { DEFAULT_USER_TILES_MAX_ZOOM } from './user.utils'
import type { UserBaseLayerState } from './UserBaseLayer'
import { UserBaseLayer } from './UserBaseLayer'

type _UserContextLayerProps = TileLayerProps & UserPolygonsLayerProps

const defaultProps: DefaultProps<_UserContextLayerProps> = {
  maxRequests: 100,
  debounceTime: 500,
}

type UserPolygonsLayerState = UserBaseLayerState & {
  scale: ScaleLinear<string, string, never>
  viewportLoaded: boolean
  error: string
}

export class UserContextTileLayer<PropsT = Record<string, unknown>> extends UserBaseLayer<
  _UserContextLayerProps & PropsT
> {
  static layerName = 'UserContextTileLayer'
  static defaultProps = defaultProps
  declare state: UserPolygonsLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    // TODO: support multiple sublayers
    const color = this.props.layers?.[0]?.sublayers?.[0]?.color
    const colorRange = getColorRampByOpacitySteps(color)
    if (this.props.steps && this.props.steps?.length > 0 && colorRange) {
      this.state = {
        scale: scaleLinear(this.props.steps as number[], colorRange).clamp(true),
        viewportLoaded: false,
        error: '',
      }
    }
  }

  getError() {
    return this?.state.error
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
    return `${id}-${startTime}-${endTime}${this.filtersHash}${this.aggregatedPropertyHash}-${this.viewportLoaded}`
  }

  get viewportLoaded(): boolean {
    return this.state?.viewportLoaded ?? false
  }

  updateState({ props, oldProps, changeFlags }: UpdateParameters<this>) {
    const { steps } = props
    // TODO: support multiple sublayers
    const color = props.layers?.[0]?.sublayers?.[0]?.color
    const oldColor = oldProps.layers?.[0]?.sublayers?.[0]?.color
    const newColor = color !== oldColor
    const newSteps = steps !== oldProps.steps
    const deferredStateUpdates: Partial<UserPolygonsLayerState> = {}

    if (changeFlags.dataChanged) {
      deferredStateUpdates.viewportLoaded = false
    }

    if (newColor || newSteps) {
      if (steps && steps.length > 0) {
        const colorRange = getColorRampByOpacitySteps(color)
        const scale = scaleLinear(steps as number[], colorRange)
        deferredStateUpdates.scale = scale
      } else {
        deferredStateUpdates.scale = undefined
      }
    }
    if (Object.keys(deferredStateUpdates).length > 0) {
      this.setState(deferredStateUpdates)
    }
  }

  _getHighlightLineWidth = (
    d: Feature<Geometry, GeoJsonProperties>,
    { layer, sublayer, lineWidth }: ContextSublayerCallbackParams<{ lineWidth: number }>
  ) => {
    const highlightedFeatures = this._getHighlightedFeatures()
    return getPickedFeatureToHighlight(d, highlightedFeatures, {
      idProperty: layer.idProperty || DEFAULT_ID_PROPERTY,
      datasetId: layer.datasetId,
    })
      ? Math.max(sublayer.thickness || 1, lineWidth)
      : 0
  }

  _onLayerError = (error: Error) => {
    if (!error.message.includes('404')) {
      this.setState({ error: error.message })
    }
    return true
  }

  _getLineColor = (d: GeoJsonProperties, { sublayer }: ContextSublayerCallbackParams): Color => {
    if (
      hasSublayerFilters(sublayer) &&
      !supportDataFilterExtension(sublayer, this._getTimeFilterProps()) &&
      !isFeatureInFilters(d, sublayer.filters, sublayer.filterOperators)
    ) {
      return COLOR_TRANSPARENT
    }
    return hexToDeckColor(sublayer.color)
  }

  _getLineWidth = (d: GeoJsonProperties, { sublayer }: ContextSublayerCallbackParams): number => {
    if (
      hasSublayerFilters(sublayer) &&
      !supportDataFilterExtension(sublayer, this._getTimeFilterProps()) &&
      !isFeatureInFilters(d, sublayer.filters, sublayer.filterOperators)
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
      !supportDataFilterExtension(sublayer, this._getTimeFilterProps()) &&
      !isFeatureInFilters(d, sublayer.filters, sublayer.filterOperators)
    ) {
      return COLOR_TRANSPARENT
    }
    const highlightedFeatures = this._getHighlightedFeatures()
    return getPickedFeatureToHighlight(d, highlightedFeatures, {
      idProperty: layer.idProperty || DEFAULT_ID_PROPERTY,
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
      !supportDataFilterExtension(sublayer, this._getTimeFilterProps()) &&
      !isFeatureInFilters(d, sublayer.filters, sublayer.filterOperators)
    ) {
      return COLOR_TRANSPARENT
    }
    const highlightedFeatures = this._getHighlightedFeatures()
    if (
      getPickedFeatureToHighlight(d, highlightedFeatures, {
        idProperty: layer.idProperty || DEFAULT_ID_PROPERTY,
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
    return layers.map((layer) => {
      return new TileLayer<TileLayerProps<UserLayerFeature>>({
        id: `${layer.id}-base-layer`,
        data: this._getTilesUrl(layer.tilesUrl),
        loaders: [GFWMVTLoader],
        maxZoom: maxZoom || DEFAULT_USER_TILES_MAX_ZOOM,
        loadOptions: {
          ...getFetchLoadOptions(),
        },
        onTileError: this._onLayerError,
        onViewportLoad: this.props.onViewportLoad,
        renderSubLayers: (props) => {
          const mvtSublayerProps = {
            ...props,
            ...getMVTSublayerProps({ tile: props.tile, extensions: props.extensions }),
          }
          return layer.sublayers.map((sublayer) => {
            const filtersHash = getContextFiltersHash(sublayer.filters)
            const sublayerPrefix = `${props.id}-${sublayer.dataviewId}`
            const { extensionFilterProps, updateTrigger } = this._getExtensionFilterProps(sublayer)
            return [
              new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                id: `${sublayerPrefix}-highlight-fills-${filtersHash}`,
                stroked: false,
                pickable: layer?.pickable ?? pickable,
                ...extensionFilterProps,
                getPolygonOffset: (params) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygonsBackground, params),
                getFillColor: (d) =>
                  hasColorSteps
                    ? this._getFillStepsColor(d, { layer, sublayer })
                    : this._getFillColor(d, { layer, sublayer }),
                updateTriggers: {
                  getFillColor: [highlightedFeatures, filtersHash, sublayer.color],
                  ...updateTrigger,
                },
              }),
              new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                id: `${sublayerPrefix}-lines-${filtersHash}`,
                lineWidthMinPixels: 0,
                lineWidthUnits: 'pixels',
                filled: false,
                ...extensionFilterProps,
                getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.CustomLayer, params),
                getLineColor: hexToDeckColor(sublayer.color),
                getLineWidth: sublayer.thickness || 1,
                updateTriggers: {
                  getLineColor: [filtersHash, sublayer.color],
                  getLineWidth: [filtersHash, sublayer.thickness],
                  ...updateTrigger,
                },
              }),
              new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                id: `${sublayerPrefix}-highlight-lines-bg-${filtersHash}`,
                lineWidthMinPixels: 0,
                lineWidthUnits: 'pixels',
                filled: false,
                lineJointRounded: true,
                lineCapRounded: true,
                visible: highlightedFeatures && highlightedFeatures?.length > 0,
                ...extensionFilterProps,
                getPolygonOffset: (params) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
                getLineWidth: (d) =>
                  this._getHighlightLineWidth(d, { layer, sublayer, lineWidth: 4 }),
                getLineColor: DEFAULT_BACKGROUND_COLOR,
                updateTriggers: {
                  getLineWidth: [highlightedFeatures],
                  ...updateTrigger,
                },
              }),
              new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                id: `${sublayerPrefix}-highlight-lines-fg-${filtersHash}`,
                lineWidthMinPixels: 0,
                lineWidthUnits: 'pixels',
                filled: false,
                lineJointRounded: true,
                lineCapRounded: true,
                visible: highlightedFeatures && highlightedFeatures?.length > 0,
                ...extensionFilterProps,
                getPolygonOffset: (params) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
                getLineWidth: (d) =>
                  this._getHighlightLineWidth(d, { layer, sublayer, lineWidth: 2 }),
                getLineColor: COLOR_HIGHLIGHT_LINE,
                updateTriggers: {
                  getLineWidth: [highlightedFeatures],
                  ...updateTrigger,
                },
              }),
            ]
          })
        },
      })
    })
  }
}
