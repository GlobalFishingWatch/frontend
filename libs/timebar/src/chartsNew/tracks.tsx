import React, { Fragment, useContext, useMemo } from 'react'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import { TimelineContext, TimelineContextProps, TimelineScale } from '..'
import ImmediateContext from '../immediateContext'
import { DEFAULT_CSS_TRANSITION } from '../constants'
import { getTrackY } from './common/utils'
import styles from './tracks.module.css'
import { useFilteredChartData } from './common/hooks'
import { TimebarChartData, TimebarChartDataChunk, TimebarChartDataItem } from '.'

type TrackChunkWithCoords = TimebarChartDataChunk & { x?: number; width?: number }
type TrackItemWithCoords = Omit<TimebarChartDataItem, 'chunks'> & {
  y: number
  chunks: TrackChunkWithCoords[]
}
type TracksWithCoords = TrackItemWithCoords[]

const getTracksWithCoords = (
  tracks: TimebarChartData,
  outerScale: TimelineScale,
  graphHeight: number
) => {
  if (tracks === null || !outerScale) return null
  const trackWithCoords: TracksWithCoords = []
  tracks.forEach((track, trackIndex) => {
    if (!track) {
      return
    }
    const trackItemWithCoords: TrackItemWithCoords = {
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
      y: getTrackY(tracks.length, trackIndex, graphHeight),
      // TODO
      // segmentsOffsetY: track.segmentsOffsetY,
    }
    trackWithCoords.push(trackItemWithCoords)
  })
  return trackWithCoords
}

const Tracks = ({ data }: { data: TimebarChartData }) => {
  const { immediate } = useContext(ImmediateContext) as any
  const { outerScale, graphHeight } = useContext(TimelineContext) as TimelineContextProps

  const filteredTracks = useFilteredChartData(data)
  const tracksWithCoords = useMemo(
    () => getTracksWithCoords(filteredTracks, outerScale, graphHeight),
    [filteredTracks, outerScale, graphHeight]
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
