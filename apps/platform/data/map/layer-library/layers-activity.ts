import {
  FISHING_AIS_DATAVIEW_SLUG,
  FISHING_VMS_DATAVIEW_SLUG,
  PRESENCE_DATAVIEW_SLUG,
} from '@platform/config/map/dataviews'

import { PATH_BASENAME } from 'data/map/config'
import type { LibraryLayerConfig } from 'data/map/layer-library/layers.types'

export const LAYERS_LIBRARY_ACTIVITY: LibraryLayerConfig[] = [
  {
    id: 'fishing-effort-ais',
    dataviewId: FISHING_AIS_DATAVIEW_SLUG,
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
    dataviewId: FISHING_VMS_DATAVIEW_SLUG,
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
