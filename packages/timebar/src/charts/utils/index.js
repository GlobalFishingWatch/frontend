export const getTrackY = (numTracks, trackIndex, graphHeight) => {
  const MARGIN_BOTTOM = 10
  const MARGIN_TOP = 5
  const finalHeight = graphHeight - MARGIN_BOTTOM - MARGIN_TOP
  const heightPerTrack = finalHeight / numTracks
  const y = heightPerTrack * trackIndex + heightPerTrack / 2
  return y
}
