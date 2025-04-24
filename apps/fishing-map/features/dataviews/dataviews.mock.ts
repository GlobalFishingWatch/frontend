import type { Dataview } from '@globalfishingwatch/api-types'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'

export const PM_LABELS_DATAVIEW_ID = 1111111

const dataviews: Dataview[] = [
  {
    id: PM_LABELS_DATAVIEW_ID,
    name: 'pm-labels',
    slug: 'pm-labels',
    app: 'fishing-map',
    config: {
      type: DataviewType.BasemapLabels,
    },
    datasetsConfig: [
      {
        query: [],
        params: [
          {
            id: 'file_path',
            value: '',
          },
        ],
        endpoint: 'pm-tiles',
        datasetId: 'public-location-labels',
      },
    ],
    description: 'Labels',
    category: DataviewCategory.Context,
  },
]

export default dataviews
