import type { Dataview } from '@globalfishingwatch/api-types'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'

import { VIIRS_MATCH_SKYLIGHT_DATAVIEW_SLUG } from 'data/workspaces'

const dataviews: Dataview[] = [
  {
    id: 401,
    name: 'VIIRS match',
    slug: VIIRS_MATCH_SKYLIGHT_DATAVIEW_SLUG,
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#FFEA00',
      maxZoom: 12,
      datasets: ['proto-global-skylight-viirs:v1.0'],
      colorRamp: 'yellow',
    },
    infoConfig: null,
    filtersConfig: {
      order: ['matched'],
      incompatibility: {
        'public-global-viirs-presence:v3.0': [
          {
            id: 'matched',
            value: false,
            disabled: ['source', 'flag', 'shiptype', 'geartype'],
          },
        ],
      },
    },
    eventsConfig: null,
    datasetsConfig: [
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'proto-global-skylight-viirs:v1.0',
      },
    ],
    description: 'VIIRS match from skylight',
    createdAt: '2024-05-16T08:21:11.745Z',
    updatedAt: '2024-05-16T08:21:11.745Z',
    category: 'detections',
  },
]

export default dataviews
