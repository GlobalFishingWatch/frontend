import React, { Fragment, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import ImmediateContext from '../immediateContext'
import { DEFAULT_CSS_TRANSITION } from '../constants'
import { TimelineContext } from '../components/timeline'
import styles from './tracks.module.css'
import { getTrackY } from './utils'

const SegmentType = PropTypes.shape({
  start: PropTypes.number,
  end: PropTypes.number,
})
const TrackType = PropTypes.shape({
  color: PropTypes.string,
  segments: PropTypes.arrayOf(SegmentType),
  segmentsOffsetY: PropTypes.boolean,
})

const Segments = ({ segments, color, immediate, y, segmentsOffsetY }) => {
  return segments.map((segment, i) => (
    <div
      key={segment.id}
      className={styles.segment}
      style={{
        backgroundColor: color,
        top: segmentsOffsetY ? y + i : y,
        left: segment.x,
        width: segment.width,
        transition: immediate
          ? 'none'
          : `left ${DEFAULT_CSS_TRANSITION}, width ${DEFAULT_CSS_TRANSITION}`,
      }}
    />
  ))
}
Segments.propTypes = {
  segments: PropTypes.arrayOf(SegmentType).isRequired,
  color: PropTypes.string,
  y: PropTypes.number.isRequired,
}
Segments.defaultProps = {
  color: 'var(--timebar-track-default)',
}

const getCoords = (tracks, outerScale) => {
  if (tracks === null) return null
  const coordTracks = []
  tracks.forEach((track) => {
    if (!track) {
      return
    }
    const coordTrack = {
      color: track.color,
      segmentsOffsetY: track.segmentsOffsetY,
    }
    coordTrack.segments = track.segments.map((segment, id) => {
      if (!outerScale) {
        return { id }
      }
      const x = outerScale(segment.start)
      return {
        id,
        x,
        width: outerScale(segment.end) - x,
      }
    })
    coordTracks.push(coordTrack)
  })
  return coordTracks
}

const Tracks = ({ tracks }) => {
  const { immediate } = useContext(ImmediateContext)
  const { outerScale, graphHeight } = useContext(TimelineContext)
  const trackCoords = useMemo(() => getCoords(tracks, outerScale), [tracks, outerScale])
  if (tracks === null || tracks === undefined) return null

  return (
    <Fragment>
      {trackCoords.map((track, i) => {
        const y = getTrackY(tracks.length, i, graphHeight)
        return (
          <div key={i}>
            <Segments
              segments={track.segments}
              color={track.color}
              immediate={immediate}
              y={y}
              segmentsOffsetY={track.segmentsOffsetY}
            />
          </div>
        )
      })}
    </Fragment>
  )
}

Tracks.propTypes = {
  tracks: PropTypes.arrayOf(TrackType).isRequired,
}

Tracks.defaultProps = {
  tracks: null,
}

export default Tracks
