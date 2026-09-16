import type { Viewport } from '@deck.gl/core'
import type { Feature, Point } from 'geojson'

import type { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'

import { POSITIONS_TRACK_MAX_GAP_SECONDS } from '#layers/fourwings/fourwings.config'

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

const filterIdsSets = new WeakMap<string[], Set<string>>()

export function getIsIdInFilterIds(id: string, ids?: string[]) {
  if (!ids || ids.length === 0) return true
  let idsSet = filterIdsSets.get(ids)
  if (!idsSet) {
    idsSet = new Set(ids)
    filterIdsSets.set(ids, idsSet)
  }
  return idsSet.has(id)
}

export function getIsFeatureInFilterIds(feature: FourwingsPositionFeature, ids?: string[]) {
  return getIsIdInFilterIds(feature.properties.id, ids)
}

export type FourwingsPositionsVesselTrack = {
  id: string
  layer: number
  /** Flat `[lon, lat, lon, lat, …]`, read by PathLayer with `positionFormat: 'XY'` */
  path: Float64Array
}

function getTrackPath(positions: FourwingsPositionFeature[], from: number, to: number) {
  const path = new Float64Array((to - from) * 2)
  let lonOffset = 0
  let previousLon: number | undefined
  for (let i = from; i < to; i++) {
    const [lon, lat] = positions[i].geometry.coordinates
    if (previousLon !== undefined) {
      if (lon - previousLon < -180) {
        lonOffset += 360
      } else if (lon - previousLon > 180) {
        lonOffset -= 360
      }
    }
    previousLon = lon
    path[(i - from) * 2] = lon + lonOffset
    path[(i - from) * 2 + 1] = lat
  }
  return path
}

export function getVesselTracks(
  positions: FourwingsPositionFeature[],
  { includeTracks = true }: { includeTracks?: boolean } = {}
) {
  const lastPositionByVessel = new Map<string, FourwingsPositionFeature>()
  const positionsByVessel = includeTracks
    ? new Map<string, FourwingsPositionFeature[]>()
    : undefined

  for (const position of positions) {
    const id = position.properties.id
    if (!id) {
      continue
    }
    lastPositionByVessel.set(id, position)
    if (positionsByVessel) {
      const vesselPositions = positionsByVessel.get(id)
      if (vesselPositions) {
        vesselPositions.push(position)
      } else {
        positionsByVessel.set(id, [position])
      }
    }
  }

  const tracks: FourwingsPositionsVesselTrack[] = []
  positionsByVessel?.forEach((vesselPositions, id) => {
    if (vesselPositions.length < 2) {
      return
    }
    const layer = (lastPositionByVessel.get(id) as FourwingsPositionFeature).properties.layer
    let segmentStart = 0
    for (let i = 1; i <= vesselPositions.length; i++) {
      const isGap =
        i < vesselPositions.length &&
        vesselPositions[i].properties.stime - vesselPositions[i - 1].properties.stime >
          POSITIONS_TRACK_MAX_GAP_SECONDS
      if (i === vesselPositions.length || isGap) {
        if (i - segmentStart > 1) {
          tracks.push({ id, layer, path: getTrackPath(vesselPositions, segmentStart, i) })
        }
        segmentStart = i
      }
    }
  })

  return { tracks, lastPositions: new Set(lastPositionByVessel.values()) }
}

export function filteredPositionsByViewport<T extends FourwingsPositionFeature | Feature<Point>>(
  positions: Iterable<T>,
  viewport: Viewport
): T[] {
  const [minX, minY, maxX, maxY] = viewport.getBounds()
  const positionsInViewport: T[] = []
  for (const position of positions) {
    const [lon, lat] = position.geometry.coordinates
    if (lon >= minX && lon <= maxX && lat >= minY && lat <= maxY) {
      positionsInViewport.push(position)
    }
  }
  return positionsInViewport
}
