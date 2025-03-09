import type { Dataview } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'

const dataviews: Dataview[] = [
  {
    id: 1111111111,
    name: 'Vessel track only',
    slug: 'vessel-track-only',
    app: 'fishing-map',
    config: {
      type: 'TRACK',
      color: '#FAE9A0',
    },
    datasetsConfig: [
      {
        query: [
          {
            id: 'binary',
            value: true,
          },
          {
            id: 'wrap-longitudes',
            value: false,
          },
          {
            id: 'fields',
            value: ['LONLAT', 'TIMESTAMP', 'SPEED', 'ELEVATION'],
          },
          {
            id: 'format',
            value: 'DECKGL',
          },
        ],
        params: [
          {
            id: 'vesselId',
            value: '',
          },
        ],
        endpoint: 'tracks',
        datasetId: '',
      },
    ],
    description: 'Vessel track only',
    category: 'vessels',
  },
]

export default dataviews
