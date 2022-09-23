import { ThinningLevels } from '@globalfishingwatch/api-client'
import { DataviewInstanceV2 } from '@globalfishingwatch/api-types'
import {
  GeneratorType,
  GeneratorConfig,
  GlGeneratorConfig,
  BackgroundGeneratorConfig,
} from '@globalfishingwatch/layer-composer'
import { FillLayerSpecification } from '@globalfishingwatch/maplibre-gl'
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
export const DEFAULT_BASEMAP_DATAVIEW = 'blank-basemap'
export const DEFAULT_VESSEL_DATAVIEWS = {
  'port-inspector': 'vv-vessel-track-n-events', // Vessel with port visits c2
  'insurance-underwriter': 'vv-vessel-track-n-events-c3-c4', // Vessel with port visits c3 and c4
}
export const DEFAULT_EEZ_DATAVIEW = 'eez-land-n-boundaries'
export const DEFAULT_MPA_DATAVIEW = 'public-mpa-all'
export const DEFAULT_RFMO_DATAVIEW = 'public-tuna-rfmo'

export const dataviewInstances: DataviewInstanceV2<GeneratorType>[] = [
  {
    id: 'basemap',
    slug: DEFAULT_BASEMAP_DATAVIEW,
  },
  {
    id: 'public-eez-areas',
    config: {
      color: '#069688',
      visible: true,
    },
    slug: DEFAULT_EEZ_DATAVIEW,
  },
  {
    id: 'public-wdpa-may-2021-marine',
    config: {
      color: '#1AFF6B',
      visible: true,
    },
    slug: DEFAULT_MPA_DATAVIEW,
  },
  {
    id: 'public-tuna-rfmo',
    config: {
      color: '#6b67e5',
      visible: true,
    },
    slug: DEFAULT_RFMO_DATAVIEW,
  },
]

export const vesselDataviewSlugs = Object.values(DEFAULT_VESSEL_DATAVIEWS)

export const DEFAULT_TRACK_COLOR = '#8DE9F6'
