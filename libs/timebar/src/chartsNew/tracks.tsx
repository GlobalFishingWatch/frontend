import React, { Fragment, useContext, useMemo } from 'react'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import { TimelineContextProps, TimelineScale } from '../types'
import { TimelineContext } from '../components/timeline'
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
  graphHeight: number,
  orientation: string
) => {
  if (tracks === null || !outerScale) return null
  const trackWithCoords: TracksWithCoords = []
  tracks.forEach((track, trackIndex) => {
    if (!track) {
      return
    }
    const baseTrackY = getTrackY(tracks.length, trackIndex, graphHeight)
    let trackY = baseTrackY.y
    if (orientation === 'up') trackY = baseTrackY.y1
    if (orientation === 'down') trackY = baseTrackY.y0
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
      y: trackY,
      // TODO
      // segmentsOffsetY: track.segmentsOffsetY,
    }
    trackWithCoords.push(trackItemWithCoords)
  })
  return trackWithCoords
}

const Tracks = ({
  data,
  orientation = 'middle',
}: {
  data: TimebarChartData
  orientation?: string
}) => {
  const { immediate } = useContext(ImmediateContext) as any
  const { outerScale, graphHeight } = useContext(TimelineContext) as TimelineContextProps

  const filteredTracks = useFilteredChartData(data)
  const tracksWithCoords = useMemo(
    () => getTracksWithCoords(filteredTracks, outerScale, graphHeight, orientation),
    [filteredTracks, outerScale, graphHeight, orientation]
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
