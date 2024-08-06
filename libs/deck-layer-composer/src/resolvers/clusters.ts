import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { FourwingsClustersLayerProps, getUTCDateTime } from '@globalfishingwatch/deck-layers'
import { getDatasetsExtent, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { EndpointId } from '@globalfishingwatch/api-types'
import { DeckResolverFunction, ResolverGlobalConfig } from './types'

export const resolveDeckFourwingsClustersLayerProps: DeckResolverFunction<
  FourwingsClustersLayerProps
> = (
  dataview: UrlDataviewInstance,
  { start, end }: ResolverGlobalConfig
): FourwingsClustersLayerProps => {
  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity
  const { extentStart, extentEnd } = getDatasetsExtent(dataview.datasets, { format: 'timestamp' })

  const dataset = dataview.datasets?.[0]

  const tilesUrl = dataset
    ? resolveEndpoint(
        dataset,
        {
          datasetId: dataset.id,
          endpoint: EndpointId.FourwingsTiles,
          params: [
            {
              id: 'type',
              value: 'heatmap',
            },
          ],
        },
        { absolute: true }
      )
    : undefined

  return {
    id: dataview.id,
    category: dataview.category!,
    subcategory: dataview.config?.type!,
    datasetId: dataset?.id || '',
    color: dataview.config?.color || '',
    filters: dataview.config?.filter || '',
    startTime,
    endTime,
    visible: dataview.config?.visible ?? true,
    tilesUrl: tilesUrl || '',
    extentStart: extentStart as number,
    extentEnd: extentEnd as number,
  }
}
