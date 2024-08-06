import { Dataview, DataviewType, DataviewCategory } from '@globalfishingwatch/api-types'
import { CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG } from 'data/workspaces'

const dataviews: Dataview[] = [
  {
    id: 99999,
    name: 'Encounter cluster events pipe 3',
    slug: CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
    app: 'fishing-map',
    config: {
      type: 'TILE_CLUSTER',
      color: '#FAE9A0',
      datasets: ['public-global-sar-presence:v3.0'],
    },
    // datasetsConfig: [
    //   {
    //     query: [
    //       {
    //         id: 'encounter-types',
    //         value: ['CARRIER-FISHING', 'FISHING-CARRIER', 'FISHING-SUPPORT', 'SUPPORT-FISHING'],
    //       },
    //     ],
    //     params: [],
    //     endpoint: 'events-cluster-tiles',
    //     datasetId: //'public-global-encounters-events:v3.0',
    //   },
    // ],
    datasetsConfig: [
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-global-sar-presence:v3.0',
      },
    ],
    description: 'Encounter cluster events',
    createdAt: '2024-05-16T08:21:11.723Z',
    updatedAt: '2024-05-16T08:21:11.723Z',
    category: DataviewCategory.Events,
  },
]

export default dataviews
