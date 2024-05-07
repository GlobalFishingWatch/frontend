import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { ClusterLayerProps } from '@globalfishingwatch/deck-layers'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { DeckResolverFunction, ResolverGlobalConfig } from './types'

// TODO: decide if include static here or create a new one
export const resolveDeckClusterLayerProps: DeckResolverFunction<ClusterLayerProps> = (
  dataview: UrlDataviewInstance,
  { start, end }: ResolverGlobalConfig
): ClusterLayerProps => {
  const dataset = dataview.datasets?.[0]
  const tilesUrl = dataset ? resolveEndpoint(dataset, dataview.datasetsConfig?.[0]!) : undefined

  return {
    id: dataview.id,
    category: dataview.category!,
    datasetId: dataset?.id || '',
    color: dataview.config?.color || '',
    start: start,
    end: end,
    visible: dataview.config?.visible ?? true,
    tilesUrl: tilesUrl || '',
  }
}