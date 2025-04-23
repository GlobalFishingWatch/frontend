import { CompositeLayer } from '@deck.gl/core'
import { CollisionFilterExtension } from '@deck.gl/extensions'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'

import { Locale } from '@globalfishingwatch/api-types'

import { getLayerGroupOffset, LayerGroup } from '../../utils'
import { PMTilesLayer } from '../pm-tiles'
import { LabelLayer } from '../vessel/LabelLayer'

import type { _BasemapLabelsLayerProps, BasemapLayerFeature } from './basemap.types'

export type BaseMapLabelsLayerProps = Omit<TileLayerProps, 'data'> & _BasemapLabelsLayerProps

export class BaseMapLabelsLayer extends CompositeLayer<BaseMapLabelsLayerProps> {
  static layerName = 'BasemapLabelsLayer'
  static defaultProps = {
    locale: Locale.en,
  }

  // getPickingInfo = ({
  //   info,
  // }: {
  //   info: PickingInfo<ContextFeature, { tile?: Tile2DHeader }>
  // }): PMTilePickingInfo => {
  //   if (!info.object) return { ...info, object: undefined }
  //   const { idProperty, valueProperties } = this.props
  //   const object = {
  //     title: this.props.id,
  //     color: this.props.color,
  //     layerId: this.props.id,
  //     // datasetId: this.props.layers[0].datasetId,
  //     category: this.props.category,
  //     id: getContextId(info.object as ContextFeature, idProperty),
  //     value: getContextValue(info.object as ContextFeature, valueProperties),
  //   } as PMTilePickingObject
  //   return {
  //     ...info,
  //     object,
  //     // object: getFeatureInFilter(object, this.props.layers[0].filters) ? object : undefined,
  //   }
  // }

  renderLayers() {
    if (!this.props.tilesUrl?.length) {
      return []
    }
    const Layer = (this.props.tilesUrl as string)?.includes('.pmtile')
      ? this.getSubLayerClass('pmTiles', PMTilesLayer)
      : this.getSubLayerClass('tile', TileLayer)

    return [
      new Layer({
        id: BaseMapLabelsLayer.layerName,
        data: this.props.tilesUrl,
        minZoom: 0,
        maxZoom: 12,
        maxRequests: 100,
        debounceTime: 200,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Label, params),
        renderSubLayers: (props: any) => {
          return [
            new LabelLayer<BasemapLayerFeature>({
              id: `${props.id}-labels`,
              data: props.data?.features,
              getText: (d) =>
                d.properties?.[`name_${this.props.locale as Locale}`] || d.properties?.name,
              pickable: false,
              extensions: [new CollisionFilterExtension()],
              backgroundPadding: [20, 20],
              getPixelOffset: [0, 0],
              collisionTestProps: { sizeScale: 3 },
              maxWidth: 10,
              getSize: (d) => {
                return 20 - d.properties.scalerank
              },
              getCollisionPriority: (d) => {
                return d.properties.populationRank - 1000
              },
            }),
          ]
        },
      }),
    ]
  }
}
