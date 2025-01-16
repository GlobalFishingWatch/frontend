import { API_GATEWAY, API_GATEWAY_VERSION } from "@globalfishingwatch/layer-composer"
import type { LayerSpecification } from "@globalfishingwatch/maplibre-gl"

import { NSLABELS_ENDOPOINT } from "data/config"

const style = {
  version: 8,
  sprite: 'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-sprites/master/out/sprites',
  glyphs:
    'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-glyphs/master/_output/{fontstack}/{range}.pbf?raw=true',
  sources: {
    basemap_default: {
      type: 'vector',
      tiles: ['https://storage.googleapis.com/public-tiles/basemap/default/{z}/{x}/{y}.pbf'],
      maxzoom: 9,
      attribution:
        '<a href="https://www.naturalearthdata.com" target="_blank" rel="noopener noreferrer">Natural Earth</a> | <a href="https://gadm.org/" target="_blank" rel="noopener noreferrer">GADM</a>',
    },
    satellite: {
      tiles: [`${API_GATEWAY}/${API_GATEWAY_VERSION}/tileset/sat/tile?x={x}&y={y}&z={z}`],
      type: 'raster',
      tileSize: 256,
      attribution: 'Google',
    },
    location_labels: {
      type: 'raster',
      tiles: [NSLABELS_ENDOPOINT],
      tileSize: 256
    },
    bathymetry: {
      type: 'raster',
      tiles: ['https://storage.googleapis.com/public-tiles/basemap/bathymetry/{z}/{x}/{y}.png'],
      maxzoom: 8,
      attribution:
        '<a href="https://visibleearth.nasa.gov/images/73963/bathymetry" target="_blank" rel="noopener noreferrer">NASA</a>',
    },
  },
  layers: [
    {
      id: 'bathymetry',
      type: 'raster',
      source: 'bathymetry',
      metadata: {
        group: 'basemap',
        generatorId: 'basemap',
        generatorType: 'BASEMAP',
      },
      layout: {
        visibility: 'visible',
      },
    },
    {
      id: 'graticules_30',
      type: 'line',
      source: 'basemap_default',
      'source-layer': 'graticules',
      metadata: {
        group: 'basemap',
        generatorId: 'basemap',
        generatorType: 'BASEMAP',
      },
      filter: ['==', ['get', 'thirties'], true],
      layout: {
        visibility: 'visible',
      },
      paint: {
        'line-color': 'white',
        'line-opacity': 0.2,
      },
    },
    {
      id: 'satellite',
      type: 'raster',
      source: 'satellite',

    },
    {
      id: 'location_labels',
      type: 'raster',
      source: 'location_labels',
      maxzoom: 24,
    },
    {
      id: 'graticules_10',
      type: 'line',
      source: 'basemap_default',
      'source-layer': 'graticules',
      metadata: {
        group: 'basemap',
        generatorId: 'basemap',
        generatorType: 'BASEMAP',
      },
      minzoom: 2,
      filter: ['==', ['get', 'tens'], true],
      layout: {
        visibility: 'visible',
      },
      paint: {
        'line-color': 'white',
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0, 4, 0.2],
      },
    },
    {
      id: 'graticules_1',
      type: 'line',
      source: 'basemap_default',
      'source-layer': 'graticules',
      metadata: {
        group: 'basemap',
        generatorId: 'basemap',
        generatorType: 'BASEMAP',
      },
      minzoom: 5,
      layout: {
        visibility: 'visible',
      },
      paint: {
        'line-color': 'white',
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0, 7, 0.2],
      },
    },
    {
      id: 'countries',
      type: 'fill',
      source: 'basemap_default',
      'source-layer': 'countries',
      metadata: {
        group: 'basemapFill',
        generatorId: 'basemap',
        generatorType: 'BASEMAP',
      },
      layout: {
        visibility: 'none',
      },
      paint: {
        'fill-color': '#274777',
        'fill-opacity': 0.99,
      },
    },
    {
      id: 'subareas',
      type: 'fill',
      source: 'areaLayer',
      layout: {},
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': 0.4
      }
    },
    {
      id: 'portPoints',
      type: 'circle',
      source: 'pointsLayer',
      layout: {
        visibility: 'visible',
      },
      paint: {
        'circle-color': ['get', 'color'],
        'circle-stroke-width': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          5,
          1
        ],
        'circle-stroke-color': [
          'case',
          ['boolean', ['get', 'selected'], false],
          '#ffffff',
          ['boolean', ['feature-state', 'hover'], false],
          '#ffffff',
          '#002358',
        ],
      },
    } as LayerSpecification,

  ],
}
export default style
