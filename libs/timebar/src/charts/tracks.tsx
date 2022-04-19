import React, { Fragment, useContext, useMemo } from 'react'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import TimelineContext, { TimelineScale, TrackGraphOrientation } from '../timelineContext'
import ImmediateContext from '../immediateContext'
import { DEFAULT_CSS_TRANSITION } from '../constants'
import { getTrackY } from './common/utils'
import styles from './tracks.module.css'
import { useFilteredChartData, useOuterScale } from './common/hooks'
import { TimebarChartData, TimebarChartItem } from './common/types'
import { useUpdateChartsData } from './chartsData.atom'

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
      props: {
        segmentsOffsetY: track.props?.segmentsOffsetY,
      },
    }
    trackWithCoords.push(trackItemWithCoords)
  })
  return trackWithCoords
}

const Tracks = ({ data }: { data: TimebarChartData }) => {
  const { immediate } = useContext(ImmediateContext)
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
                      top: track.props?.segmentsOffsetY ? (track.y || 0) + i : track.y,
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
