import { DataviewInstance } from '@globalfishingwatch/api-types/dist'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  BackgroundGeneratorConfig,
  GeneratorConfig,
  GlGeneratorConfig,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { FillLayer } from '@globalfishingwatch/mapbox-gl'
import { WORKSPACE_ENV } from 'data/config'
import { LANDMASS_OFFLINE_GEOJSON } from 'data/constants'

export const MAP_BACKGROUND_COLOR = '#052555'
export const DEFAULT_LANDMASS_COLOR = '#274877'

export const BACKGROUND_LAYER: GeneratorConfig[] = [
  {
    id: 'background',
    tileset: 'background',
    description: 'background',
    type: Generators.Type.Background,
    color: MAP_BACKGROUND_COLOR,
  } as BackgroundGeneratorConfig,
]

export const OFFLINE_LAYERS: GeneratorConfig[] = [
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
]

// Using the same dataviews ids than fishing-map for consistency
export const DEFAULT_BASEMAP_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 90 : 173
export const DEFAULT_VESSEL_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 176 : 171

export const DEFAULT_EEZ_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 94 : 177
export const DEFAULT_MPA_NO_TAKE_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 99 : 179
export const DEFAULT_MPA_RESTRICTED_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 100 : 180
export const DEFAULT_MPA_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 98 : 176
export const DEFAULT_RFMO_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 95 : 175

export const dataviewInstances: DataviewInstance<Generators.Type>[] = [
  {
    id: 'basemap',
    dataviewId: DEFAULT_BASEMAP_DATAVIEW_ID,
  },
  {
    id: 'context-layer-eez',
    config: {
      color: '#069688',
      visible: true,
    },
    dataviewId: DEFAULT_EEZ_DATAVIEW_ID,
  },
  {
    id: 'context-layer-mpa-no-take',
    config: {
      color: '#F4511F',
      visible: false,
    },
    dataviewId: DEFAULT_MPA_NO_TAKE_DATAVIEW_ID,
  },
  {
    id: 'context-layer-mpa-restricted',
    config: {
      color: '#F09300',
      visible: false,
    },
    dataviewId: DEFAULT_MPA_RESTRICTED_DATAVIEW_ID,
  },
  {
    id: 'context-layer-mpa',
    config: {
      color: '#1AFF6B',
      visible: false,
    },
    dataviewId: DEFAULT_MPA_DATAVIEW_ID,
  },
  {
    id: 'context-layer-rfmo',
    config: {
      color: '#6b67e5',
      visible: false,
    },
    dataviewId: DEFAULT_RFMO_DATAVIEW_ID,
  },
]

export const vesselDataviewIds = [DEFAULT_VESSEL_DATAVIEW_ID]

export const DEFAULT_TRACK_COLOR = '#8DE9F6'

export enum ThinningLevels {
  Aggressive = 'aggressive',
  Default = 'default',
}

export const THINNING_LEVELS = {
  [ThinningLevels.Aggressive]: {
    distanceFishing: 1000,
    bearingValFishing: 5,
    changeSpeedFishing: 200,
    minAccuracyFishing: 50,
    distanceTransit: 2000,
    bearingValTransit: 5,
    changeSpeedTransit: 200,
    minAccuracyTransit: 100,
  },
  [ThinningLevels.Default]: {
    distanceFishing: 500,
    bearingValFishing: 1,
    changeSpeedFishing: 200,
    minAccuracyFishing: 30,
    distanceTransit: 500,
    bearingValTransit: 1,
    changeSpeedTransit: 200,
    minAccuracyTransit: 30,
  },
}

export const APP_THINNING =
  (process.env.APP_THINNING as ThinningLevels) || ThinningLevels.Aggressive
