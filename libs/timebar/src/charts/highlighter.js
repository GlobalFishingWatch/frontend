import React, { useMemo, useContext, Fragment } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { getDefaultFormat } from '../utils/internal-utils'
import TimelineContext from '../timelineContext'
import styles from './highlighter.module.css'

const getCoords = (hoverStart, hoverEnd, outerScale) => {
  const hoverStartDate = new Date(hoverStart)
  const hoverEndDate = new Date(hoverEnd)
  const left = outerScale(hoverStartDate)
  const width = outerScale(hoverEndDate) - left
  const centerDate = new Date(
    Math.round(hoverStartDate.getTime() + (hoverEndDate.getTime() - hoverStartDate.getTime()) / 2)
  )
  const format = getDefaultFormat(hoverStart, hoverEnd)
  const centerDateLabel = dayjs(centerDate).utc().format(format)
  const center = outerScale(centerDate)
  return {
    left,
    center,
    width,
    centerDate,
    centerDateLabel,
  }
}

const getValuesAtCenter = (activity, centerDate) => {
  if (activity === null) return null
  const centerTime = centerDate.getTime()

  return activity.map((track) => {
    if (!track) return null
    if (!track.segmentsWithCurrentFeature) return null
    for (let s = 0; s < track.segmentsWithCurrentFeature.length; s++) {
      const segment = track.segmentsWithCurrentFeature[s]
      const segmentLength = segment.length
      const firstSegment = segment[0]
      const segmentStart = firstSegment && firstSegment.date
      const latestSegment = segment[segmentLength - 1]
      const segmentEnd = latestSegment && latestSegment.date
      if (centerDate > segmentStart && centerDate < segmentEnd) {
        for (let i = 0; i < segmentLength; i++) {
          const point = segment[i]
          const nextPoint = segment[i + 1]
          const time = point.date
          const nextTime = nextPoint ? nextPoint.date : Number.POSITIVE_INFINITY
          if (centerTime > time && centerTime <= nextTime) {
            return point.value
          }
        }
      }
    }
    return null
  })
}

const truncDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2)

const getFormattedValuesAtCenter = (activity, centerDate, unit) => {
  const valuesAtCenter = getValuesAtCenter(activity, centerDate)
  const valueLabel =
    valuesAtCenter !== null
      ? valuesAtCenter
          .map((value) => {
            return value === null ? 'Unknown value' : `${truncDecimals(value)} ${unit}`
          })
          .join(' / ')
      : null

  return valueLabel
}

const Highlighter = ({ hoverStart, hoverEnd, activity, unit }) => {
  const { outerScale, graphHeight, tooltipContainer } = useContext(TimelineContext)
  const { width, left, center, centerDate, centerDateLabel } = useMemo(
    () => getCoords(hoverStart, hoverEnd, outerScale),
    [hoverStart, hoverEnd, outerScale]
  )
  const valueLabel = useMemo(
    () => getFormattedValuesAtCenter(activity, centerDate, unit),
    [activity, centerDate, unit]
  )

  if (hoverStart === null || hoverEnd === null) {
    return null
  }

  return (
    <Fragment>
      <div
        className={styles.highlighter}
        style={{
          left,
          width,
          height: graphHeight,
        }}
      ></div>
      {tooltipContainer !== null &&
        ReactDOM.createPortal(
          <div
            className={styles.tooltipContainer}
            style={{
              left: center,
            }}
          >
            <div className={styles.tooltip}>
              <span className={styles.tooltipDate}>{centerDateLabel}</span>
              {valueLabel && <span className={styles.tooltipValue}>{valueLabel}</span>}
            </div>
          </div>,
          tooltipContainer
        )}
    </Fragment>
  )
}

Highlighter.propTypes = {
  hoverStart: PropTypes.string,
  hoverEnd: PropTypes.string,
  activity: PropTypes.arrayOf(
    PropTypes.shape({
      segmentsWithCurrentFeature: PropTypes.array,
      /* arrayOf but removed as were reporting false positives
        PropTypes.shape({
          date: PropTypes.number,
          value: PropTypes.number,
        })
      */
      maxValue: PropTypes.number,
    })
  ),
  unit: PropTypes.string,
  tooltipContainer: PropTypes.node,
}

Highlighter.defaultProps = {
  hoverStart: null,
  hoverEnd: null,
  activity: null,
  tooltipContainer: null,
  unit: '',
}

export default Highlighter
