import { BaseMapLayerProps, BasemapType } from '@globalfishingwatch/deck-layers'
import { DeckResolverFunction } from './types'

export const resolveDeckBasemapLayerProps: DeckResolverFunction<BaseMapLayerProps> = (dataview) => {
  return {
    id: dataview.id,
    category: dataview.category!,
    visible: dataview.config?.visible || true,
    basemap: (dataview.config?.basemap as BasemapType) || BasemapType.Default,
  }
}
