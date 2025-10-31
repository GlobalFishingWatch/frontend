import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes, DRAW_DATASET_SOURCE } from '@globalfishingwatch/api-types'
import { COORDINATE_PROPERTY_TIMESTAMP } from '@globalfishingwatch/data-transforms'
import {
  findDatasetByType,
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
  getDatasetRangeSteps,
  resolveEndpoint,
} from '@globalfishingwatch/datasets-client'
import type {
  BaseUserLayerProps,
  DeckLayerProps,
  DeckLayerSubcategory,
  UserLayerPickingObject,
  UserPointsLayerProps,
  UserPolygonsLayerProps,
  UserTrackLayerProps,
} from '@globalfishingwatch/deck-layers'
import { getUTCDateTime } from '@globalfishingwatch/deck-layers'

import type { ResolvedContextDataviewInstance } from '../types/dataviews'
import type { DeckResolverFunction } from '../types/resolvers'

export const getUserContextTimeFilterProps = ({
  dataset,
  start,
  end,
}: {
  dataset: Dataset
  start: string
  end: string
}): Partial<UserPolygonsLayerProps | UserPointsLayerProps> | undefined => {
  if (!dataset || (!start && !end)) {
    return
  }

  const timeFilterType = getDatasetConfigurationProperty({
    dataset,
    property: 'timeFilterType',
  })

  if (!timeFilterType) {
    return
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
  if (!dataset) {
    return {}
  }
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

export const resolveDeckUserLayerProps: DeckResolverFunction<
  BaseUserLayerProps,
  ResolvedContextDataviewInstance
> = (dataview, { highlightedFeatures, start, end, highlightedTime }) => {
  const baseLayerProps = {
    id: dataview.id,
    category: dataview.category!,
    subcategory: dataview.config?.type as DeckLayerSubcategory,
    ...(highlightedTime?.start && {
      highlightStartTime: getUTCDateTime(highlightedTime?.start).toMillis(),
    }),
    ...(highlightedTime?.end && {
      highlightEndTime: getUTCDateTime(highlightedTime?.end).toMillis(),
    }),
  }

  const baseDataset = dataview.datasets?.find((d) => d.id === dataview.config?.layers?.[0].dataset)
  if (!baseDataset) {
    console.error('No dataset found for user layer', dataview)
  }

  const timeFilters = getUserContextTimeFilterProps({ dataset: baseDataset!, start, end })
  if (baseDataset?.source === DRAW_DATASET_SOURCE) {
    const geometryType = getDatasetConfigurationProperty({
      dataset: baseDataset,
      property: 'geometryType',
    })
    baseLayerProps.subcategory = `draw-${geometryType}` as DeckLayerSubcategory
  }

  const layers = dataview.config?.layers?.flatMap((layer) => {
    const dataset = dataview.datasets?.find((dataset) => dataset.id === layer.dataset)

    const datasetConfig = dataview.datasetsConfig?.find(
      (datasetConfig) => datasetConfig.datasetId === layer.dataset
    )
    if (!dataset || dataset?.status !== 'done' || !datasetConfig) {
      return []
    }

    let tilesUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
    if (!tilesUrl) {
      console.warn('No url found for user context')
    }
    if (dataset.source === DRAW_DATASET_SOURCE) {
      // This invalidates cache after drawn editions
      tilesUrl = `${tilesUrl}?cache=${dataset.configuration?.filePath}`
    }

    const { idProperty, valueProperties } = getDatasetConfiguration(dataset)
    const allFilters = Object.fromEntries((dataset.fieldsAllowed || []).map((f) => [f, undefined]))
    return {
      id: `${dataview.id}-${dataset.id}`,
      datasetId: dataset.id,
      tilesUrl,
      idProperty,
      valueProperties,
      pickable:
        dataview.config?.pickable !== undefined
          ? dataview.config?.pickable
          : !dataset.configuration?.disableInteraction,
      sublayers: layer.sublayers.map((sublayer) => ({
        ...sublayer,
        filters: { ...allFilters, ...(sublayer.filters || {}) },
      })),
    }
  })

  return {
    ...baseLayerProps,
    layers,
    ...(timeFilters || {}),
    highlightedFeatures: highlightedFeatures as UserLayerPickingObject[],
    ...(dataview.config?.maxZoom && { maxZoom: dataview.config.maxZoom }),
  } as DeckLayerProps<BaseUserLayerProps>
}

export const resolveDeckUserContextLayerProps: DeckResolverFunction<
  UserPolygonsLayerProps,
  ResolvedContextDataviewInstance
> = (dataview, globalConfig) => {
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.UserContext) as Dataset
  const polygonColor = getUserPolygonColorProps({ dataset })
  return {
    ...resolveDeckUserLayerProps(dataview, globalConfig),
    ...polygonColor,
  } as UserPolygonsLayerProps
}

export const resolveDeckUserPointsLayerProps: DeckResolverFunction<
  UserPointsLayerProps,
  ResolvedContextDataviewInstance
> = (dataview, globalConfig) => {
  const dataset = (findDatasetByType(dataview.datasets, DatasetTypes.UserContext) ||
    findDatasetByType(dataview.datasets, DatasetTypes.Context)) as Dataset
  const circleProps = getUserCircleProps({ dataset })
  return {
    ...resolveDeckUserLayerProps(dataview, globalConfig),
    ...circleProps,
  } as UserPointsLayerProps
}

export const resolveDeckUserTracksLayerProps: DeckResolverFunction<
  UserTrackLayerProps,
  ResolvedContextDataviewInstance
> = (dataview, globalConfig) => {
  // const dataset = findDatasetByType(dataview.datasets, DatasetTypes.UserContext) as Dataset
  // const tracksProps = getUserTracksProps({ dataset })
  return {
    ...resolveDeckUserLayerProps(dataview, globalConfig),
    singleTrack: dataview.config?.singleTrack,
    // ...tracksProps,
  } as UserTrackLayerProps
}
