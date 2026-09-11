import { type Dataview, DataviewCategory } from '@globalfishingwatch/api-types'

const dataviews: Dataview[] = [
  {
    id: 99999999,
    name: 'MPA',
    slug: 'mpa',
    app: 'fishing-map',
    config: {
      type: 'CONTEXT',
      color: '#B39DDB',
      layers: [
        {
          id: 'mpa',
          dataset: 'public-mpa-all-precomputed',
        },
      ],
      pickable: true,
    },
    infoConfig: null,
    filtersConfig: null,
    eventsConfig: null,
    datasetsConfig: [
      {
        query: [],
        endpoint: 'context-tiles',
        datasetId: 'public-mpa-all-precomputed',
      },
    ],
    description: 'Marine Protected Areas',
    createdAt: '2025-12-17T16:17:24.580Z',
    updatedAt: '2026-03-09T15:42:59.062Z',
    category: DataviewCategory.Context,
  },
]

export default dataviews
