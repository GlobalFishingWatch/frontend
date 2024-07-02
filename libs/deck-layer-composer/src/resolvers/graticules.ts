import { GraticulesLayerProps } from '@globalfishingwatch/deck-layers'
import { DeckResolverFunction } from './types'

export const resolveDeckGraticulesLayerProps: DeckResolverFunction<GraticulesLayerProps> = (
  dataview
) => {
  return {
    id: dataview.id,
    category: dataview.category!,
    color: dataview.config?.color!,
  }
}
