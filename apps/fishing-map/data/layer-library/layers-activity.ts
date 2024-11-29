import { PATH_BASENAME } from 'data/config'
import type { LibraryLayerConfig } from 'data/layer-library/layers.types'
import { FISHING_DATAVIEW_SLUG, PRESENCE_DATAVIEW_SLUG } from 'data/workspaces'

export const LAYERS_LIBRARY_ACTIVITY: LibraryLayerConfig[] = [
  {
    id: 'fishing-effort',
    dataviewId: FISHING_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/AIS-apparent-fishing-effort.jpg`,
    config: {
      color: '#00FFBC',
      colorRamp: 'teal',
    },
  },
  {
    id: 'presence',
    dataviewId: PRESENCE_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/presence.jpg`,
    config: {
      color: '#FF64CE',
      colorRamp: 'magenta',
    },
  },
]
