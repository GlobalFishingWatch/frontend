import { BitmapLayer } from '@deck.gl/layers/typed'
import { CompositeLayer, LayersList } from '@deck.gl/core/typed'
import { TileLayer } from '@deck.gl/geo-layers'
import { MVTLayer, TileLayerProps, MVTLayerProps } from '@deck.gl/geo-layers/typed'
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
          tile: {
            bbox: { west, south, east, north },
          },
          ...rest
        } = props
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
