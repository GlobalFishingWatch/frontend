import type { Dataview } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'

export const CURRENTS_DATAVIEW_ID = 1111111

const dataviews: Dataview[] = [
  {
    id: CURRENTS_DATAVIEW_ID,
    name: 'Currents mock',
    description: 'Currents mock',
    slug: 'currents',
    app: 'fishing-map',
    config: {
      type: 'CURRENTS',
    },
    datasetsConfig: [
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-global-presence:v3.0',
      },
    ],
    category: DataviewCategory.Environment,
  },
]

export default dataviews
