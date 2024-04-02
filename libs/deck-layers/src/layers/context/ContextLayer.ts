import { CompositeLayer, Color, DefaultProps } from '@deck.gl/core'
import { GeoBoundingBox, TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import { GeoJsonProperties } from 'geojson'
import { PathStyleExtension } from '@deck.gl/extensions'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
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
} from '../../utils'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'
import { EEZ_SETTLED_BOUNDARIES } from './context.config'
import {
  ContextLayerProps,
  ContextPickingInfo,
  ContextFeature,
  ContextLayerId,
} from './context.types'
import { getContextId, getContextLink, getContextValue } from './context.utils'

type _ContextLayerProps = TileLayerProps & ContextLayerProps

const defaultProps: DefaultProps<_ContextLayerProps> = {
  idProperty: 'gfw_id',
  valueProperties: [],
  maxRequests: 100,
  debounceTime: 500,
}

export class ContextLayer<PropsT = {}> extends CompositeLayer<_ContextLayerProps & PropsT> {
  static layerName = 'ContextLayer'
  static defaultProps = defaultProps

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    this.setState({ loaded: true })
    this.props.onViewportLoad?.(tiles)
  }

  _onTileDataLoading = () => {
    this.setState({ loaded: false })
  }

  getHighlightLineWidth(d: ContextFeature): number {
    const { hoveredFeatures = [], clickedFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, clickedFeatures, idProperty!) ||
      getPickedFeatureToHighlight(d, hoveredFeatures, idProperty!)
      ? 1
      : 0
  }

  getFillColor(d: ContextFeature): Color {
    const { hoveredFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, hoveredFeatures, idProperty!)
      ? COLOR_HIGHLIGHT_FILL
      : COLOR_TRANSPARENT
  }

  getDashArray(d: ContextFeature): [number, number] {
    return EEZ_SETTLED_BOUNDARIES.includes(d.properties?.LINE_TYPE) ? [0, 0] : [8, 8]
  }

  getPickingInfo = ({ info }: { info: ContextPickingInfo }): ContextPickingInfo => {
    const { idProperty, valueProperties } = this.props
    info.object = transformTileCoordsToWGS84(
      info.object as ContextFeature,
      info.tile!.bbox as GeoBoundingBox,
      this.context.viewport
    ) as ContextFeature
    info.object.title = this.props.id
    info.object.color = this.props.color
    info.object.layerId = this.props.layers[0].id
    info.object.datasetId = this.props.layers[0].datasetId
    info.object.category = this.props.category
    info.object.id = getContextId(info.object, idProperty)
    info.object.value = getContextValue(info.object, valueProperties)
    info.object.link = getContextLink(info.object)
    return info
  }

  renderLayers() {
    const { hoveredFeatures, clickedFeatures, color, layers } = this.props
    return layers.map((layer) => {
      if (layer.id === ContextLayerId.EEZBoundaries) {
        return new TileLayer<TileLayerProps>({
          id: `${this.id}-boundaries-layer`,
          data: layer.tilesUrl,
          loaders: [GFWMVTLoader],
          renderSubLayers: (props: any) => {
            const mvtSublayerProps = { ...props, ...getMVTSublayerProps(props) }
            return [
              new GeoJsonLayer(mvtSublayerProps, {
                id: `${props.id}-boundaries`,
                onViewportLoad: this._onViewportLoad,
                onTileDataLoading: this._onTileDataLoading,
                lineWidthMinPixels: 1,
                filled: false,
                getPolygonOffset: (params: { layerIndex: number }) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
                getLineColor: hexToDeckColor(this.props.color),
                lineWidthUnits: 'pixels',
                extensions: [
                  ...mvtSublayerProps.extensions,
                  new PathStyleExtension({ dash: true, highPrecisionDash: true }),
                ],
                getDashArray: (d: ContextFeature) => this.getDashArray(d),
              } as any),
            ]
          },
        })
      }
      return new TileLayer<TileLayerProps<ContextFeature>>({
        id: `${layer.id}-base-layer`,
        data: layer.tilesUrl,
        loaders: [GFWMVTLoader],
        onViewportLoad: this._onViewportLoad,
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
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsBackground, params),
              getFillColor: (d) => this.getFillColor(d as ContextFeature),
              updateTriggers: {
                getFillColor: [clickedFeatures, hoveredFeatures],
              },
            }),
            ...(layer.id !== ContextLayerId.EEZ && layer.id !== ContextLayerId.EEZBoundaries
              ? [
                  new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                    id: `${props.id}-lines`,
                    lineWidthMinPixels: 1,
                    filled: false,
                    getPolygonOffset: (params) =>
                      getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
                    getLineColor: hexToDeckColor(color),
                  }),
                ]
              : []),
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-highlight-lines`,
              lineWidthMinPixels: 0,
              lineWidthUnits: 'pixels',
              filled: false,
              visible:
                (hoveredFeatures && hoveredFeatures?.length > 0) ||
                (clickedFeatures && clickedFeatures?.length > 0),
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
              getLineWidth: (d) => this.getHighlightLineWidth(d as ContextFeature),
              getLineColor: COLOR_HIGHLIGHT_LINE,
              updateTriggers: {
                getLineWidth: [clickedFeatures, hoveredFeatures],
              },
            }),
          ]
        },
      })
    })
  }
}
