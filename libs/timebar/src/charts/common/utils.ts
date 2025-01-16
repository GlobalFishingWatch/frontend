export const TOP_MARGIN = 6
export const BOTTOM_MARGIN = 15
export const MIN_HEIGHT = 2
export const TOTAL_MARGIN = TOP_MARGIN + BOTTOM_MARGIN
export const SPACING = 10

export const getTrackY = (
  numTracks: number,
  trackIndex: number,
  graphHeight: number,
  orientation = 'mirrored'
) => {
  const finalHeight = graphHeight - TOTAL_MARGIN - SPACING * (numTracks - 1)
  const height = finalHeight / numTracks
  const y0 = TOP_MARGIN + height * trackIndex + SPACING * trackIndex
  const y = y0 + height / 2
  const y1 = y0 + height
  let defaultY = y
  if (orientation === 'up') defaultY = y1
  if (orientation === 'down') defaultY = y0
  return {
    y0,
    y,
    y1,
    height,
    defaultY,
  }
}
