import { LibraryLayerConfig } from 'data/layer-library/layers.types'
import { SAR_DATAVIEW_SLUG, VIIRS_MATCH_DATAVIEW_SLUG } from 'data/workspaces'

export const LAYERS_LIBRARY_DETECTIONS: LibraryLayerConfig[] = [
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
]
