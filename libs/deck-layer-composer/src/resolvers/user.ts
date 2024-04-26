import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { UserContextLayerProps, UserContextPickingObject } from '@globalfishingwatch/deck-layers'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import {
  findDatasetByType,
  getDatasetConfiguration,
  resolveEndpoint,
} from '@globalfishingwatch/datasets-client'
import { DeckResolverFunction } from './types'

export const resolveDeckUserContextLayerProps: DeckResolverFunction<UserContextLayerProps> = (
  dataview,
  { highlightedFeatures }
) => {
  const { url } = resolveDataviewDatasetResource(dataview, DatasetTypes.UserContext)
  if (!url) {
    console.warn('No url found for user context layer')
  }
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.UserContext) as Dataset
  const { idProperty, valueProperties } = getDatasetConfiguration(dataset)

  const datasetConfig = dataview.datasetsConfig?.find(
    (datasetConfig) => datasetConfig.datasetId === dataset.id
  )
  const tilesUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
  const layer = {
    id: dataset.id,
    datasetId: dataset.id,
    tilesUrl,
  }

  return {
    id: dataview.id,
    layers: [layer],
    category: dataview.category!,
    color: dataview.config?.color!,
    idProperty,
    valueProperties,
    highlightedFeatures: highlightedFeatures as UserContextPickingObject[],
  }
}
