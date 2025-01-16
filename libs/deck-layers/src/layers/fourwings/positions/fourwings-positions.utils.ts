import type { Viewport } from '@deck.gl/core'
import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

import type { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'

export const upperFirst = (text: string) => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : ''
}

export function cleanVesselShipname(name: string) {
  return name?.replace(/\b(?![LXIVCDM]+\b)([A-Z,ÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÇÅÆØ]+)\b/g, upperFirst) || ''
}

export function getIsActivityPositionMatched(feature: FourwingsPositionFeature) {
  return (
    (feature.properties.shipname && feature.properties.shipname.length > 0) ||
    (feature.properties.id && feature.properties.id.length > 0)
  )
}
export function getIsDetectionsPositionMatched(feature: FourwingsPositionFeature) {
  return (
    (feature.properties.shipname && feature.properties.shipname.length > 0) ||
    (feature.properties.vessel_id && feature.properties.vessel_id.length > 0)
  )
}

export function filteredPositionsByViewport(
  positions: FourwingsPositionFeature[],
  viewport: Viewport
) {
  const viewportBounds = viewport.getBounds()
  const viewportPolygon = bboxPolygon(viewportBounds)
  return positions.filter((position) => booleanPointInPolygon(position, viewportPolygon))
}
