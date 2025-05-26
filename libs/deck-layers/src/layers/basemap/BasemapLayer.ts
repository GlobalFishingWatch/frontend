import type { LayerContext } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { MVTLayerProps } from '@deck.gl/geo-layers'
import { MVTLayer, TileLayer } from '@deck.gl/geo-layers'
import { BitmapLayer } from '@deck.gl/layers'

import { getLayerGroupOffset, LayerGroup } from '../../utils'
import { PMTilesLayer } from '../pm-tiles/PMTilesLayer'

import type { _BasemapLayerProps } from './basemap.types'
import { BasemapType } from './basemap.types'

export type BaseMapLayerProps = Omit<MVTLayerProps, 'data'> & _BasemapLayerProps

const SATELLITE_SWITCH_ZOOM = 8

export class BaseMapLayer extends CompositeLayer<BaseMapLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = {
    basemap: BasemapType.Default,
  }

  initializeState(context: LayerContext): void {
    super.initializeState(context)
  }

  _getBathimetryLayer() {
    return new TileLayer({
      id: 'basemap-bathimetry',
      data: 'https://storage.googleapis.com/public-tiles/basemap/bathymetry/{z}/{x}/{y}.png',
      minZoom: 0,
      maxZoom: 9,
      onDataLoad: this.props.onDataLoad,
      getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Basemap, params),
      maxRequests: 100,
      debounceTime: 200,
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
      maxRequests: 100,
      debounceTime: 200,
      onDataLoad: this.props.onDataLoad,
      getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.BasemapFill, params),
      getFillColor: [39, 70, 119],
      getLineWidth: 0,
      data: 'https://storage.googleapis.com/public-tiles/basemap/default/{z}/{x}/{y}.pbf',
    })
  }

  _getSatelliteLayers() {
    return [
      new PMTilesLayer({
        id: 'basemap-satellite-pmtiles',
        data: 'https://storage.googleapis.com/public-tiles/satellite-basemap/satellite.pmtiles',
        maxRequests: 100,
        debounceTime: 800,
        maxZoom: SATELLITE_SWITCH_ZOOM,
        onDataLoad: this.props.onDataLoad,
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
      }),
      new TileLayer({
        id: 'basemap-satellite-google-tiles',
        data: 'https://gateway.api.dev.globalfishingwatch.org/v3/tileset/sat/tile?x={x}&y={y}&z={z}',
        maxRequests: 100,
        debounceTime: 800,
        minZoom: SATELLITE_SWITCH_ZOOM,
        onDataLoad: this.props.onDataLoad,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Basemap, params),
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
      }),
    ]
  }

  _getBasemap() {
    if (!this.props.visible) return []
    return !this.props.basemap || this.props.basemap === BasemapType.Default
      ? [this._getBathimetryLayer(), this._getLandMassLayer()]
      : [this._getSatelliteLayers()]
  }

  renderLayers() {
    return this._getBasemap()
  }
}
