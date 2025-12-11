import type { Feature, Point } from 'geojson'

import type { TimeFilterType } from '@globalfishingwatch/api-types'
import type { FourwingsFeature, FourwingsStaticFeature } from '@globalfishingwatch/deck-loaders'

import type { FilterExtensionProps } from './user.types'

export const POINT_SIZES_DEFAULT_RANGE = [3, 15]
export const DEFAULT_USER_TILES_MAX_ZOOM = 9

const HIDDEN_KEYS = ['gfw_id', 'bbox', 'layerName']
export const getPropertiesList = (properties: Record<string, any>) => {
  const keys = Object.keys(properties)
    .filter((k) => !HIDDEN_KEYS.includes(k))
    .sort()
  return keys
    .flatMap((prop) => (properties?.[prop] ? `${prop}: ${properties?.[prop]}` : []))
    .join('<br/>')
}

export type IsFeatureInRangeParams = {
  startTime: number
  endTime: number
  startTimeProperty: string
  endTimeProperty?: string
  timeFilterType?: TimeFilterType
}

export function getFeatureTimeRange(
  feature: Feature<Point> | FourwingsFeature | FourwingsStaticFeature,
  {
    startTimeProperty,
    endTimeProperty,
    timeFilterType,
  }: Pick<IsFeatureInRangeParams, 'startTimeProperty' | 'endTimeProperty' | 'timeFilterType'>
) {
  const featureStart = ((feature.properties as any)?.[startTimeProperty] as number) || 0
  let featureEnd: number
  switch (timeFilterType) {
    case 'dateRange':
      featureEnd =
        (feature.properties as any)?.[endTimeProperty!] === ''
          ? Infinity
          : ((feature.properties as any)?.[endTimeProperty!] as number)
      break
    case 'date':
      featureEnd = featureStart
      break
    default:
      featureEnd = endTimeProperty
        ? ((feature.properties as any)?.[endTimeProperty] as number) || Infinity
        : featureStart
      break
  }

  return { featureStart, featureEnd }
}

export function isFeatureInRange(
  feature: Feature<Point> | FourwingsFeature | FourwingsStaticFeature,
  { startTime, endTime, startTimeProperty, endTimeProperty, timeFilterType }: IsFeatureInRangeParams
) {
  if (!feature || !startTime || !endTime) {
    return false
  }
  const { featureStart, featureEnd } = getFeatureTimeRange(feature, {
    startTimeProperty,
    endTimeProperty,
    timeFilterType,
  })

  return (
    (typeof featureEnd === 'string' ? parseInt(featureEnd) : featureEnd) >= startTime &&
    (typeof featureStart === 'string' ? parseInt(featureStart) : featureStart) < endTime
  )
}

export function getFilterExtensionSize(filterExtensionProps: FilterExtensionProps): number {
  const hasFilters = Object.keys(filterExtensionProps).length > 0
  return hasFilters
    ? filterExtensionProps.filterRange && Array.isArray(filterExtensionProps.filterRange[0])
      ? (filterExtensionProps.filterRange as [number, number][]).length
      : 1
    : 0
}
