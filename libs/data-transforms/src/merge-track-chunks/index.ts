import { Segment } from '../track-value-array-to-segments'

export const mergeTrackChunks = (chunks: Segment[][]) => {
  chunks.sort(
    (chunkA, chunkB) =>
      (chunkA[0]?.[0]?.timestamp as number) - (chunkB[0]?.[0]?.timestamp as number)
  )
  return chunks
    .map((chunk) => {
      const chunk_ = chunk.map((seg) => {
        const seg_ = seg.map((p) => {
          return {
            ...p,
            d: new Date(p.timestamp as any).toISOString(),
          }
        })
        return seg_
      })
      return chunk_
    })
    .flat()
}
