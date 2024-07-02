import React, { Fragment, useContext, useEffect, useMemo } from 'react'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import TimelineContext, { TimelineScale, TrackGraphOrientation } from '../timelineContext'
import { getTrackY } from './common/utils'
import styles from './tracks.module.css'
import { useFilteredChartData, useOuterScale } from './common/hooks'
import { TimebarChartData, TimebarChartItem, TrackChunkProps } from './common/types'
import { useUpdateChartsData } from './chartsData.atom'

const getTracksWithCoords = (
  tracks: TimebarChartData<TrackChunkProps>,
  outerScale: TimelineScale,
  graphHeight: number,
  orientation: TrackGraphOrientation
) => {
  if (!tracks || tracks.length === 0 || !outerScale) return null
  const trackWithCoords: TimebarChartData<TrackChunkProps> = []
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
      y: baseTrackY.defaultY,
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
                      height: chunk.props?.height || 1,
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
