import type { Dataview } from '@globalfishingwatch/api-types'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'

export const BATHYMETRY_CONTOUR_DATAVIEW_ID = 11111111

const dataviews: Dataview[] = [
  {
    id: BATHYMETRY_CONTOUR_DATAVIEW_ID,
    name: 'bathymetry-contour',
    slug: 'bathymetry-contour',
    app: 'fishing-map',
    config: {
      type: 'BATHYMETRY',
      color: '#4184F4',
      layers: [
        {
          id: 'bathymetry-contour',
          dataset: 'public-bathymetry-contour',
        },
      ],
    },
    datasetsConfig: [
      {
        endpoint: 'context-tiles',
        datasetId: 'public-bathymetry-contour',
        params: [],
      },
    ],
    description: 'High seas',
    createdAt: '2023-01-16T15:17:32.159Z',
    updatedAt: '2023-02-21T10:18:14.629Z',
    category: DataviewCategory.Context,
  },
]

export default dataviews
