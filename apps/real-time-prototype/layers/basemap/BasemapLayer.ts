import type { LayersList } from '@deck.gl/core';
import { CompositeLayer } from '@deck.gl/core'
import type { GeoBoundingBox, MVTLayerProps,TileLayerProps } from '@deck.gl/geo-layers';
import { MVTLayer,TileLayer  } from '@deck.gl/geo-layers'
import { BitmapLayer } from '@deck.gl/layers'

import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'

export type BaseMapLayerProps = TileLayerProps & MVTLayerProps & { onDataLoad: () => void }
export class BaseMap extends CompositeLayer<BaseMapLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = {}

  _getBathimetryLayer() {
    return new TileLayer<BitmapLayer>({
      id: 'basemap-bathimetry',
      data: 'https://storage.googleapis.com/public-tiles/basemap/bathymetry/{z}/{x}/{y}.png',
      minZoom: 0,
      maxZoom: 9,
      onDataLoad: this.props.onDataLoad,
      tileSize: 256,
      renderSubLayers: (props): any => {
        const {
          data,
          tile: { bbox },
          ...rest
        } = props
        const { west, south, east, north } = bbox as GeoBoundingBox
        return new BitmapLayer({
          ...rest,
          image: data,
          bounds: [west, south, east, north],
        })
      },
    })
  }

  _getLandMassLayer() {
    return new MVTLayer({
      id: 'basemap-landmass',
      minZoom: 0,
      maxZoom: 8,
      onDataLoad: this.props.onDataLoad,
      zIndex: GROUP_ORDER.indexOf(Group.BasemapFill),
      getFillColor: [39, 70, 119],
      data: 'https://storage.googleapis.com/public-tiles/basemap/default/{z}/{x}/{y}.pbf',
    })
  }

  renderLayers() {
    return [this._getBathimetryLayer(), this._getLandMassLayer()] as LayersList
  }
}
