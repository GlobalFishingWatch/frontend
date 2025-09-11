import type { LayerContext } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { MVTLayerProps } from '@deck.gl/geo-layers'
import { BitmapLayer } from '@deck.gl/layers'

import { getLayerGroupOffset, LayerGroup } from '../../utils'
import { PMTilesLayer } from '../pm-tiles/PMTilesLayer'

export type BaseMapImageLayerProps = Omit<MVTLayerProps, 'data'> & {
  tilesUrl: string
  maxZoom?: number
  tileSize?: number
}

export class BaseMapImageLayer extends CompositeLayer<BaseMapImageLayerProps> {
  static layerName = 'BaseMapImageLayer'
  static defaultProps = {
    tilesUrl: '',
    maxZoom: 12,
    tileSize: 256,
  }

  initializeState(context: LayerContext): void {
    super.initializeState(context)
  }

  renderLayers() {
    const { tilesUrl, maxZoom = 12, tileSize = 256 } = this.props
    if (!tilesUrl) {
      return []
    }
    return new PMTilesLayer({
      id: `${this.props.id}-basemap-image`,
      data: this.props.tilesUrl,
      maxRequests: 100,
      debounceTime: 800,
      maxZoom,
      tileSize,
      getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.BasemapImage, params),
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
