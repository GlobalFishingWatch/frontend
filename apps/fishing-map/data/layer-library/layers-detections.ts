import { PATH_BASENAME } from 'data/config'
import type { LibraryLayerConfig } from 'data/layer-library/layers.types'
import {
  FIXED_SAR_INFRASTRUCTURE,
  SAR_DATAVIEW_SLUG,
  VIIRS_MATCH_DATAVIEW_SLUG,
} from 'data/workspaces'

import { OFFSHORE_FIXED_INFRASTRUCTURE_DATAVIEW_ID } from './layers-context'

export const LAYERS_LIBRARY_DETECTIONS: LibraryLayerConfig[] = [
  {
    id: 'viirs',
    dataviewId: VIIRS_MATCH_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/VIIRS.jpg`,
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
    id: OFFSHORE_FIXED_INFRASTRUCTURE_DATAVIEW_ID,
    dataviewId: FIXED_SAR_INFRASTRUCTURE,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/offshore-fixed-infrastructure.jpg`,
    config: {
      color: '#8E24A9',
    },
  },
]
