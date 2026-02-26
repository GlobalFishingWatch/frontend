import { PATH_BASENAME } from 'data/config'
import type { LibraryLayerConfig } from 'data/layer-library/layers.types'
import {
  FISHING_DATAVIEW_SLUG_AIS,
  FISHING_DATAVIEW_SLUG_VMS,
  PRESENCE_DATAVIEW_SLUG,
} from 'data/workspaces'

export const LAYERS_LIBRARY_ACTIVITY: LibraryLayerConfig[] = [
  {
    id: 'fishing-effort-ais',
    dataviewId: FISHING_DATAVIEW_SLUG_AIS,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/AIS-apparent-fishing-effort.jpg`,
    config: {
      color: '#00FFBC',
      colorRamp: 'teal',
      filters: {
        distance_from_port_km: '3',
      },
    },
  },
  {
    id: 'fishing-effort-vms',
    dataviewId: FISHING_DATAVIEW_SLUG_VMS,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/VMS-apparent-fishing-effort.jpg`,
    config: {
      color: '#FFAA0D',
      colorRamp: 'orange',
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
