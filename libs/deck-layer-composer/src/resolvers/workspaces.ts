import type { WorkspacesLayerProps } from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from './types'

export const resolveDeckWorkspacesLayerProps: DeckResolverFunction<WorkspacesLayerProps> = (
  dataview
) => {
  return {
    id: dataview.id,
    category: dataview.category!,
    color: dataview.config?.color,
    data: dataview.config?.data.features,
  }
}
