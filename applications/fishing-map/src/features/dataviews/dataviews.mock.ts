import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types/dist'

export const dataviews: Dataview[] = [
  {
    id: 1,
    name: 'Encounter cluster events',
    description: '',
    app: 'fishing-map',
    config: {
      type: 'TILE_CLUSTER',
      color: '#FAE9A0',
    },
    category: DataviewCategory.Events,
    datasetsConfig: [
      {
        query: [
          {
            id: 'types',
            value: ['encounter'],
          },
        ],
        params: [],
        endpoint: 'carriers-events-cluster-tiles',
        datasetId: 'carriers-clusterbuster',
      },
    ],
  },
]
export default dataviews
