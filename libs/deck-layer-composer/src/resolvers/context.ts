import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import {
  ContextLayerConfig,
  ContextLayerId,
  ContextLayerProps,
  ContextPickingObject,
} from '@globalfishingwatch/deck-layers'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import {
  findDatasetByType,
  getDatasetConfiguration,
  resolveEndpoint,
} from '@globalfishingwatch/datasets-client'
import { DeckResolverFunction } from './types'

export const resolveDeckContextLayerProps: DeckResolverFunction<ContextLayerProps> = (
  dataview,
  { highlightedFeatures }
) => {
  // TODO make this work for auxiliar layers
  // https://github.com/GlobalFishingWatch/frontend/blob/master/libs/dataviews-client/src/resolve-dataviews-generators.ts#L606
  const { url } = resolveDataviewDatasetResource(dataview, DatasetTypes.Context)
  if (!url) {
    console.warn('No url found for temporal context')
  }
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.Context) as Dataset
  const { idProperty, valueProperties } = getDatasetConfiguration(dataset)

  const layers = (dataview.config?.layers || [])?.flatMap((layer): ContextLayerConfig | [] => {
    const dataset = dataview.datasets?.find((dataset) => dataset.id === layer.dataset)
    const datasetConfig = dataview.datasetsConfig?.find(
      (datasetConfig) => datasetConfig.datasetId === layer.dataset
    )
    if (!dataset || !datasetConfig) {
      return []
    }

    const tilesUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
    return {
      id: layer.id as ContextLayerId,
      datasetId: dataset.id,
      tilesUrl,
    }
  })

  return {
    id: dataview.id,
    layers: layers,
    category: dataview.category!,
    color: dataview.config?.color!,
    idProperty,
    valueProperties,
    highlightedFeatures: highlightedFeatures as ContextPickingObject[],
  }
}
