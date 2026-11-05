import {
  PLANET_DATAVIEW_SLUG,
  SAR_DATAVIEW_SLUG,
  SENTINEL2_DATAVIEW_SLUG,
  VIIRS_DATAVIEW_INSTANCE_ID,
  VIIRS_MATCH_DATAVIEW_SLUG,
  VIIRS_MATCH_SKYLIGHT_DATAVIEW_SLUG,
  VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID,
} from '@platform/config/map/dataviews'

import { PATH_BASENAME } from 'data/map/config'
import type { LibraryLayerConfig } from 'data/map/layer-library/layers.types'

export const LAYERS_LIBRARY_DETECTIONS: LibraryLayerConfig[] = [
  {
    id: VIIRS_DATAVIEW_INSTANCE_ID,
    dataviewId: VIIRS_MATCH_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/VIIRS.jpg`,
    config: {
      color: '#FFEA00',
      colorRamp: 'yellow',
    },
  },
  {
    id: VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID,
    dataviewId: VIIRS_MATCH_SKYLIGHT_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/VIIRS-skylight.jpg`,
    config: {
      color: '#FFEA00',
      colorRamp: 'yellow',
    },
  },
  {
    id: 'sar',
    dataviewId: SAR_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/SAR.jpg`,
    config: {
      color: '#9CA4FF',
      colorRamp: 'lilac',
    },
  },
  {
    id: 'sentinel2',
    dataviewId: SENTINEL2_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/sentinel2.jpg`,
    config: {
      color: '#00EEFF',
      colorRamp: 'sky',
    },
  },
  {
    id: 'planet',
    dataviewId: PLANET_DATAVIEW_SLUG,
    // TODO: replace with a Planet-specific preview image
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/sentinel2.jpg`,
    datasetPermission: 'private-global-planet-presence:v5.0',
    config: {
      color: '#00EEFF',
      colorRamp: 'sky',
    },
  },
]
