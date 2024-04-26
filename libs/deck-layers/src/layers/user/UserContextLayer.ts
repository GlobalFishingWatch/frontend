import { CompositeLayer, Color, DefaultProps, PickingInfo } from '@deck.gl/core'
import { GeoBoundingBox, TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import { GeoJsonProperties } from 'geojson'
import { PathStyleExtension } from '@deck.gl/extensions'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { DataviewType } from '@globalfishingwatch/api-types'
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
import { ContextFeature } from '../context'
import { getContextId } from '../context/context.utils'
import {
  UserContextLayerProps,
  UserContextPickingInfo,
  UserContextFeature,
  UserContextPickingObject,
} from './user.types'

type _UserContextLayerProps = TileLayerProps & UserContextLayerProps

const defaultProps: DefaultProps<_UserContextLayerProps> = {
  idProperty: 'gfw_id',
  valueProperties: [],
  maxRequests: 100,
  debounceTime: 500,
}

export class UserContextLayer<PropsT = {}> extends CompositeLayer<_UserContextLayerProps & PropsT> {
  static layerName = 'UserContextLayer'
  static defaultProps = defaultProps

  getHighlightLineWidth(d: UserContextFeature): number {
    const { highlightedFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!) ||
      getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!)
      ? 1
      : 0
  }

  getFillColor(d: UserContextFeature): Color {
    const { highlightedFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!)
      ? COLOR_HIGHLIGHT_FILL
      : COLOR_TRANSPARENT
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<UserContextFeature, { tile?: Tile2DHeader }>
  }): UserContextPickingInfo => {
    const { idProperty, valueProperties } = this.props
    const object = {
      ...transformTileCoordsToWGS84(
        info.object as UserContextFeature,
        info.tile!.bbox as GeoBoundingBox,
        this.context.viewport
      ),
      title: this.props.id,
      color: this.props.color,
      layerId: this.props.layers[0].id,
      datasetId: this.props.layers[0].datasetId,
      category: this.props.category,
      // TODO:deck remove this hardcoded type here and make a decision how to handle it
      type: DataviewType.UserContext,
    } as UserContextPickingObject
    info.object = transformTileCoordsToWGS84(
      info.object as UserContextFeature,
      info.tile!.bbox as GeoBoundingBox,
      this.context.viewport
    ) as UserContextPickingObject
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
    return features
  }

  getRenderedFeatures(maxFeatures: number | null = null): UserContextFeature[] {
    const features = this._pickObjects(maxFeatures)
    const featureCache = new Set()
    const renderedFeatures: UserContextFeature[] = []

    for (const f of features) {
      const featureId = getContextId(f.object as ContextFeature, this.props.idProperty)

      if (featureId === undefined) {
        // we have no id for the feature, we just add to the list
        renderedFeatures.push(f.object as UserContextFeature)
      } else if (!featureCache.has(featureId)) {
        // Add removing duplicates
        featureCache.add(featureId)
        renderedFeatures.push(f.object as UserContextFeature)
      }
    }

    return renderedFeatures
  }

  renderLayers() {
    const { highlightedFeatures, color, layers } = this.props
    return layers.map((layer) => {
      return new TileLayer<TileLayerProps<UserContextFeature>>({
        id: `${layer.id}-base-layer`,
        data: layer.tilesUrl,
        loaders: [GFWMVTLoader],
        onViewportLoad: this.props.onViewportLoad,
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
              getFillColor: (d) => this.getFillColor(d as UserContextFeature),
              updateTriggers: {
                getFillColor: [highlightedFeatures],
              },
            }),
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-lines`,
              lineWidthMinPixels: 1,
              filled: false,
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
              getLineColor: hexToDeckColor(color),
            }),
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-highlight-lines`,
              lineWidthMinPixels: 0,
              lineWidthUnits: 'pixels',
              filled: false,
              visible: highlightedFeatures && highlightedFeatures?.length > 0,
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
              getLineWidth: (d) => this.getHighlightLineWidth(d as UserContextFeature),
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
