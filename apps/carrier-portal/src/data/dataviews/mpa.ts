import { DataviewCategory } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { CONTEXT_LAYERS_COLORS, CONTEXT_LAYERS_IDS } from 'data/constants'
import { mpaDatasets } from 'data/datasets/context'

const mpaDataview: UrlDataviewInstance = {
  id: CONTEXT_LAYERS_IDS.mpant,
  name: 'MPA',
  slug: null,
  description: 'Marine Protected Areas',
  app: 'fishing-map',
  config: {
    type: GeneratorType.Context,
    color: CONTEXT_LAYERS_COLORS.mpant,
    layers: 'mpa',
  },
  infoConfig: null,
  eventsConfig: null,
  filtersConfig: null,
  category: DataviewCategory.Context,
  datasets: mpaDatasets,
  datasetsConfig: [
    {
      query: [
        {
          id: 'properties',
          value: ['name', 'desig', 'wdpa_pid'],
        },
      ],
      params: [],
      endpoint: 'user-context-tiles',
      datasetId: 'public-mpa-all',
    },
  ],
}

export default mpaDataview
