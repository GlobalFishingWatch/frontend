import type { Dataview } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'

const dataviews: Dataview[] = [
  {
    id: 410,
    name: 'port visit cluster events pipe 3',
    slug: 'port-visit-cluster-events-v-3-mock',
    app: 'fishing-map',
    config: {
      type: 'FOURWINGS_TILE_CLUSTER',
      color: '#9AEEFF',
      clusterMaxZoomLevels: {
        country: 3,
        port: 24,
      },
    },
    infoConfig: null,
    filtersConfig: null,
    eventsConfig: null,
    datasetsConfig: [
      {
        query: [],
        params: [],
        endpoint: 'events-cluster-tiles',
        datasetId: 'public-global-port-visits-events:v3.1',
      },
    ],
    description: 'port visit cluster events',
    createdAt: '2024-10-21T09:42:47.554Z',
    updatedAt: '2024-12-13T13:03:07.854Z',
    category: 'events',
  },
]

export default dataviews
