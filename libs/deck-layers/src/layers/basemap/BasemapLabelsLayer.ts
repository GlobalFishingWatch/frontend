import { BitmapLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'
import { TileLayer } from '@deck.gl/geo-layers'
import { MVTLayerProps } from '@deck.gl/geo-layers'
import { Locale } from '@globalfishingwatch/api-types'
import { API_GATEWAY, API_VERSION } from '@globalfishingwatch/api-client'
import { LayerGroup, getLayerGroupOffset } from '../../utils'
import { _BasemapLabelsLayerProps } from './basemap.types'

export type BaseMapLabelsLayerProps = Omit<MVTLayerProps, 'data'> & _BasemapLabelsLayerProps

export const getLabelsTilesUrlByLocale = (locale: Locale = Locale.en) => {
  return `${API_GATEWAY}/${API_VERSION}/tileset/nslabels/tile?locale=${locale}&x={x}&y={y}&z={z}`
}

export class BaseMapLabelsLayer extends CompositeLayer<BaseMapLabelsLayerProps> {
  static layerName = 'BasemapLabelsLayer'
  static defaultProps = {
    locale: Locale.en,
  }

  renderLayers() {
    return new TileLayer({
      id: BaseMapLabelsLayer.layerName,
      data: getLabelsTilesUrlByLocale(this.props.locale),
      minZoom: 0,
      maxZoom: 9,
      maxRequests: 100,
      debounceTime: 200,
      tileSize: 256,
      getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Label, params),
      renderSubLayers: (props: any) => {
        const {
          bbox: { west, south, east, north },
        } = props.tile
        return new BitmapLayer(props, {
          data: undefined,
          image: props.data,
          bounds: [west, south, east, north],
        })
      },
    })
  }
}
