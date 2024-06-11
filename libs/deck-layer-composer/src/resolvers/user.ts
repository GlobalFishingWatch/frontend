import { DRAW_DATASET_SOURCE, Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import {
  BaseUserLayerProps,
  UserPolygonsLayerProps,
  UserLayerPickingObject,
  UserPointsLayerProps,
  getUTCDateTime,
  ContextLayerConfig,
  DeckLayerSubcategory,
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
  if (dataset.source === DRAW_DATASET_SOURCE) {
    return { staticPointRadius: 8 }
  }

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
  { highlightedFeatures, start, end, highlightedTime }
) => {
  const baseLayerProps = {
    id: dataview.id,
    category: dataview.category!,
    subcategory: dataview.config?.type! as DeckLayerSubcategory,
    color: dataview.config?.color!,
  }
  const dataset =
    findDatasetByType(dataview.datasets, DatasetTypes.UserContext) ||
    findDatasetByType(dataview.datasets, DatasetTypes.UserTracks)

  if (!dataset) {
    return { ...baseLayerProps, layers: [] }
  }

  if (dataset.source === DRAW_DATASET_SOURCE) {
    const geometryType = getDatasetConfigurationProperty({
      dataset,
      property: 'geometryType',
    })
    baseLayerProps.subcategory = `draw-${geometryType}` as DeckLayerSubcategory
  }

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

  const layer: ContextLayerConfig<string> = {
    id: dataset.id,
    datasetId: dataset.id,
    tilesUrl,
  }
  const { idProperty, valueProperties } = getDatasetConfiguration(dataset)
  const timeFilters = getUserContexTimeFilterProps({ dataset, start, end })
  const { filter, filters } = dataview.config || {}

  return {
    ...baseLayerProps,
    pickable: !dataset.configuration?.disableInteraction ?? true,
    layers: [layer],
    highlightedFeatures: highlightedFeatures as UserLayerPickingObject[],
    ...(highlightedTime?.start && {
      highlightStartTime: getUTCDateTime(highlightedTime?.start).toMillis(),
    }),
    ...(highlightedTime?.end && {
      highlightEndTime: getUTCDateTime(highlightedTime?.end).toMillis(),
    }),
    ...(filter && { filter }),
    ...(filters && { filters }),
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

export const resolveDeckUserTracksLayerProps: DeckResolverFunction<UserPointsLayerProps> = (
  dataview,
  globalConfig
) => {
  // const dataset = findDatasetByType(dataview.datasets, DatasetTypes.UserContext) as Dataset
  // const tracksProps = getUserTracksProps({ dataset })
  return {
    ...resolveDeckUserLayerProps(dataview, globalConfig),
    // ...tracksProps,
  } as UserPointsLayerProps
}