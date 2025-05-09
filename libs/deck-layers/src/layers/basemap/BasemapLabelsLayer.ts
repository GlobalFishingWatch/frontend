import type { Color } from '@deck.gl/core'
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

  _getColor(d: BasemapLayerFeature): Color {
    if (d.properties?.type === 'sea') {
      return [7, 119, 142]
    } else if (d.properties?.type === 'place') {
      return [106, 152, 184]
    } else if (d.properties?.type === 'state') {
      return [120, 168, 200]
    }
    // country
    return [157, 203, 226]
  }

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
        locale: this.props.locale,
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
              transitions: {},
              getPixelOffset: (d) => {
                if (
                  this.context.viewport.zoom < 5 &&
                  d.properties.type === 'country' &&
                  d.geometry.coordinates[0] + Math.min(d.properties.name?.length, 8) / 2 >= 175
                ) {
                  // Fixes countries antimeridian cutted off names
                  return [-d.properties.name?.length * 3, 0]
                }
                return [0, 0]
              },
              collisionTestProps: { sizeScale: 5 },
              getColor: (d) => this._getColor(d),
              maxWidth: 8,
              getSize: (d) => d.properties?.size,
              getCollisionPriority: (d) => d.properties?.populationRank || 0,
              updateTriggers: {
                getText: [this.props.locale],
              },
            }),
          ]
        },
      }),
    ]
  }
}
