import type { LayerSpecification } from '@globalfishingwatch/maplibre-gl'

import { API_GATEWAY, API_GATEWAY_VERSION } from '../../config'
import type { Dictionary } from '../../types';
import { Group } from '../../types'
import { BasemapType } from '../types'

export const DEFAULT_LANDMASS_COLOR = '#274777'

export const layers: Dictionary<LayerSpecification[]> = {
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
      id: 'countries',
      type: 'fill',
      source: 'basemap_default',
      'source-layer': 'countries',
      paint: {
        'fill-color': DEFAULT_LANDMASS_COLOR,
        'fill-opacity': 0.99, // This is a trick to allow proper rendering of MGL heatmap layers behind
      },
      metadata: {
        group: Group.BasemapFill,
      },
    },
  ],
}

export const sources: Dictionary<Record<string, Partial<any>>> = {
  [BasemapType.Satellite]: {
    satellite: {
      tiles: [`${API_GATEWAY}/${API_GATEWAY_VERSION}/tileset/sat/tile?x={x}&y={y}&z={z}`],
      type: 'raster',
      tileSize: 256,
      attribution: 'Google',
    },
  },
  [BasemapType.Default]: {
    basemap_default: {
      type: 'vector',
      tiles: ['https://storage.googleapis.com/public-tiles/basemap/default/{z}/{x}/{y}.pbf'],
      maxzoom: 9,
      attribution:
        '<a href="https://www.naturalearthdata.com" target="_blank" rel="noopener noreferrer">Natural Earth</a> | <a href="https://gadm.org/" target="_blank" rel="noopener noreferrer">GADM</a>',
    },
    bathymetry: {
      type: 'raster',
      tiles: ['https://storage.googleapis.com/public-tiles/basemap/bathymetry/{z}/{x}/{y}.png'],
      maxzoom: 8,
      attribution:
        '<a href="https://visibleearth.nasa.gov/images/73963/bathymetry" target="_blank" rel="noopener noreferrer">NASA</a>',
    },
  },
}
