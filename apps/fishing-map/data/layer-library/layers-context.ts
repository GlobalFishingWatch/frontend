import { LibraryLayerConfig } from 'data/layer-library/layers.types'
import {
  EEZ_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_SLUG,
  GRATICULES_DATAVIEW_SLUG,
  HIGH_SEAS_DATAVIEW_SLUG,
  MPA_DATAVIEW_SLUG,
  PROTECTED_SEAS_DATAVIEW_SLUG,
  RFMO_DATAVIEW_SLUG,
  TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
} from 'data/workspaces'

export const LAYERS_LIBRARY_CONTEXT: LibraryLayerConfig[] = [
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
  {
    id: 'marine-ecoregions',
    dataviewId: TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-high-seas.jpg',
    config: {
      color: '#4184F4',
    },
    datasetsConfig: [
      {
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-marine-ecoregions',
      },
    ],
  },
  {
    id: 'mangroves',
    dataviewId: TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-high-seas.jpg',
    config: {
      color: '#4184F4',
    },
    datasetsConfig: [
      {
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-mangroves',
      },
    ],
  },
  {
    id: 'seamounts',
    dataviewId: TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-high-seas.jpg',
    config: {
      color: '#4184F4',
    },
    datasetsConfig: [
      {
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-seamounts',
      },
    ],
  },
  {
    id: 'coral-reefs',
    dataviewId: TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-high-seas.jpg',
    config: {
      color: '#4184F4',
    },
    datasetsConfig: [
      {
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-coral-reefs',
      },
    ],
  },
  {
    id: 'seagrasses',
    dataviewId: TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
    previewImageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/layer-library-high-seas.jpg',
    config: {
      color: '#4184F4',
    },
    datasetsConfig: [
      {
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-seagrasses',
      },
    ],
  },
]
