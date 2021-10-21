import React, { Component } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import classNames from 'classnames'
import InputDate from '@globalfishingwatch/ui-components/dist/input-date'
import { getTime } from '../utils/internal-utils'
import { getLast30Days } from '../utils'
import styles from './timerange-selector.module.css'

const ONE_DAY_MS = 1000 * 60 * 60 * 24 - 1

class TimeRangeSelector extends Component {
  constructor(props) {
    super(props)
    const { start, end } = props
    this.state = {
      start,
      end,
    }
  }

  componentDidMount() {
    const { start, end } = this.props
    this.setState({
      start,
      end,
    })
  }

  submit(start, end) {
    const { onSubmit } = this.props

    // on release, "stick" to day/hour
    const newStart = dayjs(start).utc().startOf('day').toISOString()
    const newEnd = dayjs(end).utc().startOf('day').toISOString()
    onSubmit(newStart, newEnd)
  }

  last30days = () => {
    const { onSubmit, latestAvailableDataDate } = this.props
    const { start, end } = getLast30Days(latestAvailableDataDate)
    onSubmit(start, end)
  }

  onStartChange = (e) => {
    const start = dayjs([e.target.value, 'T00:00:00.000Z'].join('')).utc().toISOString()
    this.setState({
      start,
    })
  }
  onEndChange = (e) => {
    const end = dayjs([e.target.value, 'T00:00:00.000Z'].join('')).utc().toISOString()
    this.setState({
      end,
    })
  }

  render() {
    const { start, end } = this.state
    const { labels, absoluteStart, absoluteEnd } = this.props

    if (start === undefined) {
      return null
    }

    const bounds = {
      start: {
        min: dayjs(getTime(absoluteStart)).toISOString().slice(0, 10),
        max: dayjs(getTime(end) - ONE_DAY_MS)
          .toISOString()
          .slice(0, 10),
      },
      end: {
        min: dayjs(getTime(start) + ONE_DAY_MS)
          .toISOString()
          .slice(0, 10),
        max: dayjs(getTime(absoluteEnd)).toISOString().slice(0, 10),
      },
    }
    const mStart = dayjs(start).utc()
    const mEnd = dayjs(end).utc()

    return (
      <div className={styles.TimeRangeSelector}>
        <div className={styles.veil} onClick={this.props.onDiscard} />
        <div className={styles.inner}>
          <h2 className={styles.title}>{labels.title}</h2>
          <div className={styles.selectorsContainer}>
            <div className={styles.selectorGroup}>
              <span className={styles.selectorLabel}>{labels.start}</span>
              <InputDate
                value={mStart.toISOString().slice(0, 10)}
                onChange={this.onStartChange}
                min={bounds.start.min}
                max={bounds.start.max}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.selectorGroup}>
              <span className={styles.selectorLabel}>{labels.end}</span>
              <InputDate
                value={mEnd.toISOString().slice(0, 10)}
                onChange={this.onEndChange}
                min={bounds.end.min}
                max={bounds.end.max}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={classNames(styles.cta, styles.secondary)}
              onClick={this.last30days}
            >
              {labels.last30days}
            </button>
            <button
              type="button"
              className={styles.cta}
              onClick={() => {
                this.submit(start, end)
              }}
            >
              {labels.done}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

TimeRangeSelector.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  absoluteStart: PropTypes.string.isRequired,
  absoluteEnd: PropTypes.string.isRequired,
  latestAvailableDataDate: PropTypes.string.isRequired,
  onDiscard: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    title: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
    last30days: PropTypes.string,
    done: PropTypes.string,
  }),
}

TimeRangeSelector.defaultProps = {
  labels: {
    title: 'Select a time range',
    start: 'start',
    end: 'end',
    last30days: 'Last 30 days',
    done: 'done',
  },
}

export default TimeRangeSelector
