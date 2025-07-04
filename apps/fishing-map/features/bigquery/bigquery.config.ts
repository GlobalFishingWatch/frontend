import { FourwingsAggregationOperation } from '@globalfishingwatch/deck-layers'

import { t } from 'features/i18n/i18n'

import type { BigQueryVisualisation } from './bigquery.slice'

export const VisualisationOptions: {
  id: BigQueryVisualisation
  label: string
  fieldsHint: string
}[] = [
  {
    id: '4wings',
    label: t('bigQuery.visualisationActivity'),
    fieldsHint: t('bigQuery.visualisationActivityHint'),
  },
  {
    id: 'events',
    label: t('bigQuery.visualisationEvents'),
    fieldsHint: t('bigQuery.visualisationActivityHint'),
  },
]

export const AggregationOptions = [
  {
    id: FourwingsAggregationOperation.Avg,
    label: t('bigQuery.aggregateAvg'),
  },
  {
    id: FourwingsAggregationOperation.Sum,
    label: t('bigQuery.aggregateSum'),
  },
]
