import type { ResolvedContextDataviewInstance } from 'libs/deck-layer-composer/src/types/dataviews'

import { getDatasetConfiguration, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type {
  ContextLayerConfig,
  ContextLayerId,
  ContextLayerProps,
  ContextPickingObject,
} from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from '../types/resolvers'

export const resolveDeckContextLayerProps: DeckResolverFunction<
  ContextLayerProps,
  ResolvedContextDataviewInstance
> = (dataview, { highlightedFeatures }) => {
  const layers = (dataview.config?.layers || [])?.flatMap((layer): ContextLayerConfig | [] => {
    const dataset = dataview.datasets?.find((dataset) => dataset.id === layer.dataset)
    const { idProperty, valueProperties } = getDatasetConfiguration(dataset)
    const datasetConfig = dataview.datasetsConfig?.find(
      (datasetConfig) => datasetConfig.datasetId === layer.dataset
    )
    if (!dataset || !datasetConfig) {
      return []
    }

    const tilesUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
    if (!tilesUrl) {
      console.warn('No tilesUrl found for context dataview', dataview)
    }

    return {
      id: layer.id as ContextLayerId,
      datasetId: dataset.id,
      tilesUrl,
      idProperty,
      valueProperties,
      sublayers: layer.sublayers || [],
    }
  })

  return {
    id: dataview.id,
    layers: layers,
    visible: dataview.config?.visible ?? true,
    category: dataview.category!,
    pickable: dataview.config?.pickable ?? true,
    highlightedFeatures: highlightedFeatures as ContextPickingObject[],
  }
}
