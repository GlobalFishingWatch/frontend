import type { Viewport } from '@deck.gl/core'
import { bboxPolygon, booleanPointInPolygon } from '@turf/turf'
import { groupBy, orderBy } from 'es-toolkit'
import type { Feature, Point } from 'geojson'

import type { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'

export const upperFirst = (text: string) => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : ''
}

export function cleanVesselShipname(name: string) {
  return (
    name?.replace(/\b(?![LXIVCDM]+\b)([A-Z,ÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÇÅÆØ]+)(?:\d+)?\b/g, upperFirst) ||
    ''
  )
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

export function getPositionBearing(feature: FourwingsPositionFeature): number | undefined {
  return feature.properties.bearing ?? feature.properties.course
}

export function getIsIdInFilterIds(id: string, ids?: string[]) {
  if (!ids || ids.length === 0) return true
  return ids.includes(id)
}

export function getIsFeatureInFilterIds(feature: FourwingsPositionFeature, ids?: string[]) {
  return getIsIdInFilterIds(feature.properties.id, ids)
}

export type FourwingsPositionsVesselTrack = {
  id: string
  layer: number
  path: [number, number][]
}

export function getVesselTracks(positions: FourwingsPositionFeature[]) {
  const positionsByVessel = groupBy(positions, (p) => p.properties.id)
  const tracks: FourwingsPositionsVesselTrack[] = []
  const lastPositions = new Set<FourwingsPositionFeature>()

  Object.keys(positionsByVessel)
    .filter((id) => id !== 'undefined')
    .forEach((vesselId) => {
      const vesselPositions = orderBy(
        positionsByVessel[vesselId],
        [(p) => p.properties.stime],
        ['asc']
      )
      const lastPosition = vesselPositions[vesselPositions.length - 1]
      lastPositions.add(lastPosition)

      let path: [number, number][] = []
      const pushPath = () => {
        if (path.length > 1) {
          tracks.push({ id: vesselId, layer: lastPosition.properties.layer, path })
        }
        path = []
      }
      vesselPositions.forEach((position) => {
        const coordinates = position.geometry.coordinates as [number, number]
        const previous = path[path.length - 1]
        if (previous && Math.abs(coordinates[0] - previous[0]) > 180) {
          pushPath()
        }
        path.push(coordinates)
      })
      pushPath()
    })

  return { tracks, lastPositions }
}

export function filteredPositionsByViewport<T extends FourwingsPositionFeature | Feature<Point>>(
  positions: T[],
  viewport: Viewport
): T[] {
  const viewportBounds = viewport.getBounds()
  const viewportPolygon = bboxPolygon(viewportBounds)
  return positions.filter((position) => booleanPointInPolygon(position, viewportPolygon))
}
