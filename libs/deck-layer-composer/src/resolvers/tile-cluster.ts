import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ClusterLayerProps } from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction, ResolverGlobalConfig } from './types'

// TODO: decide if include static here or create a new one
export const resolveDeckTileClusterLayerProps: DeckResolverFunction<ClusterLayerProps> = (
  dataview: UrlDataviewInstance,
  { start, end }: ResolverGlobalConfig
): ClusterLayerProps => {
  const dataset = dataview.datasets?.[0]
  const tilesUrl = dataset ? resolveEndpoint(dataset, dataview.datasetsConfig?.[0]) : undefined

  return {
    id: dataview.id,
    category: dataview.category!,
    subcategory: dataview.config?.type,
    datasetId: dataset?.id || '',
    color: dataview.config?.color || '',
    start: start,
    end: end,
    visible: dataview.config?.visible ?? true,
    tilesUrl: tilesUrl || '',
  }
}
