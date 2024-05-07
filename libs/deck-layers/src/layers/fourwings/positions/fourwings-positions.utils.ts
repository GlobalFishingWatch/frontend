import type { Feature, Point } from 'geojson'
import { Viewport } from '@deck.gl/core'
import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

export const upperFirst = (text: string) => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : ''
}
export function cleanVesselShipname(name: string) {
  return name.replace(/\b(?![LXIVCDM]+\b)([A-Z,ÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÇÅÆØ]+)\b/g, upperFirst)
}

export function filteredPositionsByViewport(positions: Feature<Point>[], viewport: Viewport) {
  const viewportBounds = viewport.getBounds()
  const viewportPolygon = bboxPolygon(viewportBounds)
  return positions.filter((position) => booleanPointInPolygon(position, viewportPolygon))
}
