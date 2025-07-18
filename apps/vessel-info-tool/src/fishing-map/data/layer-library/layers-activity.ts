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
      datasets: ['public-global-fishing-effort:v3.0'],
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
      datasets: [
        'public-belize-fishing-effort:v20220304',
        'public-bra-onyxsat-fishing-effort:v20211126',
        'public-chile-fishing-effort:v20211126',
        'public-costa-rica-fishing-effort:v20211126',
        'public-ecuador-fishing-effort:v20211126',
        'public-indonesia-fishing-effort:v20200320',
        'public-panama-fishing-effort:v20211126',
        'public-peru-fishing-effort:v20211126',
        'public-png-fishing-effort:v20230210',
        'public-norway-fishing-effort:v20220112',
      ],
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
