import { ThinningLevels } from '@globalfishingwatch/api-client'
import { DataviewInstance } from '@globalfishingwatch/api-types'
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
export const DEFAULT_BASEMAP_DATAVIEW_SLUG = 'basemap'
export const DEFAULT_VESSEL_DATAVIEWS = {
  'port-inspector': 'vv-vessel-tracks-and-events', // Vessel with port visits c2
  'insurance-underwriter': 'vv-vessel-tracks-and-events-c3-c4', // Vessel with port visits c3 and c4
}
export const DEFAULT_EEZ_DATAVIEW_SLUG = 'eez'
export const DEFAULT_MPA_DATAVIEW_SLUG = 'mpa'
export const DEFAULT_RFMO_DATAVIEW_SLUG = 'tuna-rfmo-areas'

export const dataviewInstances: DataviewInstance<GeneratorType>[] = [
  {
    id: 'basemap',
    dataviewId: DEFAULT_BASEMAP_DATAVIEW_SLUG,
  },
  {
    id: 'public-eez-areas',
    config: {
      color: '#069688',
      visible: true,
    },
    dataviewId: DEFAULT_EEZ_DATAVIEW_SLUG,
  },
  {
    id: 'public-wdpa-may-2021-marine',
    config: {
      color: '#1AFF6B',
      visible: true,
    },
    dataviewId: DEFAULT_MPA_DATAVIEW_SLUG,
  },
  {
    id: 'public-tuna-rfmo',
    config: {
      color: '#6b67e5',
      visible: true,
    },
    dataviewId: DEFAULT_RFMO_DATAVIEW_SLUG,
  },
]

export const vesselDataviewIds = Object.values(DEFAULT_VESSEL_DATAVIEWS)

export const DEFAULT_TRACK_COLOR = '#8DE9F6'
