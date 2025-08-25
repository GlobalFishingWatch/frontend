import type { GraticulesLayerProps } from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from '../types/resolvers'

export const resolveDeckGraticulesLayerProps: DeckResolverFunction<GraticulesLayerProps> = (
  dataview
) => {
  return {
    id: dataview.id,
    category: dataview.category!,
    color: dataview.config?.color as string,
    thickness: dataview.config?.thickness as number,
  }
}
