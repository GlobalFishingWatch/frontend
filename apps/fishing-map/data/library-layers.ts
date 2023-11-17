import { DataviewCategory, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  EEZ_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_SLUG,
  FISHING_DATAVIEW_SLUG,
  GLOBAL_CHLOROPHYL_DATAVIEW_SLUG,
  GLOBAL_SALINITY_DATAVIEW_SLUG,
  GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG,
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

export type LibraryLayer = Omit<DataviewInstance, 'id'> & {
  id: keyof typeof libraryTranslations
  category?: DataviewCategory
  previewImageUrl: string
}

export const LIBRARY_LAYERS: LibraryLayer[] = [
  {
    id: 'fishing-effort',
    dataviewId: FISHING_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-AIS-apparent-fishing-effort-1.jpg',
  },
  {
    id: 'presence',
    dataviewId: PRESENCE_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-presence.jpg',
  },
  {
    id: 'viirs',
    dataviewId: VIIRS_MATCH_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-VIIRS.jpg',
  },
  {
    id: 'sar',
    dataviewId: SAR_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-SAR.jpg',
  },
  {
    id: 'water-temperature',
    dataviewId: GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-temperature-1.jpg',
  },
  {
    id: 'water-salinity',
    dataviewId: GLOBAL_SALINITY_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-salinity-1.jpg',
  },
  {
    id: 'chlorophyl',
    dataviewId: GLOBAL_CHLOROPHYL_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
  },
  {
    id: 'eez',
    dataviewId: EEZ_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-eezs-2.jpg',
    config: {
      color: '#F95E5E',
    },
  },
  {
    id: 'mpa',
    dataviewId: MPA_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-mpa.jpg',
  },
  {
    id: 'protectedseas',
    dataviewId: PROTECTED_SEAS_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-protected-seas.jpg',
  },
  {
    id: 'fao-major',
    dataviewId: FAO_AREAS_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-fao-2.jpg',
  },
  {
    id: 'rfmo',
    dataviewId: RFMO_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-rfmos.jpg',
  },
  {
    id: 'high-seas',
    dataviewId: HIGH_SEAS_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-high-seas.jpg',
  },
]
