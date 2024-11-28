import { PATH_BASENAME } from 'data/config'
import type { LibraryLayerConfig } from 'data/layer-library/layers.types'
import {
  EEZ_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_SLUG,
  FIXED_SAR_INFRASTRUCTURE,
  GRATICULES_DATAVIEW_SLUG,
  HIGH_SEAS_DATAVIEW_SLUG,
  MPA_DATAVIEW_SLUG,
  PROTECTED_SEAS_DATAVIEW_SLUG,
  RFMO_DATAVIEW_SLUG,
} from 'data/workspaces'

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
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/offshore-fixed-infrastructure.png`,
    config: {
      color: '#8E24A9',
    },
  },
]
