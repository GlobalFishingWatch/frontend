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

// Browser config for equal screenshots
// map at latitude=30&longitude=4&zoom=2
// browser zoom at 80%

export const LIBRARY_LAYERS: {
  datasetId: string
  dataviewSlug: string
  previewImageUrl: string
}[] = [
  {
    datasetId: 'public-global-fishing-effort',
    dataviewSlug: FISHING_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-AIS-apparent-fishing-effort-1.jpg',
  },
  {
    datasetId: 'public-global-presence',
    dataviewSlug: PRESENCE_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-presence.jpg',
  },
  {
    datasetId: 'public-ais-presence-viirs-match',
    dataviewSlug: VIIRS_MATCH_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-VIIRS.jpg',
  },
  {
    datasetId: 'public-global-sar-presence',
    dataviewSlug: SAR_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-SAR.jpg',
  },
  {
    datasetId: 'public-global-water-temperature',
    dataviewSlug: GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-temperature-1.jpg',
  },
  {
    datasetId: 'public-global-water-salinity',
    dataviewSlug: GLOBAL_SALINITY_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-salinity-1.jpg',
  },
  {
    datasetId: 'public-global-chlorophyl',
    dataviewSlug: GLOBAL_CHLOROPHYL_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-chlorophyl-1.jpg',
  },
  {
    datasetId: 'public-eez-areas',
    dataviewSlug: EEZ_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-eezs-2.jpg',
  },
  {
    datasetId: 'public-mpa-all',
    dataviewSlug: MPA_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-mpa.jpg',
  },
  {
    datasetId: 'public-protectedseas',
    dataviewSlug: PROTECTED_SEAS_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-protected-seas.jpg',
  },
  {
    datasetId: 'public-fao-major',
    dataviewSlug: FAO_AREAS_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-fao-2.jpg',
  },
  {
    datasetId: 'public-rfmo',
    dataviewSlug: RFMO_DATAVIEW_SLUG,
    previewImageUrl: 'https://globalfishingwatch.org/wp-content/uploads/layer-library-rfmos.jpg',
  },
  {
    datasetId: 'public-high-seas',
    dataviewSlug: HIGH_SEAS_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-high-seas.jpg',
  },
]
