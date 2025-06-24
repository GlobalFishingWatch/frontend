import { DataviewCategory } from '@globalfishingwatch/api-types'

import { IS_DEVELOPMENT_ENV, PATH_BASENAME } from 'data/config'
import type { LibraryLayerConfig } from 'data/layer-library/layers.types'
import {
  EEZ_AREAS_12NM_DATAVIEW_SLUG,
  EEZ_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_SLUG,
  FIXED_SAR_INFRASTRUCTURE,
  GFCM_FAO_DATAVIEW_SLUG,
  GRATICULES_DATAVIEW_SLUG,
  HIGH_SEAS_DATAVIEW_SLUG,
  HIGH_SEAS_POCKETS_DATAVIEW_SLUG,
  MPA_DATAVIEW_SLUG,
  MPATLAS_DATAVIEW_SLUG,
  PAA_DUKE_DATAVIEW_SLUG,
  PORTS_DATAVIEW_SLUG,
  PROTECTED_SEAS_DATAVIEW_SLUG,
  RFMO_DATAVIEW_SLUG,
  TEMPLATE_CONTEXT_DATAVIEW_SLUG,
} from 'data/workspaces'
import { PORTS_LAYER_ID } from 'features/map/map.config'

export const OFFSHORE_FIXED_INFRASTRUCTURE_DATAVIEW_ID = 'offshore-fixed-infrastructure'

export const LAYERS_LIBRARY_CONTEXT: LibraryLayerConfig[] = [
  {
    id: 'graticules',
    dataviewId: GRATICULES_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/graticules.jpg`,
    config: {
      color: '#FCA26F',
    },
  },
  {
    id: 'eez',
    dataviewId: EEZ_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/eezs.jpg`,
    config: {
      color: '#069688',
    },
  },
  {
    id: 'mpa',
    dataviewId: MPA_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/mpa.jpg`,
    config: {
      color: '#1AFF6B',
    },
  },
  {
    id: 'protectedseas',
    dataviewId: PROTECTED_SEAS_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/protected-seas.jpg`,
    config: {
      color: '#4184F4',
    },
  },
  {
    id: 'mpatlas',
    dataviewId: MPATLAS_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/mpaatlas.jpg`,
    config: {
      color: '#F95E5E',
      filters: {
        establishment_stage: ['actively managed', 'implemented'],
        mpaguide_protection_level: ['full', 'high'],
      },
    },
  },
  {
    id: 'fao-major',
    dataviewId: FAO_AREAS_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/fao.jpg`,
    config: {
      color: '#F09300',
    },
  },
  {
    id: 'rfmo',
    dataviewId: RFMO_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/rfmos.jpg`,
    config: {
      color: '#8E24A9',
    },
  },
  {
    id: 'high-seas',
    dataviewId: HIGH_SEAS_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/high-seas.jpg`,
    config: {
      color: '#4184F4',
    },
  },
  {
    id: OFFSHORE_FIXED_INFRASTRUCTURE_DATAVIEW_ID,
    dataviewId: FIXED_SAR_INFRASTRUCTURE,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/offshore-fixed-infrastructure.jpg`,
    config: {
      color: '#8E24A9',
    },
  },
  ...(IS_DEVELOPMENT_ENV
    ? ([
        {
          id: PORTS_LAYER_ID,
          dataviewId: PORTS_DATAVIEW_SLUG,
          previewImageUrl: `${PATH_BASENAME}/images/layer-library/ports.jpg`,
          config: {
            color: '#9AEEFF',
          },
        },
        {
          id: 'eez-areas-12nm',
          dataviewId: EEZ_AREAS_12NM_DATAVIEW_SLUG,
          previewImageUrl: `${PATH_BASENAME}/images/layer-library/eezs-12nm.jpg`,
          config: {
            color: '#069688',
          },
        },
        {
          id: 'high-seas-pockets',
          dataviewId: HIGH_SEAS_POCKETS_DATAVIEW_SLUG,
          previewImageUrl: `${PATH_BASENAME}/images/layer-library/high-seas-pockets.jpg`,
          config: {
            color: '#4184F4',
          },
        },
        {
          id: 'paa-duke',
          dataviewId: PAA_DUKE_DATAVIEW_SLUG,
          previewImageUrl: `${PATH_BASENAME}/images/layer-library/paa-duke.jpg`,
          config: {
            color: '#4184F4',
          },
        },
        {
          id: 'gfcm-fao',
          dataviewId: GFCM_FAO_DATAVIEW_SLUG,
          previewImageUrl: `${PATH_BASENAME}/images/layer-library/gfcm-fao.jpg`,
          config: {
            color: '#8E24A9',
          },
        },
        {
          id: 'dsm-isa-leasing-areas',
          dataviewId: TEMPLATE_CONTEXT_DATAVIEW_SLUG,
          previewImageUrl: `${PATH_BASENAME}/images/layer-library/deep-sea-mining.jpeg`,
          category: DataviewCategory.Context,
          config: {
            color: '#8E24A9',
          },
          datasetsConfig: [
            {
              datasetId: 'public-isa-layers',
              params: [],
              endpoint: 'context-tiles',
            },
          ],
        },
      ] as LibraryLayerConfig[])
    : []),
]
