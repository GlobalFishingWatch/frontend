import { BitmapLayer } from '@deck.gl/layers/typed'
import { CompositeLayer } from '@deck.gl/core/typed'
import { TileLayer } from '@deck.gl/geo-layers'
import { MVTLayer, TileLayerProps, MVTLayerProps } from '@deck.gl/geo-layers/typed'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'

export type BaseMapLayerProps = TileLayerProps & MVTLayerProps
export class BaseMap extends CompositeLayer<BaseMapLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = {}

  layers = []

  _getBathimetryLayer() {
    return new TileLayer({
      id: 'basemap-bathimetry',
      data: 'https://storage.googleapis.com/public-tiles/basemap/bathymetry/{z}/{x}/{y}.png',
      minZoom: 0,
      maxZoom: 9,
      onDataLoad: this.props.onDataLoad,
      zIndex: GROUP_ORDER.indexOf(Group.Basemap),
      tileSize: 256,
      renderSubLayers: (props): any => {
        const {
          bbox: { west, south, east, north },
        } = props.tile
        return new BitmapLayer(props, {
          // data: null,
          image: props.data,
          bounds: [west, south, east, north],
        })
      },
    } as any)
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
    // this.layers = [this._getBathimetryLayer(), this._getLandMassLayer()]
    return this._getLandMassLayer()
  }
}
