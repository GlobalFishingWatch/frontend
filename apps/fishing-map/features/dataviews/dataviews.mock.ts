import { Dataview, DataviewType, DataviewCategory, EndpointId } from '@globalfishingwatch/api-types'

const dataviews: Dataview[] = [
  {
    id: 11111111,
    name: 'Encounter cluster events pipe 3',
    slug: 'encounter-cluster-events-v-3',
    app: 'fishing-map',
    config: {
      type: 'FOURWINGS_TILE_CLUSTER',
      color: '#FAE9A0',
    },
    datasetsConfig: [
      {
        // query: [
        //   {
        //     id: 'encounter-types',
        //     value: ['CARRIER-FISHING', 'FISHING-CARRIER', 'FISHING-SUPPORT', 'SUPPORT-FISHING'],
        //   },
        // ],
        params: [],
        endpoint: 'events-cluster-tiles',
        datasetId: 'public-global-encounters-events:v3.0',
      },
    ],
    description: 'Encounter cluster events',
    createdAt: '2024-05-16T08:21:11.723Z',
    updatedAt: '2024-05-16T08:21:11.723Z',
    category: DataviewCategory.Events,
  },
]

export default dataviews
