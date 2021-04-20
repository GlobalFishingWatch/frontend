import { Generators } from '@globalfishingwatch/layer-composer'
import {
  BackgroundGeneratorConfig,
  BasemapGeneratorConfig,
  GeneratorConfig,
  GlGeneratorConfig,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { FillLayer } from '@globalfishingwatch/mapbox-gl'
import { ContextLayer } from 'types'
import { AppState } from 'types/redux.types'
import { LANDMASS_OFFLINE_GEOJSON } from './constants'

export const MAP_BACKGROUND_COLOR = '#052555'
export const DEFAULT_LANDMASS_COLOR = '#274877'

export const BACKGROUND_LAYER = [
  {
    id: 'background',
    tileset: 'background',
    description: 'background',
    type: Generators.Type.Background,
    color: MAP_BACKGROUND_COLOR,
  } as BackgroundGeneratorConfig,
]
export const DEFAULT_DATAVIEWS: GeneratorConfig[] = [
  // When offline we serve this landmass layer as a backup
  // in case that not all tiles are cached
  {
    id: 'landmass_offline',
    type: Generators.Type.GL,
    sources: [
      {
        type: 'geojson',
        data: LANDMASS_OFFLINE_GEOJSON,
      },
    ],
    layers: [
      {
        type: 'fill',
        paint: {
          'fill-color': DEFAULT_LANDMASS_COLOR,
          'fill-opacity': 0.99, // This is a trick to allow proper rendering of MGL heatmap layers behind
        },
      } as FillLayer,
    ],
    metadata: {
      offline: true,
    },
  } as GlGeneratorConfig,
  // When online the tiles will be used (high res)
  {
    id: 'landmass',
    tileset: 'landmass',
    description: 'landmass',
    type: Generators.Type.Basemap,
    basemap: Generators.BasemapType.Default,
  } as BasemapGeneratorConfig,
]
export type ContextualLayerTypes = 'landmass'

export const CONTEXT_LAYERS_IDS: { [key in string]: ContextualLayerTypes } = {
  landmass: 'landmass',
}

export const CONTEXT_LAYERS: ContextLayer[] = [
  {
    id: CONTEXT_LAYERS_IDS.landmass,
    label: 'Landmass',
    color: '#6b67e5',
    description: 'Landmass',
  },
]

export const DEFAULT_WORKSPACE: AppState = {
  workspaceDataviews: DEFAULT_DATAVIEWS,
  zoom: 3,
  colorMode: 'all',
  minSpeed: 0,
  maxSpeed: 12,
  minElevation: -4000,
  maxElevation: 500,
  hiddenLayers: '',
  fromHour: 0,
  toHour: 24,
  latitude: -25.54035,
  fishingPositions: 15,
  longitude: -35.97144,
  project: '1',
  start: '2017-12-01T00:00:00.000Z',
  end: '2018-01-01T00:00:00.000Z',
  timebarMode: 'speed',
  filterMode: 'speed',
  minDistanceFromPort: 0,
  maxDistanceFromPort: 10000,
  importView: false,
  satellite: '',
}
