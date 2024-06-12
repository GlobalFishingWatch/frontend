import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'

export const dataviews: Dataview[] = [
  {
    app: 'fishing-map',
    category: DataviewCategory.Events, // Assign the correct enum value here
    config: { type: 'TILE_CLUSTER', color: '#FAE9A0' },
    createdAt: '2024-05-16T08:21:11.723Z',
    datasetsConfig: [
      {
        datasetId: 'proto-global-encounters-events-30min:v3.0',
        endpoint: 'events-cluster-tiles',
        params: [],
        query: [
          {
            id: 'encounter-types',
            value: ['CARRIER-FISHING', 'FISHING-CARRIER', 'FISHING-SUPPORT', 'SUPPORT-FISHING'],
          },
        ],
      },
    ],
    description: 'Encounter cluster events 30min',
    id: 400,
    name: 'Encounter cluster events 30min pipe 3',
    slug: 'encounters-events-30min',
    updatedAt: '2024-05-16T08:21:11.723Z',
  },
]

export default dataviews
