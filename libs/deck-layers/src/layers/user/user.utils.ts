import type { Feature, Point } from 'geojson'

import type { FourwingsFeature, FourwingsStaticFeature } from '@globalfishingwatch/deck-loaders'

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
}
export function isFeatureInRange(
  feature: Feature<Point> | FourwingsFeature | FourwingsStaticFeature,
  { startTime, endTime, startTimeProperty, endTimeProperty }: IsFeatureInRangeParams
) {
  if (!startTime || !endTime) {
    return false
  }
  const featureStart = ((feature.properties as any)?.[startTimeProperty] as number) || 0
  const featureEnd = ((feature.properties as any)?.[endTimeProperty!] as number) || Infinity
  return (
    (typeof featureEnd === 'string' ? parseInt(featureEnd) : featureEnd) >= startTime &&
    (typeof featureStart === 'string' ? parseInt(featureStart) : featureStart) < endTime
  )
}
