import { Segment } from '@globalfishingwatch/api-types'

export const mergeTrackChunks = (chunks: Segment[][]) => {
  return chunks.filter((chunk) => chunk).flat()
}
