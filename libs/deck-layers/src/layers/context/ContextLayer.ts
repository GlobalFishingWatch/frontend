import type { Color, DefaultProps, LayerContext, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { DataFilterExtension, PathStyleExtension } from '@deck.gl/extensions'
import type {
  _Tile2DHeader as Tile2DHeader,
  GeoBoundingBox,
  TileLayerProps,
} from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { GeoJsonProperties } from 'geojson'

import {
  COLOR_HIGHLIGHT_FILL,
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_ID_PROPERTY,
  getFetchLoadOptions,
  getLayerGroupOffset,
  getMVTSublayerProps,
  getPickedFeatureToHighlight,
  GFWMVTLoader,
  hexToDeckColor,
  LayerGroup,
} from '../../utils'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'

import { EEZ_SETTLED_BOUNDARIES } from './context.config'
import type {
  ContextFeature,
  ContextLayerProps,
  ContextPickingInfo,
  ContextPickingObject,
  ContextSublayerCallbackParams,
} from './context.types'
import { ContextLayerId } from './context.types'
import {
  getContextFiltersHash,
  getContextId,
  getContextLink,
  mergePickedFeatures,
} from './context.utils'

type _ContextLayerProps = TileLayerProps & ContextLayerProps

type ContextLayerState = {
  highlightedFeatures?: ContextPickingObject[]
}

const defaultProps: DefaultProps<_ContextLayerProps> = {
  pickable: true,
  maxRequests: 100,
  debounceTime: 500,
}
const emptyHighlightedFeatures = [] as ContextPickingObject[]
export class ContextLayer<PropsT = Record<string, unknown>> extends CompositeLayer<
  _ContextLayerProps & PropsT
> {
  static layerName = 'ContextLayer'
  static defaultProps = defaultProps

  declare state: ContextLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      highlightedFeatures: [],
    }
  }

  get filtersHash(): string {
    return (
      this.props.layers
        ?.flatMap((layer) =>
          layer.sublayers.map((sublayer) => getContextFiltersHash(sublayer.filters))
        )
        .join('-') ?? ''
    )
  }

  get cacheHash(): string {
    return `${this.props.id}${this.filtersHash}-${this.isLoaded}`
  }

  _getHighlightedFeatures() {
    return this.state.highlightedFeatures || emptyHighlightedFeatures
  }

  getHighlightLineWidth(
    d: ContextFeature,
    {
      layer,
      sublayer,
      lineWidth,
    }: ContextSublayerCallbackParams<{
      lineWidth: number
    }>
  ): number {
    if (!layer || !sublayer) return 0
    const highlightedFeatures = this._getHighlightedFeatures()
    return getPickedFeatureToHighlight(d, highlightedFeatures, {
      idProperty: layer.idProperty || DEFAULT_ID_PROPERTY,
      datasetId: layer.datasetId,
    })
      ? Math.max(sublayer.thickness || 1, lineWidth)
      : 0
  }

  getFillColor(d: ContextFeature, { layer, sublayer }: ContextSublayerCallbackParams): Color {
    if (!layer || !sublayer) return COLOR_TRANSPARENT

    const highlightedFeatures = this._getHighlightedFeatures()
    return getPickedFeatureToHighlight(d, highlightedFeatures, {
      idProperty: layer.idProperty || DEFAULT_ID_PROPERTY,
      datasetId: layer.datasetId,
    })
      ? COLOR_HIGHLIGHT_FILL
      : COLOR_TRANSPARENT
  }

  getDashArray(d: ContextFeature): [number, number] {
    return EEZ_SETTLED_BOUNDARIES.includes(d.properties?.LINE_TYPE) ? [0, 0] : [8, 8]
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<ContextFeature, { tile?: Tile2DHeader }>
  }): ContextPickingInfo => {
    // TODO: handle multiple layers
    if (!info.object) return { ...info, object: undefined }
    const { idProperty, valueProperties } = this.props.layers[0]

    const sublayer = this.props.layers
      .flatMap((layer) => layer.sublayers)
      .find((sublayer) => {
        return (info as any).sourceTileSubLayer.props.id.includes(sublayer.dataviewId)
      })
    if (!sublayer) return { ...info, object: undefined }
    const object = {
      ...transformTileCoordsToWGS84(
        info.object as ContextFeature,
        info.tile!.bbox as GeoBoundingBox,
        this.context.viewport
      ),
      color: sublayer.color,
      layerId: sublayer.dataviewId,
      datasetId: this.props.layers[0].datasetId,
      dataviewId: sublayer.dataviewId,
      category: this.props.category,
      id: getContextId(info.object as ContextFeature, idProperty),
      value: info.object?.properties?.value,
      valueProperties,
      link: getContextLink({
        ...info.object,
        layerId: this.props.layers[0].id,
      } as ContextPickingObject),
    } as ContextPickingObject
    return { ...info, object }
  }

  _pickObjects(maxObjects: number | null): PickingInfo[] {
    const { deck, viewport } = this.context
    const width = viewport.width
    const height = viewport.height
    const x = viewport.x
    const y = viewport.y
    const layerIds = this.props.layers.map((l) => l.id)
    const features = deck!.pickObjects({ x, y, width, height, layerIds, maxObjects })
    return features.filter((f) => f.object)
  }

  getRenderedFeatures(maxFeatures: number | null = null): ContextFeature[] {
    const idProperty = this.props.layers[0].idProperty || DEFAULT_ID_PROPERTY
    return mergePickedFeatures<ContextFeature>({
      pickedFeatures: this._pickObjects(maxFeatures),
      idProperty,
      layers: this.props.layers,
    })
  }

  renderLayers() {
    const { visible, layers, pickable } = this.props

    if (!visible) return []

    const highlightedFeatures = this._getHighlightedFeatures()
    return layers.map((layer) => {
      if (layer.id === ContextLayerId.EEZBoundaries) {
        return new TileLayer<ContextFeature>({
          id: `${layer.id}-boundaries-layer`,
          data: layer.tilesUrl,
          loaders: [GFWMVTLoader],
          maxZoom: 8,
          renderSubLayers: (props: any) => {
            const mvtSublayerProps = { ...props, ...getMVTSublayerProps(props) }
            return layer.sublayers.map((sublayer) => {
              const thickness = sublayer.thickness ?? 1
              return [
                new GeoJsonLayer(mvtSublayerProps, {
                  id: `${props.id}-${sublayer.dataviewId}-boundaries`,
                  onViewportLoad: this.props.onViewportLoad,
                  lineWidthMinPixels: 1,
                  filled: false,
                  getPolygonOffset: (params: { layerIndex: number }) =>
                    getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
                  getLineColor: hexToDeckColor(sublayer.color),
                  getLineWidth: thickness,
                  lineWidthUnits: 'pixels',
                  lineJointRounded: true,
                  lineCapRounded: true,
                  extensions: [
                    ...mvtSublayerProps.extensions,
                    new PathStyleExtension({ dash: true, highPrecisionDash: true }),
                  ],
                  getDashArray: (d: ContextFeature) => this.getDashArray(d),
                  updateTriggers: {
                    getLineWidth: thickness,
                  },
                } as any),
              ]
            })
          },
        })
      }

      return new TileLayer<ContextFeature>({
        id: `${layer.id}-base-layer`,
        data: layer.tilesUrl,
        loaders: [GFWMVTLoader],
        loadOptions: {
          ...getFetchLoadOptions(),
        },
        maxZoom: 8,
        onViewportLoad: this.props.onViewportLoad,
        renderSubLayers: (props) => {
          const mvtSublayerProps = {
            ...props,
            ...getMVTSublayerProps({ tile: props.tile, extensions: props.extensions }),
          }
          return layer.sublayers.map((sublayer) => {
            const filterCategories = Object.values(sublayer.filters || {}).flatMap(
              (value) => value || []
            )

            const filterKeys = Object.keys(sublayer.filters || {})
            const hasValidFilters = filterCategories.length > 0 && filterKeys.length > 0
            const filtersHash = getContextFiltersHash(sublayer.filters)
            const extensions = [
              ...mvtSublayerProps.extensions,
              ...(hasValidFilters ? [new DataFilterExtension({ categorySize: 1 })] : []),
            ]
            const filterProperties = hasValidFilters
              ? {
                  getFilterCategory: (d: ContextFeature) => {
                    // TODO: do we need to handle multiple filters?
                    if (filterKeys.length === 0) return 0
                    const propertyValue = d.properties[filterKeys[0]]
                    return propertyValue !== undefined ? propertyValue : 0
                  },
                  filterCategories: filterCategories.length > 0 ? filterCategories : [0],
                }
              : {}
            return [
              new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                id: `${props.id}-${sublayer.dataviewId}-highlight-fills-${filtersHash}`,
                stroked: false,
                pickable: layer?.pickable ?? pickable,
                extensions,
                ...filterProperties,
                getPolygonOffset: (params) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygonsBackground, params),
                getFillColor: (d) => this.getFillColor(d as ContextFeature, { layer, sublayer }),
                updateTriggers: {
                  getFillColor: [highlightedFeatures],
                  ...(hasValidFilters && {
                    getFilterCategory: [filtersHash],
                    filterCategories: [filtersHash],
                  }),
                },
              }),
              ...(layer.id !== ContextLayerId.EEZ && layer.id !== ContextLayerId.EEZBoundaries
                ? [
                    new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                      id: `${props.id}-${sublayer.dataviewId}-lines-${filtersHash}`,
                      lineWidthUnits: 'pixels',
                      extensions,
                      ...filterProperties,
                      lineWidthMinPixels: 0,
                      filled: false,
                      lineJointRounded: true,
                      lineCapRounded: true,
                      getPolygonOffset: (params) =>
                        getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
                      getLineWidth: sublayer.thickness || 1,
                      getLineColor: hexToDeckColor(sublayer.color),
                      updateTriggers: {
                        getLineWidth: [filtersHash, sublayer.thickness],
                        ...(hasValidFilters && {
                          getFilterCategory: [filtersHash],
                          filterCategories: [filtersHash],
                        }),
                      },
                    }),
                  ]
                : []),
              new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                id: `${props.id}-${sublayer.dataviewId}-highlight-lines-bg`,
                lineWidthMinPixels: 0,
                lineWidthUnits: 'pixels',
                filled: false,
                lineJointRounded: true,
                lineCapRounded: true,
                visible: highlightedFeatures && highlightedFeatures?.length > 0,
                getPolygonOffset: (params) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
                getLineWidth: (d) =>
                  this.getHighlightLineWidth(d as ContextFeature, {
                    layer,
                    sublayer,
                    lineWidth: 4,
                  }),
                getLineColor: DEFAULT_BACKGROUND_COLOR,
                updateTriggers: {
                  getLineWidth: [highlightedFeatures],
                },
              }),
              new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                id: `${props.id}-${sublayer.dataviewId}-highlight-lines-fg`,
                lineWidthMinPixels: 0,
                lineWidthUnits: 'pixels',
                filled: false,
                lineJointRounded: true,
                lineCapRounded: true,
                visible: highlightedFeatures && highlightedFeatures?.length > 0,
                getPolygonOffset: (params) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
                getLineWidth: (d) =>
                  this.getHighlightLineWidth(d as ContextFeature, {
                    layer,
                    sublayer,
                    lineWidth: 2,
                  }),
                getLineColor: COLOR_HIGHLIGHT_LINE,
                updateTriggers: {
                  getLineWidth: [highlightedFeatures],
                },
              }),
            ]
          })
        },
      })
    })
  }

  setHighlightedFeatures(highlightedFeatures: ContextFeature[]) {
    if (!this.state) {
      return
    }
    this.setState({ highlightedFeatures })
  }
}
