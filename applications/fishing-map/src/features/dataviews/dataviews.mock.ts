import { Dataview } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { Field } from '@globalfishingwatch/data-transforms'
import {
  FISHING_DATASET_ID,
  TRACKS_DATASET_ID,
  VESSELS_DATASET_ID,
} from 'features/workspace/workspace.mock'

const dataviews: Dataview[] = [
  {
    id: 1,
    name: 'background',
    description: '',
    config: {
      type: Generators.Type.Background,
      color: '#00265c',
    },
  },
  {
    id: 2,
    name: 'basemap',
    description: '',
    config: {
      type: Generators.Type.Basemap,
      basemap: Generators.BasemapType.Default,
    },
  },
  {
    id: 3,
    name: 'Apparent fishing effort',
    description:
      'We use data about a vessel’s identity, type, location, speed, direction and more that is broadcast using the Automatic Identification System (AIS) and collected via satellites and terrestrial receivers. We analyze AIS data collected from vessels that our research has identified as known or possible commercial fishing vessels, and apply a fishing detection algorithm to determine “apparent fishing activity” based on changes in vessel speed and direction. The algorithm classifies each AIS broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on our fishing activity heat map.',
    config: {
      type: Generators.Type.HeatmapAnimated,
      color: '#00FFBC',
      colorRamp: 'teal',
      // TODO                     👇 should this be automatically set to 'presence' when there is only a single layer?
      // sublayers: [{ id: 'fishing', colorRamp: 'presence', datasets: [FISHING_DATASET_ID] }],
      combinationMode: 'compare',
      tilesAPI: `${process.env.REACT_APP_API_GATEWAY}/v1/4wings`,
    },
    datasetsConfig: [
      {
        datasetId: FISHING_DATASET_ID,
        params: [{ id: 'type', value: 'heatmap' }],
        endpoint: '4wings-tiles',
      },
    ],
  },
  {
    id: 4,
    name: 'Default track',
    description: 'Default track',
    config: {
      type: Generators.Type.Track,
      color: '#F95E5E',
    },
    info: {
      fields: [
        { id: 'flag', type: 'flag' },
        { id: 'imo', type: 'number' },
        { id: 'first_transmission_date', type: 'date' },
        { id: 'last_transmission_date', type: 'date' },
      ],
    },
    datasetsConfig: [
      {
        datasetId: TRACKS_DATASET_ID,
        params: [{ id: 'vesselId', value: '' }],
        query: [
          // { id: 'binary', value: false },
          { id: 'wrapLongitudes', value: false },
          {
            id: 'fields',
            value: [Field.lonlat].join(','),
            // value: [Field.lonlat, Field.timestamp, Field.speed, Field.fishing].join(','),
          },
          {
            id: 'format',
            value: 'valueArray',
          },
        ],
        endpoint: 'carriers-tracks',
      },
      {
        datasetId: VESSELS_DATASET_ID,
        params: [{ id: 'vesselId', value: '' }],
        endpoint: 'carriers-vessel',
      },
    ],
  },
]

export default dataviews
