import { TrackSegment } from '@globalfishingwatch/api-types'

export const mergeTrackChunks = (chunks: TrackSegment[][]) => {
  return chunks.filter((chunk) => chunk).flat()
}
