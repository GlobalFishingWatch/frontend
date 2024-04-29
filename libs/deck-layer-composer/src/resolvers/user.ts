import { DRAW_DATASET_SOURCE, Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { UserContextLayerProps, UserContextPickingObject } from '@globalfishingwatch/deck-layers'
import {
  findDatasetByType,
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
  getDatasetRangeSteps,
  resolveEndpoint,
} from '@globalfishingwatch/datasets-client'
import { DeckResolverFunction } from './types'

const getUserContexTimeFilterProps = ({
  dataset,
}: {
  dataset: Dataset
}): Partial<UserContextLayerProps> => {
  const startTimeFilterProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'startTime',
  }) as string
  const endTimeFilterProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'endTime',
  }) as string
  return { startTimeFilterProperty, endTimeFilterProperty }
}

export const getUserPolygonColorProps = ({
  dataset,
}: {
  dataset: Dataset
}): Partial<UserContextLayerProps> => {
  const polygonColor = getDatasetConfigurationProperty({
    dataset,
    property: 'polygonColor',
  })

  if (dataset?.schema?.[polygonColor]?.enum) {
    const [min, max] = dataset.schema[polygonColor].enum as number[]
    return {
      steps: getDatasetRangeSteps({ min, max }),
      stepsPickValue: polygonColor,
    }
  }
  return {}
}

export const resolveDeckUserContextLayerProps: DeckResolverFunction<UserContextLayerProps> = (
  dataview,
  { highlightedFeatures }
) => {
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.UserContext) as Dataset

  const datasetConfig = dataview.datasetsConfig?.find(
    (datasetConfig) => datasetConfig.datasetId === dataset.id
  )

  let tilesUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
  if (!tilesUrl) {
    console.warn('No url found for user context')
  }
  if (dataset.source === DRAW_DATASET_SOURCE) {
    // This invalidates cache after drawn editions
    tilesUrl = `${tilesUrl}?cache=${dataset.configuration?.filePath}`
  }

  const layer = {
    id: dataset.id,
    datasetId: dataset.id,
    tilesUrl,
  }
  const { idProperty, valueProperties } = getDatasetConfiguration(dataset)
  const timeFilters = getUserContexTimeFilterProps({ dataset })
  const polygonColor = getUserPolygonColorProps({ dataset })
  const { filter } = dataview.config || {}
  return {
    id: dataview.id,
    layers: [layer],
    category: dataview.category!,
    color: dataview.config?.color!,
    interactive: !dataset.configuration?.disableInteraction ?? true,
    highlightedFeatures: highlightedFeatures as UserContextPickingObject[],
    ...(filter && { filter }),
    ...(idProperty && { idProperty }),
    ...(valueProperties?.length && { valueProperties }),
    ...timeFilters,
    ...polygonColor,
  }
}
