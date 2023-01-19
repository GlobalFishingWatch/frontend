import { BitmapLayer } from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'

export const basemapLayer = new TileLayer({
  id: 'basemap',
  data: 'https://gateway.api.dev.globalfishingwatch.org/v2/tileset/sat/tile?x={x}&y={y}&z={z}',
  minZoom: 0,
  maxZoom: 12,
  zIndex: GROUP_ORDER.indexOf(Group.Basemap),
  // tileSize: 256,
  renderSubLayers: (props) => {
    const {
      bbox: { west, south, east, north },
    } = props.tile
    return new BitmapLayer(props, {
      data: null,
      image: props.data,
      tintColor: [21, 93, 206],
      bounds: [west, south, east, north],
    })
  },
})
