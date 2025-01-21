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
    label: t('bigQuery.visualisationActivity', 'Activity (heatmap)'),
    fieldsHint: t(
      'bigQuery.visualisationActivityHint',
      '(Ensure id, lat, lon, timestamp and value are all present)'
    ),
  },
  {
    id: 'events',
    label: t('bigQuery.visualisationEvents', 'Events (clusters)'),
    fieldsHint: t(
      'bigQuery.visualisationEventsHint',
      '(Ensure event_id, event_start, event_end and geom are all present)'
    ),
  },
]

export const AggregationOptions = [
  {
    id: FourwingsAggregationOperation.Avg,
    label: t('bigQuery.aggregateAvg', 'Average'),
  },
  {
    id: FourwingsAggregationOperation.Sum,
    label: t('bigQuery.aggregateSum', 'Sum'),
  },
]
