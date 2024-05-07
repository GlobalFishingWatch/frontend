import { DRAW_DATASET_SOURCE, Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import {
  BaseUserLayerProps,
  UserPolygonsLayerProps,
  UserLayerPickingObject,
  UserPointsLayerProps,
  getUTCDateTime,
} from '@globalfishingwatch/deck-layers'
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
  start,
  end,
}: {
  dataset: Dataset
  start: string
  end: string
}): Partial<UserPolygonsLayerProps | UserPointsLayerProps> => {
  if (!start && !end) {
    return {}
  }
  const timeFilterType = getDatasetConfigurationProperty({
    dataset,
    property: 'timeFilterType',
  })

  if (!timeFilterType) {
    return {}
  }

  const startTimeProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'startTime',
  }) as string
  const endTimeProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'endTime',
  }) as string

  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity

  return { startTime, endTime, startTimeProperty, endTimeProperty, timeFilterType }
}

export const getUserPolygonColorProps = ({
  dataset,
}: {
  dataset: Dataset
}): Partial<UserPolygonsLayerProps> => {
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

export const getUserCircleProps = ({
  dataset,
}: {
  dataset: Dataset
}): Partial<UserPointsLayerProps> => {
  const circleRadiusProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'pointSize',
  })
  if (!circleRadiusProperty) {
    return {}
  }

  const circleRadiusRange = circleRadiusProperty
    ? [
        dataset.schema?.[circleRadiusProperty].enum?.[0] as number,
        dataset.schema?.[circleRadiusProperty].enum?.[1] as number,
      ]
    : []
  const minPointSize = getDatasetConfigurationProperty({
    dataset,
    property: 'minPointSize',
  })
  const maxPointSize = getDatasetConfigurationProperty({
    dataset,
    property: 'maxPointSize',
  })

  return {
    circleRadiusProperty: circleRadiusProperty.toLowerCase(),
    circleRadiusRange,
    ...(minPointSize && { minPointSize }),
    ...(maxPointSize && { maxPointSize }),
  }
}

export const resolveDeckUserLayerProps: DeckResolverFunction<BaseUserLayerProps> = (
  dataview,
  { highlightedFeatures, start, end }
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
  const timeFilters = getUserContexTimeFilterProps({ dataset, start, end })
  const { filter } = dataview.config || {}

  return {
    id: dataview.id,
    layers: [layer],
    category: dataview.category!,
    subcategory: dataview.config?.type!,
    color: dataview.config?.color!,
    pickable: !dataset.configuration?.disableInteraction ?? true,
    highlightedFeatures: highlightedFeatures as UserLayerPickingObject[],
    ...(filter && { filter }),
    ...(idProperty && { idProperty }),
    ...(valueProperties?.length && { valueProperties }),
    ...timeFilters,
  }
}

export const resolveDeckUserContextLayerProps: DeckResolverFunction<UserPolygonsLayerProps> = (
  dataview,
  globalConfig
) => {
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.UserContext) as Dataset
  const polygonColor = getUserPolygonColorProps({ dataset })
  return {
    ...resolveDeckUserLayerProps(dataview, globalConfig),
    ...polygonColor,
  } as UserPolygonsLayerProps
}

export const resolveDeckUserPointsLayerProps: DeckResolverFunction<UserPointsLayerProps> = (
  dataview,
  globalConfig
) => {
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.UserContext) as Dataset
  const circleProps = getUserCircleProps({ dataset })
  return {
    ...resolveDeckUserLayerProps(dataview, globalConfig),
    ...circleProps,
  } as UserPointsLayerProps
}