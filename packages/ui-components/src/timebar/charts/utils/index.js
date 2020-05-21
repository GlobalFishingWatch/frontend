export const getTrackY = (numTracks, trackIndex, graphHeight) => {
  const Y_TRACK_SPACE = 14
  const totalHeightOffset = ((numTracks - 1) * Y_TRACK_SPACE) / 2
  const startY = -8 + graphHeight / 2
  const y = startY + trackIndex * Y_TRACK_SPACE - totalHeightOffset
  return y
}
