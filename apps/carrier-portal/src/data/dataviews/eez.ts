import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { GeneratorType } from '@globalfishingwatch/layer-composer/dist/generators'
import { eezDatasets } from 'data/datasets/datasets'

export const EEZ_DATAVIEW_ID = 'eez'

const eezDataview: UrlDataviewInstance = {
  id: EEZ_DATAVIEW_ID,
  name: 'EEZ',
  app: 'fishing-map',
  description:
    'Flanders Marine Institute (2019). Maritime Boundaries Geodatabase: Maritime Boundaries and Exclusive Economic Zones (200NM), version 11.',
  config: {
    type: GeneratorType.Context,
    color: '#00FFBC',
    layers: [
      {
        id: 'eez-areas',
        dataset: 'public-eez-areas',
      },
      {
        id: 'eez-boundaries',
        dataset: 'public-eez-boundaries-shp',
      },
    ],
  },
  datasets: eezDatasets as any,
  datasetsConfig: [
    {
      query: [
        {
          id: 'properties',
          value: ['mrgid'],
        },
      ],
      params: [],
      endpoint: 'user-context-tiles',
      datasetId: 'public-eez-areas',
    },
    {
      query: [
        {
          id: 'properties',
          value: ['line_type'],
        },
      ],
      params: [],
      endpoint: 'user-context-tiles',
      datasetId: 'public-eez-boundaries-shp',
    },
  ],
}

export default eezDataview
