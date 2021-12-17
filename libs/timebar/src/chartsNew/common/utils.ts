export const TOP_MARGIN = 5
export const BOTTOM_MARGIN = 20
export const MIN_HEIGHT = 2
export const TOTAL_MARGIN = TOP_MARGIN + BOTTOM_MARGIN

export const getTrackY = (numTracks: number, trackIndex: number, graphHeight: number) => {
  const TOTAL_MARGIN = 15
  const finalHeight = graphHeight - TOTAL_MARGIN
  const height = finalHeight / numTracks
  const y0 = TOP_MARGIN + height * trackIndex
  const y = y0 + height / 2
  const y1 = y0 + height
  return {
    y0,
    y,
    y1,
    height,
  }
}
