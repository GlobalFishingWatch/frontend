import { DataviewCategory } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { CONTEXT_LAYERS_COLORS, CONTEXT_LAYERS_IDS } from 'data/constants'
import { rfmoDatasets } from 'data/datasets/context'

const rfmoDataview: UrlDataviewInstance = {
  id: CONTEXT_LAYERS_IDS.otherRfmos,
  name: 'Other RFMOs',
  slug: null,
  description: 'Other rfmos areas',
  app: 'fishing-map',
  config: {
    type: GeneratorType.UserContext,
    color: CONTEXT_LAYERS_COLORS.other_rfmos,
  },
  infoConfig: null,
  eventsConfig: null,
  filtersConfig: null,
  category: DataviewCategory.Context,
  datasets: rfmoDatasets,
  datasetsConfig: [
    {
      query: [],
      params: [],
      endpoint: 'user-context-tiles',
      datasetId: 'public-registry-rfmos',
    },
  ],
}

export default rfmoDataview
