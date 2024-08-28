import { uniqBy } from 'es-toolkit'
import { DateTime } from 'luxon'
import {
  getDataviewSqlFiltersResolved,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { FourwingsClustersLayerProps, getUTCDateTime } from '@globalfishingwatch/deck-layers'
import { getDatasetsExtent, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { DataviewDatasetConfig, EndpointId } from '@globalfishingwatch/api-types'
import { DeckResolverFunction, ResolverGlobalConfig } from './types'

const getDateRangeQuery = ({
  startTime,
  endTime,
  extentStart,
  extentEnd,
}: {
  startTime: number
  endTime: number
  extentStart?: number
  extentEnd?: number
}) => {
  const start = extentStart && extentStart > startTime ? extentStart : startTime
  const end =
    extentEnd && extentEnd < endTime
      ? DateTime.fromMillis(extentEnd).plus({ day: 1 }).toMillis()
      : endTime
  const startIso = getUTCDateTime(start < end ? start : end)
    .startOf('hour')
    .toISO()
  const endIso = getUTCDateTime(end).startOf('hour').toISO()

  return `${startIso},${endIso}`
}

export const resolveDeckFourwingsClustersLayerProps: DeckResolverFunction<
  FourwingsClustersLayerProps
> = (
  dataview: UrlDataviewInstance,
  { start, end }: ResolverGlobalConfig
): FourwingsClustersLayerProps => {
  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity
  const { extentStart, extentEnd } = getDatasetsExtent<number>(dataview.datasets, {
    format: 'timestamp',
  })

  const dataset = dataview.datasets?.[0]
  const dataviewDatasetConfig = dataview.datasetsConfig?.[0] || ({} as DataviewDatasetConfig)
  const datasetId = dataviewDatasetConfig.datasetId || dataset?.id

  if (!dataset || !datasetId) {
    console.warn('No datasetId found for dataview', dataview)
    return {} as FourwingsClustersLayerProps
  }

  const datasetConfig = {
    datasetId: datasetId,
    endpoint: dataviewDatasetConfig.endpoint || EndpointId.ClusterTiles,
    params: uniqBy(
      [...(dataviewDatasetConfig.params || []), { id: 'type', value: 'heatmap' }],
      (p) => p.id
    ),
    query: uniqBy(
      [
        ...(dataviewDatasetConfig.query || []),
        { id: 'format', value: '4WINGS' },
        { id: 'temporal-aggregation', value: true },
        { id: 'datasets', value: datasetId },
        { id: 'filters', value: getDataviewSqlFiltersResolved(dataview) },
        {
          id: 'date-range',
          value: getDateRangeQuery({
            startTime,
            endTime,
            extentStart,
            extentEnd,
          }),
        },
      ],
      (p) => p.id
    ),
  } as DataviewDatasetConfig

  return {
    id: dataview.id,
    category: dataview.category!,
    subcategory: dataview.config?.type!,
    datasetId: dataset?.id || '',
    color: dataview.config?.color || '',
    startTime,
    endTime,
    visible: dataview.config?.visible ?? true,
    tilesUrl: resolveEndpoint(dataset, datasetConfig, { absolute: true }) || '',
  }
}
