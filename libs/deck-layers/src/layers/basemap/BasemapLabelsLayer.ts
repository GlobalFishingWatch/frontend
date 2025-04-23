import { CompositeLayer } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import type { Feature, Point } from 'geojson'

import { API_GATEWAY, API_VERSION } from '@globalfishingwatch/api-client'
import { Locale } from '@globalfishingwatch/api-types'

import { getLayerGroupOffset, LayerGroup } from '../../utils'
import { PMTilesLayer } from '../pm-tiles'
import { LabelLayer } from '../vessel/LabelLayer'

import type { _BasemapLabelsLayerProps } from './basemap.types'

export type BaseMapLabelsLayerProps = Omit<TileLayerProps, 'data'> & _BasemapLabelsLayerProps

export const getLabelsTilesUrlByLocale = (locale: Locale = Locale.en) => {
  return `${API_GATEWAY}/${API_VERSION}/tileset/nslabels/tile?locale=${locale}&x={x}&y={y}&z={z}`
}

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
        maxZoom: 22,
        maxRequests: 100,
        debounceTime: 200,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Label, params),
        renderSubLayers: (props: any) => {
          return [
            new LabelLayer<Feature<Point, any>>({
              id: `${props.id}-labels`,
              data: props.data?.features,
              getText: (d) => d.properties?.[`name[${this.props.locale}]`] || d.properties?.name,
              getColor: [255, 255, 255],
              pickable: false,
              getSize: 12,
              getTextAnchor: 'middle',
              getAlignmentBaseline: 'center',
              fontFamily: 'Roboto',
              outlineWidth: 2,
              outlineColor: [0, 0, 0, 200],
              getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.Label, params),
              fontSettings: { sdf: true, smoothing: 0.2, buffer: 10 },
              sizeUnits: 'pixels',
            }),
          ]
        },
      }),
    ]
  }
}
