import { LibraryLayerConfig } from 'data/layer-library/layers.types'
import { FISHING_DATAVIEW_SLUG, PRESENCE_DATAVIEW_SLUG } from 'data/workspaces'

export const LAYERS_LIBRARY_ACTIVITY: LibraryLayerConfig[] = [
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
]
