import type { Color, DefaultProps, LayerContext, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { DataFilterExtension, PathStyleExtension } from '@deck.gl/extensions'
import type { GeoBoundingBox, TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { GeoJsonProperties } from 'geojson'

import {
  COLOR_HIGHLIGHT_FILL,
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  DEFAULT_BACKGROUND_COLOR,
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
  getContextValue,
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

export class ContextLayer<PropsT = Record<string, unknown>> extends CompositeLayer<
  _ContextLayerProps & PropsT
> {
  static layerName = 'ContextLayer'
  static defaultProps = defaultProps

  state!: ContextLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      highlightedFeatures: [],
    }
  }

  _getHighlightedFeatures() {
    return [...(this.props.highlightedFeatures || []), ...(this.state.highlightedFeatures || [])]
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
      idProperty: layer.idProperty,
      datasetId: layer.datasetId,
    })
      ? Math.max(sublayer.thickness || 1, lineWidth)
      : 0
  }

  getFillColor(d: ContextFeature, { layer, sublayer }: ContextSublayerCallbackParams): Color {
    if (!layer || !sublayer) return COLOR_TRANSPARENT

    const highlightedFeatures = this._getHighlightedFeatures()
    return getPickedFeatureToHighlight(d, highlightedFeatures, {
      idProperty: layer.idProperty,
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
      title: sublayer.dataviewId,
      color: sublayer.color,
      layerId: sublayer.dataviewId,
      datasetId: this.props.layers[0].datasetId,
      category: this.props.category,
      id: getContextId(info.object as ContextFeature, idProperty),
      value: getContextValue(info.object as ContextFeature, valueProperties),
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
    const features = deck!.pickObjects({
      x,
      y,
      width,
      height,
      layerIds: [this.id],
      maxObjects,
    })
    return features.filter((f) => f.object)
  }

  getRenderedFeatures(maxFeatures: number | null = null): ContextFeature[] {
    const features = this._pickObjects(maxFeatures)
    const featureCache = new Set()
    const renderedFeatures: ContextFeature[] = []

    for (const f of features) {
      const featureId = getContextId(f.object as ContextFeature, this.props.layers?.[0]?.idProperty)

      if (featureId === undefined) {
        // we have no id for the feature, we just add to the list
        renderedFeatures.push(f.object as ContextFeature)
      } else if (!featureCache.has(featureId)) {
        // Add removing duplicates
        featureCache.add(featureId)
        renderedFeatures.push(f.object as ContextFeature)
      }
    }

    return renderedFeatures
  }

  renderLayers() {
    const { visible, layers, pickable } = this.props

    if (!visible) return []

    const highlightedFeatures = this._getHighlightedFeatures()
    return layers.map((layer) => {
      if (layer.id === ContextLayerId.EEZBoundaries) {
        return new TileLayer<TileLayerProps>({
          id: `${layer.id}-boundaries-layer`,
          data: layer.tilesUrl,
          loaders: [GFWMVTLoader],
          maxZoom: 8,
          renderSubLayers: (props: any) => {
            const mvtSublayerProps = { ...props, ...getMVTSublayerProps(props) }
            return layer.sublayers.map((sublayer) => [
              new GeoJsonLayer(mvtSublayerProps, {
                id: `${props.id}-${sublayer.dataviewId}-boundaries`,
                onViewportLoad: this.props.onViewportLoad,
                lineWidthMinPixels: 1,
                filled: false,
                getPolygonOffset: (params: { layerIndex: number }) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
                getLineColor: hexToDeckColor(sublayer.color),
                getLineWidth: sublayer.thickness,
                lineWidthUnits: 'pixels',
                lineJointRounded: true,
                lineCapRounded: true,
                extensions: [
                  ...mvtSublayerProps.extensions,
                  new PathStyleExtension({ dash: true, highPrecisionDash: true }),
                ],
                getDashArray: (d: ContextFeature) => this.getDashArray(d),
                updateTriggers: {
                  getLineWidth: sublayer.thickness,
                },
              } as any),
            ])
          },
        })
      }

      return new TileLayer<TileLayerProps<ContextFeature>>({
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

            const hasValidFilters =
              filterCategories.length > 0 &&
              sublayer.filters &&
              Object.keys(sublayer.filters).length > 0
            const filtersHash = getContextFiltersHash(sublayer.filters)
            const extensions = [
              ...mvtSublayerProps.extensions,
              ...(hasValidFilters ? [new DataFilterExtension({ categorySize: 1 })] : []),
            ]
            const filterProperties = hasValidFilters
              ? {
                  getFilterCategory: (d: ContextFeature) => {
                    // TODO: do we need to handle multiple filters?
                    const filterKeys = Object.keys(sublayer.filters || {})
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
                pickable,
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
    this.setState({ highlightedFeatures })
  }
}
