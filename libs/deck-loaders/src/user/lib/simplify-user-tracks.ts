import simplify from 'simplify-js'

import type { UserTrackBinaryData, UserTrackLod } from './types'

export function mercatorY(latitude: number): number {
  return (Math.log(Math.tan(Math.PI / 4 + (latitude * Math.PI) / 360)) * 180) / Math.PI
}

/** 0.5px of error at `zoom`. Web Mercator is 512px per world at zoom 0. */
const toleranceAtZoom = (zoom: number) => (0.5 * 360) / (512 * 2 ** zoom)

export const USER_TRACK_LOD_LEVELS: Omit<UserTrackLod, 'binary'>[] = [
  { minZoom: 0, tolerance: toleranceAtZoom(3) },
  { minZoom: 3, tolerance: toleranceAtZoom(5) },
  { minZoom: 5, tolerance: toleranceAtZoom(7) },
  { minZoom: 7, tolerance: toleranceAtZoom(9) },
  { minZoom: 9, tolerance: 0 },
]

type IndexedPoint = { x: number; y: number; i: number }

/**
 * Douglas-Peucker each path down, keeping `getPath` and `getTimestamp` aligned.
 */
export function simplifyUserTrackBinary(
  binary: UserTrackBinaryData,
  tolerance: number
): UserTrackBinaryData {
  const positions = binary?.attributes?.getPath?.value
  const timestamps = binary?.attributes?.getTimestamp?.value
  const startIndices = binary?.startIndices

  if (
    !positions ||
    !timestamps ||
    !startIndices ||
    tolerance <= 0 ||
    timestamps.length !== positions.length / 2
  ) {
    return binary
  }

  const outPositions = new Float32Array(positions.length)
  const outTimestamps = new Float32Array(timestamps.length)
  const outStartIndices: number[] = [0]
  let written = 0

  for (let path = 0; path < startIndices.length - 1; path++) {
    const from = startIndices[path]
    const to = startIndices[path + 1]

    const points: IndexedPoint[] = []
    for (let i = from; i < to; i++) {
      points.push({ x: positions[i * 2], y: mercatorY(positions[i * 2 + 1]), i })
    }
    for (const { i } of simplify(points, tolerance) as IndexedPoint[]) {
      outPositions[written * 2] = positions[i * 2]
      outPositions[written * 2 + 1] = positions[i * 2 + 1]
      outTimestamps[written] = timestamps[i]
      written++
    }
    outStartIndices.push(written)
  }

  return {
    length: binary.length,
    startIndices: outStartIndices,
    attributes: {
      getPath: { value: outPositions.slice(0, written * 2), size: 2 },
      getTimestamp: { value: outTimestamps.slice(0, written), size: 1 },
    },
  }
}

export function buildUserTrackLods(binary: UserTrackBinaryData): UserTrackLod[] {
  return USER_TRACK_LOD_LEVELS.map(({ minZoom, tolerance }) => ({
    minZoom,
    tolerance,
    binary: simplifyUserTrackBinary(binary, tolerance),
  }))
}

export function getUserTrackLodIndex(lods: Pick<UserTrackLod, 'minZoom'>[], zoom: number): number {
  let index = 0
  for (let i = 0; i < lods.length; i++) {
    if (zoom >= lods[i].minZoom) index = i
  }
  return index
}
