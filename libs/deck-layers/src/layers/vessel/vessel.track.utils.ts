import type { Position } from 'geojson'

import type { TrackPoint } from '@globalfishingwatch/api-types'

import type { VesselTrackPositionFeature } from './VesselPositionLayer'

export function sortedFirstIndexAfter(points: TrackPoint[], time: number) {
  let lo = 0
  let hi = points.length
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (points[mid].timestamp! <= time) {
      lo = mid + 1
    } else {
      hi = mid
    }
  }
  return lo
}

export function sortedFirstIndexAtOrAfter(points: TrackPoint[], time: number) {
  let lo = 0
  let hi = points.length
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (points[mid].timestamp! < time) {
      lo = mid + 1
    } else {
      hi = mid
    }
  }
  return lo
}

export function getPositions(
  points: TrackPoint[],
  { startTime, endTime }: { startTime: number; endTime: number }
): VesselTrackPositionFeature[] {
  const startIndex = sortedFirstIndexAfter(points, startTime)
  const endIndex = sortedFirstIndexAtOrAfter(points, endTime)
  const positions: VesselTrackPositionFeature[] = []
  for (let index = startIndex; index < endIndex; index++) {
    const point = points[index]
    if (!point.timestamp) {
      continue
    }
    positions.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [point.longitude, point.latitude] as Position,
      },
      properties: {
        course: point.course,
        timestamp: point.timestamp,
        pointIndex: index,
      },
    } as VesselTrackPositionFeature)
  }
  return positions
}
