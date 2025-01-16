import type {
  BaseMapLabelsLayerProps,
  BaseMapLayerProps} from '@globalfishingwatch/deck-layers';
import {
  BasemapType,
} from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from './types'

export const resolveDeckBasemapLabelsLayerProps: DeckResolverFunction<BaseMapLabelsLayerProps> = (
  dataview
) => {
  return {
    id: dataview.id,
    category: dataview.category!,
    visible: dataview.config?.visible || true,
    locale: dataview.config?.locale,
  }
}

export const resolveDeckBasemapLayerProps: DeckResolverFunction<BaseMapLayerProps> = (dataview) => {
  return {
    id: dataview.id,
    category: dataview.category!,
    visible: dataview.config?.visible || true,
    basemap: (dataview.config?.basemap as BasemapType) || BasemapType.Default,
  }
}
