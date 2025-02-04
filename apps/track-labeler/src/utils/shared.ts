import type { BBox } from 'geojson'

import type { TrackInterface } from '../features/vessels/vessels.slice'

export function typedKeys<T>(o: T): (keyof T)[] {
  // type cast should be safe because that's what really Object.keys() does
  return Object.keys(o as any) as (keyof T)[]
}

export const isFiniteBbox = (bbox: BBox): boolean => {
  return bbox.length === bbox.filter((coord) => Number.isFinite(coord)).length
}

export const findPreviousTimestamp = (timestamps: number[], timestamp: number): number => {
  const index = timestamps.indexOf(timestamp)
  if (index === 0 || index === timestamps.length - 1) {
    return timestamps[index]
  }
  if (index > 0) {
    return timestamps[index - 1]
  }

  //As I understand is not possible to reach this return, is just in case an error appear
  return 0
}

export const findNextTimestamp = (timestamps: number[], timestamp: number): number | null => {
  const index = timestamps.indexOf(timestamp)
  if (index === 0 || index === timestamps.length - 1) {
    return timestamps[index]
  }
  if (index > 0) {
    return timestamps[index + 1]
  }

  return null
}

export const findPreviousPosition = (
  timestamps: number[],
  positions: TrackInterface | null,
  startCoordinate: number,
  coordinateType: 'latitude' | 'longitude'
) => {
  const index = timestamps.indexOf(startCoordinate)
  if (index === -1) return startCoordinate
  return positions?.data?.[0][index][coordinateType]
}

export const findNextPosition = (
  timestamps: number[],
  positions: TrackInterface | null,
  endCoordinate: number,
  coordinateType: 'latitude' | 'longitude'
) => {
  const index = timestamps.indexOf(endCoordinate)
  if (index === -1) return endCoordinate
  return positions?.data?.[0][index + 1][coordinateType]
}
