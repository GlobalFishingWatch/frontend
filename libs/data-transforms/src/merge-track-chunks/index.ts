import { Segment } from '../track-value-array-to-segments'

export const mergeTrackChunks = (chunks: Segment[][]) => {
  return chunks.filter((chunk) => chunk).flat()
}
