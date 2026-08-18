import { PATH_BASENAME } from 'data/map/config'
import { VIIRS_DATAVIEW_INSTANCE_ID, VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID } from 'data/map/dataviews'
import type { LibraryLayerConfig } from 'data/map/layer-library/layers.types'
import {
  SAR_DATAVIEW_SLUG,
  SENTINEL2_DATAVIEW_SLUG,
  VIIRS_MATCH_DATAVIEW_SLUG,
  VIIRS_MATCH_SKYLIGHT_DATAVIEW_SLUG,
} from 'data/map/workspaces'

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
]
