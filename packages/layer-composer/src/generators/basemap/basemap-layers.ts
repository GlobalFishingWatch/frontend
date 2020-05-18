import { Layer, AnySourceImpl } from 'mapbox-gl'

import { Group, Dictionary } from '../../types'

export const BASEMAPS = {
  Satellite: 'satellite',
  Landmass: 'landmass',
  Graticules: 'graticules',
}

const BASEMAP_VECTOR_SOURCE = 'basemap_vector'
export const DEFAULT_LANDMASS_COLOR = '#274777'

export const layers: Dictionary<Layer> = {
  [BASEMAPS.Satellite]: {
    type: 'raster',
    id: BASEMAPS.Satellite,
    source: BASEMAPS.Satellite,
    metadata: {
      group: Group.Basemap,
    },
  },
  [BASEMAPS.Landmass]: {
    type: 'fill',
    id: BASEMAPS.Landmass,
    source: BASEMAP_VECTOR_SOURCE,
    'source-layer': BASEMAPS.Landmass,
    metadata: {
      group: Group.BasemapFill,
    },
    paint: {
      'fill-color': DEFAULT_LANDMASS_COLOR,
      'fill-opacity': 0.99,
    },
  },
  [BASEMAPS.Graticules]: {
    type: 'line',
    id: BASEMAPS.Graticules,
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

export const sources: Dictionary<AnySourceImpl> = {
  [BASEMAPS.Satellite]: {
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
