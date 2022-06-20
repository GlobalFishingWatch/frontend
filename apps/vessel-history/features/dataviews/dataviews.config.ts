import { DataviewInstance } from '@globalfishingwatch/api-types'
import {
  GeneratorType,
  GeneratorConfig,
  GlGeneratorConfig,
  BackgroundGeneratorConfig,
} from '@globalfishingwatch/layer-composer'
import { FillLayerSpecification } from '@globalfishingwatch/maplibre-gl'
import { WORKSPACE_ENV } from 'data/config'
import { LANDMASS_OFFLINE_GEOJSON } from 'data/constants'

export const MAP_BACKGROUND_COLOR = '#052555'
export const DEFAULT_LANDMASS_COLOR = '#274877'

export const BACKGROUND_LAYER: GeneratorConfig[] = [
  {
    id: 'background',
    tileset: 'background',
    description: 'background',
    type: GeneratorType.Background,
    color: MAP_BACKGROUND_COLOR,
  } as BackgroundGeneratorConfig,
]

export const OFFLINE_LAYERS: GeneratorConfig[] = [
  // When offline we serve this landmass layer as a backup
  // in case that not all tiles are cached
  {
    id: 'landmass_offline',
    type: GeneratorType.GL,
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
      } as FillLayerSpecification,
    ],
    metadata: {
      offline: true,
    },
  } as GlGeneratorConfig,
]

// Using the same dataviews ids than fishing-map for consistency
export const DEFAULT_BASEMAP_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 90 : 173
// TODO BEFORE MERGING REPLACE THE 294 WITH THE ORIGINAL DATAVIEW ID => 176
export const DEFAULT_VESSEL_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 294 : 268

export const DEFAULT_EEZ_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 94 : 177
export const DEFAULT_MPA_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 98 : 176
export const DEFAULT_RFMO_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 95 : 175

export const dataviewInstances: DataviewInstance<GeneratorType>[] = [
  {
    id: 'basemap',
    dataviewId: DEFAULT_BASEMAP_DATAVIEW_ID,
  },
  {
    id: 'public-eez-areas',
    config: {
      color: '#069688',
      visible: true,
    },
    dataviewId: DEFAULT_EEZ_DATAVIEW_ID,
  },
  {
    id: 'public-wdpa-may-2021-marine',
    config: {
      color: '#1AFF6B',
      visible: false,
    },
    dataviewId: DEFAULT_MPA_DATAVIEW_ID,
  },
  {
    id: 'public-tuna-rfmo',
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
    'distance-fishing': 1000,
    'bearing-val-fishing': 5,
    'change-speed-fishing': 200,
    'min-accuracy-fishing': 50,
    'distance-transit': 2000,
    'bearing-val-transit': 5,
    'change-speed-transit': 200,
    'min-accuracy-transit': 100,
  },
  [ThinningLevels.Default]: {
    'distance-fishing': 500,
    'bearing-val-fishing': 1,
    'change-speed-fishing': 200,
    'min-accuracy-fishing': 30,
    'distance-transit': 500,
    'bearing-val-transit': 1,
    'change-speed-transit': 200,
    'min-accuracy-transit': 30,
  },
}

export const APP_THINNING =
  (process.env.APP_THINNING as ThinningLevels) || ThinningLevels.Aggressive
