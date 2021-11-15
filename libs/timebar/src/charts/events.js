import React, { Component } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import { stack, stackOrderNone, stackOffsetSilhouette, area, curveStepAfter } from 'd3-shape'
import dayjs from 'dayjs'
import styles from './events.module.css'

const TOP_MARGIN = 5
const BOTTOM_MARGIN = 20

class Events extends Component {
  getFinalEvents = memoize(
    (events, showFishing) => {
      let { labels, counts } = events.series

      if (showFishing !== true) {
        const fishingIndex = labels.indexOf('fishing')
        labels = [...labels.slice(0, fishingIndex), ...labels.slice(fishingIndex + 1)]
        counts = [...counts.slice(0, fishingIndex), ...counts.slice(fishingIndex + 1)]
      }

      const baseUnit = events.offset
      const mStart = dayjs(events.start).utc()
      const mEnd = dayjs(events.end).utc()
      let mCurrentStart = mStart.clone()
      const numUnits = mEnd.diff(mStart, baseUnit)

      const allValues = []
      let maxValue = 0

      for (let dateIndex = 0; dateIndex < numUnits + 1; dateIndex += 1) {
        let valuesAtDateSum = 0
        const valuesAtDate = {
          date: mCurrentStart.toDate(),
        }
        labels.forEach((key, keyIndex) => {
          const value = counts[keyIndex][dateIndex]
          valuesAtDate[key] = value
          valuesAtDateSum += value
        })

        if (
          labels.map((k) => valuesAtDate[k]).filter((v) => v === undefined).length === labels.length
        ) {
          console.warn('there are no values after this date, aborting rendering', valuesAtDate)
          break
        }

        if (valuesAtDateSum > maxValue) {
          maxValue = valuesAtDateSum
        }

        mCurrentStart = mCurrentStart.add(1, baseUnit)
        allValues.push(valuesAtDate)
      }

      const allRatios = []
      allValues.forEach((valuesAtDate) => {
        const ratiosAtDate = { ...valuesAtDate }
        labels.forEach((key) => {
          ratiosAtDate[key] = valuesAtDate[key] / maxValue
        })
        allRatios.push(ratiosAtDate)
      })
      // need to pad with the last value to allow the curveStepAfter line generator to extend
      allRatios.push({
        ...allRatios[allRatios.length - 1],
        date: mCurrentStart.toDate(),
      })

      const stackLayout = stack().keys(labels).order(stackOrderNone).offset(stackOffsetSilhouette)

      return stackLayout(allRatios)
    }
    // TODO need custom equality comparator?
    // (a: mixed, b: mixed) => boolean
    // () => { return true; }
  )

  render() {
    const { events, outerScale, outerWidth, graphHeight, showFishing } = this.props
    // Calculate the latest derived data. If original events data hasn't changed
    // since the last render, `memoize-one` will reuse the last return value.
    // TODO this probably won't work correctly with Redux immutable state as nextProps.events !== props.events?
    const finalEvents = this.getFinalEvents(events, showFishing)

    const finalHeight = graphHeight - TOP_MARGIN - BOTTOM_MARGIN
    const middle = TOP_MARGIN + finalHeight / 2

    const areaGenerator = area()
      .x((d) => outerScale(d.data.date))
      .y0((d) => middle + finalHeight * d[0])
      .y1((d) => middle + finalHeight * d[1])
      .curve(curveStepAfter)
    return (
      <svg width={outerWidth} height={graphHeight} className={styles.Events}>
        {finalEvents.map((eventsForKey, i) => (
          <path
            key={eventsForKey.key + i}
            d={areaGenerator(eventsForKey)}
            className={styles[eventsForKey.key]}
          />
        ))}
      </svg>
    )
  }
}

Events.propTypes = {
  events: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
    offset: PropTypes.string,
    series: PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string),
      counts: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    }),
  }).isRequired,
  outerScale: PropTypes.func.isRequired,
  outerWidth: PropTypes.number.isRequired,
  graphHeight: PropTypes.number.isRequired,
  showFishing: PropTypes.bool,
}

Events.defaultProps = {
  showFishing: false,
}

export default Events
