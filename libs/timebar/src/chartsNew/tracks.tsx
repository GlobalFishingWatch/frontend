import React, { Fragment, useContext, useMemo } from 'react'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import TimelineContext, { TimelineScale, TrackGraphOrientation } from '../timelineContext'
import ImmediateContext from '../immediateContext'
import { DEFAULT_CSS_TRANSITION } from '../constants'
import { getTrackY } from './common/utils'
import styles from './tracks.module.css'
import { useFilteredChartData } from './common/hooks'
import { TimebarChartData, TimebarChartItem } from './common/types'

const getTracksWithCoords = (
  tracks: TimebarChartData,
  outerScale: TimelineScale,
  graphHeight: number,
  orientation: TrackGraphOrientation
) => {
  if (tracks === null || !outerScale) return null
  const trackWithCoords: TimebarChartData = []
  tracks.forEach((track, trackIndex) => {
    if (!track) {
      return
    }
    const baseTrackY = getTrackY(tracks.length, trackIndex, graphHeight, orientation)
    const trackItemWithCoords: TimebarChartItem = {
      ...track,
      chunks: !track.chunks
        ? []
        : track.chunks.map((chunk, id) => {
            const x = outerScale(chunk.start)
            return {
              ...chunk,
              id,
              x,
              width: outerScale(chunk.end as number) - x,
            }
          }),
      y: baseTrackY.defaultY,
      // TODO
      // segmentsOffsetY: track.segmentsOffsetY,
    }
    trackWithCoords.push(trackItemWithCoords)
  })
  return trackWithCoords
}

const Tracks = ({ data }: { data: TimebarChartData }) => {
  const { immediate } = useContext(ImmediateContext)
  const { outerScale, graphHeight, trackGraphOrientation } = useContext(TimelineContext)

  const filteredTracks = useFilteredChartData(data)
  const tracksWithCoords = useMemo(
    () => getTracksWithCoords(filteredTracks, outerScale, graphHeight, trackGraphOrientation),
    [filteredTracks, outerScale, graphHeight, trackGraphOrientation]
  )

  if (!tracksWithCoords) return null

  return (
    <Fragment>
      {tracksWithCoords.map((track, i) => {
        return (
          <div key={i}>
            {track.status === ResourceStatus.Finished ? (
              <Fragment>
                {track.chunks.map((chunk, i) => (
                  <div
                    key={chunk.id}
                    className={styles.segment}
                    style={{
                      backgroundColor: track.color,
                      // TODO
                      // top: segmentsOffsetY ? y + i : y,
                      top: track.y,
                      left: chunk.x,
                      width: chunk.width,
                      transition: immediate
                        ? 'none'
                        : `left ${DEFAULT_CSS_TRANSITION}, width ${DEFAULT_CSS_TRANSITION}`,
                    }}
                  />
                ))}
              </Fragment>
            ) : (
              <div
                style={{
                  // TODO
                  // top: track.segmentsOffsetY ? y + i : y,
                  top: track.y,
                }}
                className={styles.loading}
              >
                <div
                  className={styles.loadingBar}
                  style={{
                    backgroundColor: track.color,
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </Fragment>
  )
}

export default Tracks
