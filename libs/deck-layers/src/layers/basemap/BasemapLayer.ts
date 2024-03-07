import { BitmapLayer } from '@deck.gl/layers/typed'
import { CompositeLayer, LayerContext } from '@deck.gl/core/typed'
import { TileLayer as TileLayerWrongTyping } from '@deck.gl/geo-layers'
// import { TileLayer } from '@deck.gl/geo-layers/typed'
import { MVTLayer, MVTLayerProps } from '@deck.gl/geo-layers/typed'
import { LayerGroup, getLayerGroupOffset } from '../../utils'

const TileLayer = TileLayerWrongTyping as any

export enum BasemapType {
  Satellite = 'satellite',
  Default = 'basemap_default',
  Labels = 'basemap_labels',
}
export type BasemapLayerOwnProps = { basemap: BasemapType }
export type BaseMapLayerProps = Omit<MVTLayerProps, 'data'> & BasemapLayerOwnProps
export class BaseMapLayer extends CompositeLayer<BaseMapLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = {}

  layers: (typeof TileLayer | MVTLayer<BaseMapLayerProps>)[] = []

  initializeState(context: LayerContext): void {
    super.initializeState(context)
    this.state = {
      loaded: false,
    }
  }

  onViewportLoad = (tiles: any) => {
    this.setState({ loaded: true })
  }

  _getBathimetryLayer() {
    return new TileLayer({
      id: 'basemap-bathimetry',
      data: 'https://storage.googleapis.com/public-tiles/basemap/bathymetry/{z}/{x}/{y}.png',
      minZoom: 0,
      maxZoom: 9,
      onDataLoad: this.props.onDataLoad,
      getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Basemap, params),
      tileSize: 512,
      renderSubLayers: (props: any) => {
        const {
          bbox: { west, south, east, north },
        } = props.tile as any
        return new BitmapLayer(props, {
          data: undefined,
          image: props.data,
          bounds: [west, south, east, north],
        })
      },
    })
  }

  _getLandMassLayer() {
    return new MVTLayer<BaseMapLayerProps>({
      id: 'basemap-landmass',
      minZoom: 0,
      maxZoom: 8,
      onDataLoad: this.props.onDataLoad,
      onViewportLoad: this.onViewportLoad,
      getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.BasemapFill, params),
      getFillColor: [39, 70, 119],
      data: 'https://storage.googleapis.com/public-tiles/basemap/default/{z}/{x}/{y}.pbf',
    })
  }

  _getSatelliteLayer() {
    return new TileLayer({
      id: 'basemap-satellite',
      data: 'https://gateway.api.dev.globalfishingwatch.org/v3/tileset/sat/tile?x={x}&y={y}&z={z}',
      minZoom: 0,
      maxZoom: 9,
      onDataLoad: this.props.onDataLoad,
      onViewportLoad: this.onViewportLoad,
      getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Basemap, params),
      tileSize: 256,
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

  _getBasemap() {
    return this.props.basemap === 'basemap_default'
      ? this._getLandMassLayer()
      : this._getSatelliteLayer()
  }

  renderLayers() {
    this.layers = [this._getBathimetryLayer(), this._getBasemap()]
    return this.layers
  }
}
