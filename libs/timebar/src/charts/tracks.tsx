import React, { Fragment, useContext, useMemo } from 'react'

import { ResourceStatus } from '@globalfishingwatch/api-types'

import type { TimelineScale, TrackGraphOrientation } from '../timelineContext'
import TimelineContext from '../timelineContext'

import { useFilteredChartData, useOuterScale } from './common/hooks'
import type { TimebarChartData, TimebarChartItem, TrackChunkProps } from './common/types'
import { getTrackY } from './common/utils'
import { useUpdateChartsData } from './chartsData.atom'

import styles from './tracks.module.css'

export const MAX_THICK_TRACKS_NUMBER = 2

const getTracksWithCoords = (
  tracks: TimebarChartData<TrackChunkProps>,
  outerScale: TimelineScale,
  graphHeight: number,
  orientation: TrackGraphOrientation
) => {
  if (!tracks || tracks.length === 0 || !outerScale) return null
  const trackWithCoords: TimebarChartData<TrackChunkProps> = []

  const offset = tracks.length > MAX_THICK_TRACKS_NUMBER ? 0.5 : 1.5
  tracks.forEach((track, trackIndex) => {
    if (!track) {
      return
    }
    const baseTrackY = getTrackY(tracks.length, trackIndex, graphHeight, orientation)
    const trackItemWithCoords: TimebarChartItem<TrackChunkProps> = {
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
      y: baseTrackY.defaultY - offset,
      props: {
        segmentsOffsetY: track.props?.segmentsOffsetY,
      },
    }
    trackWithCoords.push(trackItemWithCoords)
  })
  return trackWithCoords
}

const Tracks = ({ data }: { data: TimebarChartData }) => {
  const { graphHeight, trackGraphOrientation } = useContext(TimelineContext)
  const outerScale = useOuterScale()

  const filteredTracks = useFilteredChartData(data)

  useUpdateChartsData('tracks', filteredTracks)
  const tracksWithCoords = useMemo(() => {
    return getTracksWithCoords(filteredTracks, outerScale, graphHeight, trackGraphOrientation)
  }, [filteredTracks, outerScale, graphHeight, trackGraphOrientation])

  if (!tracksWithCoords) return null

  const height = filteredTracks.length > MAX_THICK_TRACKS_NUMBER ? 1 : 2
  return (
    <Fragment>
      {tracksWithCoords.map((track, i) => {
        if (track.status === ResourceStatus.Error) return null
        return (
          <div key={i}>
            {track.status === ResourceStatus.Finished && (
              <Fragment>
                {track.chunks.map((chunk, i) => (
                  <div
                    key={chunk.id}
                    className={styles.segment}
                    data-test="tracks-segment"
                    style={{
                      backgroundColor: chunk.props?.color || track.color,
                      top: track.props?.segmentsOffsetY ? (track.y || 0) + (i % 3) : track.y,
                      left: chunk.x,
                      width: chunk.width,
                      height: chunk.props?.height || height,
                    }}
                  />
                ))}
              </Fragment>
            )}
            {track.status === ResourceStatus.Loading && (
              <div
                style={{
                  top: track.props?.segmentsOffsetY ? (track.y || 0) + i : track.y,
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
