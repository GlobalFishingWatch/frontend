import { Layer } from 'mapbox-gl'
import { BasemapType } from '../types'
import { Group, Dictionary } from '../../types'

const BASEMAP_VECTOR_SOURCE = 'basemap_vector'
export const DEFAULT_LANDMASS_COLOR = '#274777'

export const layers: Dictionary<Layer> = {
  [BasemapType.Satellite]: {
    type: 'raster',
    id: BasemapType.Satellite,
    source: BasemapType.Satellite,
    metadata: {
      group: Group.Basemap,
    },
  },
  [BasemapType.Landmass]: {
    type: 'fill',
    id: BasemapType.Landmass,
    source: BASEMAP_VECTOR_SOURCE,
    'source-layer': BasemapType.Landmass,
    metadata: {
      group: Group.BasemapFill,
    },
    paint: {
      'fill-color': DEFAULT_LANDMASS_COLOR,
      'fill-opacity': 0.99,
    },
  },
  [BasemapType.Graticules]: {
    type: 'line',
    id: BasemapType.Graticules,
    source: BASEMAP_VECTOR_SOURCE,
    'source-layer': 'graticules',
    metadata: {
      group: Group.Basemap,
    },
    paint: {
      'line-color': '#ffffff',
      'line-opacity': 0.2,
      'line-width': 0.5,
    },
  },
}

export const sources: Dictionary<any> = {
  [BasemapType.Satellite]: {
    tiles: [
      'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      'https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    ],
    type: 'raster',
    tileSize: 256,
  },
  [BASEMAP_VECTOR_SOURCE]: {
    type: 'vector',
    tiles: ['https://storage.googleapis.com/public-tiles/tiles-basemap/{z}/{x}/{y}.pbf'],
    maxzoom: 8,
  },
}
