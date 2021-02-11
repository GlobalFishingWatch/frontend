export const getTrackY = (numTracks, trackIndex, graphHeight) => {
  const TOTAL_MARGIN = 15
  const finalHeight = graphHeight - TOTAL_MARGIN
  const heightPerTrack = finalHeight / numTracks
  const y = heightPerTrack * trackIndex + heightPerTrack / 2
  return y
}
