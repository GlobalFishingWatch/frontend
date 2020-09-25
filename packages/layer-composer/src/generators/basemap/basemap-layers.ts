import { Layer, AnySourceImpl } from 'mapbox-gl'
import { BasemapType } from '../types'
import { Group, Dictionary } from '../../types'

export const DEFAULT_LANDMASS_COLOR = '#274777'

export const layers: Dictionary<Layer[]> = {
  [BasemapType.Satellite]: [
    {
      type: 'raster',
      id: BasemapType.Satellite,
      source: BasemapType.Satellite,
      metadata: {
        group: Group.Basemap,
      },
    },
  ],
  [BasemapType.Default]: [
    {
      id: 'bathymetry',
      type: 'raster',
      source: 'bathymetry',
      metadata: {
        group: Group.Basemap,
      },
    },
    {
      id: 'graticules_30',
      type: 'line',
      source: 'basemap_default',
      'source-layer': 'graticules',
      filter: ['==', ['get', 'thirties'], true],
      paint: {
        'line-color': 'white',
        'line-opacity': 0.2,
      },
      metadata: {
        group: Group.Basemap,
      },
    },
    {
      id: 'graticules_10',
      type: 'line',
      source: 'basemap_default',
      'source-layer': 'graticules',
      filter: ['==', ['get', 'tens'], true],
      minzoom: 2,
      paint: {
        'line-color': 'white',
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0, 4, 0.2],
      },
      metadata: {
        group: Group.Basemap,
      },
    },
    {
      id: 'graticules_1',
      type: 'line',
      source: 'basemap_default',
      'source-layer': 'graticules',
      minzoom: 5,
      paint: {
        'line-color': 'white',
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0, 7, 0.2],
      },
      metadata: {
        group: Group.Basemap,
      },
    },
    {
      id: 'countries',
      type: 'fill',
      source: 'basemap_default',
      'source-layer': 'countries',
      paint: {
        'fill-color': DEFAULT_LANDMASS_COLOR,
      },
      metadata: {
        group: Group.BasemapFill,
      },
    },
  ],
}

export const sources: Dictionary<Record<string, AnySourceImpl>> = {
  [BasemapType.Satellite]: {
    satellite: {
      tiles: [
        'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        'https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      ],
      type: 'raster',
      tileSize: 256,
    },
  },
  [BasemapType.Default]: {
    // eslint-disable-next-line @typescript-eslint/camelcase
    basemap_default: {
      type: 'vector',
      tiles: ['https://storage.googleapis.com/public-tiles/basemap/default/{z}/{x}/{y}.pbf'],
      maxzoom: 9,
      attribution:
        '<a href="https://www.naturalearthdata.com">Natural Earth</a> | <a href="https://gadm.org/">GADM</a>',
    },
    bathymetry: {
      type: 'raster',
      tiles: ['https://storage.googleapis.com/public-tiles/basemap/bathymetry/{z}/{x}/{y}.png'],
      maxzoom: 8,
      attribution: '<a href="https://visibleearth.nasa.gov/images/73963/bathymetry">NASA</a>',
    },
  },
}
