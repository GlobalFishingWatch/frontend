import type { Dataview } from '@globalfishingwatch/api-types'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'

export const RANDOM_FOREST_FISHING_EFFORT_DATAVIEW_ID = 1111111
export const RANDOM_FOREST_PRESENCE_DATAVIEW_ID = 1111112

const dataviews: Dataview[] = [
  {
    id: RANDOM_FOREST_FISHING_EFFORT_DATAVIEW_ID,
    name: 'Apparent fishing effort random forest',
    slug: 'apparent-fishing-effort-random-forest',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#00FFBC',
      datasets: ['public-global-fishing-effort-vi-653:v1.0'],
      colorRamp: 'teal',
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
        datasetId: 'public-global-fishing-effort-vi-653:v1.0',
      },
    ],
    description: 'Apparent fishing effort using random forest pipe',
    createdAt: '2025-06-13T07:11:50.324Z',
    updatedAt: '2025-06-13T07:11:50.324Z',
    category: DataviewCategory.Activity,
  },
  {
    id: RANDOM_FOREST_PRESENCE_DATAVIEW_ID,
    name: 'Presence Activity random forest',
    slug: 'presence-activity-random-forest',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#00FFBC',
      datasets: ['public-global-presence-vi-653:v1.0'],
      colorRamp: 'teal',
    },
    filtersConfig: {
      order: [],
      incompatibility: {
        'public-global-presence-vi-653:v1.0': [
          {
            id: 'vessel_type',
            disabled: ['geartype'],
            valueNot: 'fishing',
          },
        ],
      },
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
        datasetId: 'public-global-presence-vi-653:v1.0',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-chile-presence:v20211126',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-panama-presence:v20211126',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-norway-presence:v20220112',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-png-presence:v20230210',
      },
    ],
    description: 'Presence Activity using random forest pipe',
    createdAt: '2024-05-16T08:21:11.760Z',
    updatedAt: '2024-11-22T13:05:06.961Z',
    category: DataviewCategory.Activity,
  },
]

export default dataviews
