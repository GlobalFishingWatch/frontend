import { Dataview, DataviewCategory, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  EEZ_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_SLUG,
  FISHING_DATAVIEW_SLUG,
  GLOBAL_CHLOROPHYL_DATAVIEW_SLUG,
  GLOBAL_SALINITY_DATAVIEW_SLUG,
  GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG,
  GRATICULES_DATAVIEW_SLUG,
  HIGH_SEAS_DATAVIEW_SLUG,
  MPA_DATAVIEW_SLUG,
  PRESENCE_DATAVIEW_SLUG,
  PROTECTED_SEAS_DATAVIEW_SLUG,
  RFMO_DATAVIEW_SLUG,
  SAR_DATAVIEW_SLUG,
  VIIRS_MATCH_DATAVIEW_SLUG,
} from 'data/workspaces'
import libraryTranslations from '../public/locales/source/layer-library.json'

// Browser config for equal screenshots
// map at latitude=30&longitude=4&zoom=2
// browser zoom at 80%

export type LibraryLayerConfig = Omit<DataviewInstance, 'id'> & {
  id: keyof typeof libraryTranslations
  previewImageUrl: string
}

export type LibraryLayer = LibraryLayerConfig & {
  category: DataviewCategory
  dataview: Dataview
  previewImageUrl: string
}

export const LIBRARY_LAYERS: LibraryLayerConfig[] = [
  {
    id: 'fishing-effort',
    dataviewId: FISHING_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-AIS-apparent-fishing-effort-1.jpg',
    config: {
      color: '#00FFBC',
    },
  },
  {
    id: 'presence',
    dataviewId: PRESENCE_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-presence.jpg',
    config: {
      color: '#FF64CE',
    },
  },
  {
    id: 'viirs',
    dataviewId: VIIRS_MATCH_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-VIIRS.jpg',
    config: {
      color: '#FFEA00',
    },
  },
  {
    id: 'sar',
    dataviewId: SAR_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-SAR.jpg',
    config: {
      color: '#9CA4FF',
    },
  },
  {
    id: 'encounters',
    dataviewId: CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-encounters.jpg',
    config: {
      color: '',
    },
  },
  {
    id: 'water-temperature',
    dataviewId: GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-temperature-1.jpg',
    config: {
      color: '#FF6854',
    },
  },
  {
    id: 'water-salinity',
    dataviewId: GLOBAL_SALINITY_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-salinity-1.jpg',
    config: {
      color: '#9CA4FF',
    },
  },
  {
    id: 'chlorophyl',
    dataviewId: GLOBAL_CHLOROPHYL_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
    config: {
      color: '#FFEA00',
    },
  },
  {
    id: 'graticules',
    dataviewId: GRATICULES_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-graticules.jpg',
    config: {
      color: '#FCA26F',
    },
  },
  {
    id: 'eez',
    dataviewId: EEZ_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-eezs-2.jpg',
    config: {
      color: '#069688',
    },
  },
  {
    id: 'mpa',
    dataviewId: MPA_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-mpa.jpg',
    config: {
      color: '#1AFF6B',
    },
  },
  {
    id: 'protectedseas',
    dataviewId: PROTECTED_SEAS_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-protected-seas.jpg',
    config: {
      color: '#4184F4',
    },
  },
  {
    id: 'fao-major',
    dataviewId: FAO_AREAS_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-fao-2.jpg',
    config: {
      color: '#F09300',
    },
  },
  {
    id: 'rfmo',
    dataviewId: RFMO_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-rfmos.jpg',
    config: {
      color: '#8E24A9',
    },
  },
  {
    id: 'high-seas',
    dataviewId: HIGH_SEAS_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-high-seas.jpg',
    config: {
      color: '#4184F4',
    },
  },
]
