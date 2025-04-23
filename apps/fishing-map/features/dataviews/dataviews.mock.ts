import type { Dataview } from '@globalfishingwatch/api-types'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'

import { PM_LABELS_DATASET_ID } from 'features/datasets/datasets.mock'

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
        params: [],
        endpoint: 'pm-tiles',
        datasetId: PM_LABELS_DATASET_ID,
      },
    ],
    description: 'Labels',
    category: DataviewCategory.Context,
  },
]

export default dataviews
