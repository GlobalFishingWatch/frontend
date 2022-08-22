import { DataviewCategory } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { CONTEXT_LAYERS_COLORS, CONTEXT_LAYERS_IDS } from 'data/constants'
import { eezDatasets } from 'data/datasets/context'

const eezDataview: UrlDataviewInstance = {
  id: CONTEXT_LAYERS_IDS.eez,
  name: 'EEZ',
  app: 'fishing-map',
  description:
    'Flanders Marine Institute (2019). Maritime Boundaries Geodatabase: Maritime Boundaries and Exclusive Economic Zones (200NM), version 11.',
  category: DataviewCategory.Context,
  config: {
    type: GeneratorType.Context,
    color: CONTEXT_LAYERS_COLORS.eez,
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
  datasets: eezDatasets,
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
