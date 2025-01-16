import type { GraticulesLayerProps } from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from './types'

export const resolveDeckGraticulesLayerProps: DeckResolverFunction<GraticulesLayerProps> = (
  dataview
) => {
  return {
    id: dataview.id,
    category: dataview.category!,
    color: dataview.config?.color as string,
  }
}
