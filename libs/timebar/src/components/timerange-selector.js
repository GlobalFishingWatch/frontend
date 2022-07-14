import React, { Component } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import classNames from 'classnames'
import { InputDate, Select } from '@globalfishingwatch/ui-components'
import { getTime } from '../utils/internal-utils'
import { getLastX } from '../utils'
import styles from './timerange-selector.module.css'

class TimeRangeSelector extends Component {
  constructor(props) {
    super(props)
    const { start, end, labels } = props
    this.lastXOptions = [
      {
        id: 'last30days',
        label: labels.last30days || TimeRangeSelector.defaultProps.labels.last30days,
        num: 30,
        unit: 'day',
      },
      {
        id: 'last3months',
        label: labels.last3months || TimeRangeSelector.defaultProps.labels.last3months,
        num: 3,
        unit: 'month',
      },
      {
        id: 'last6months',
        label: labels.last6months || TimeRangeSelector.defaultProps.labels.last6months,
        num: 6,
        unit: 'month',
      },
      {
        id: 'lastYear',
        label: labels.lastYear || TimeRangeSelector.defaultProps.labels.lastYear,
        num: 1,
        unit: 'year',
      },
    ]
    this.state = {
      start,
      end,
      startValid: true,
      endValid: true,
      currentLastXSelectedOption: this.lastXOptions[0],
    }
  }

  componentDidMount() {
    const { start, end } = this.props
    this.setState({ start, end })
  }

  submit(start, end) {
    const { onSubmit } = this.props

    // on release, "stick" to day/hour
    const newStart = dayjs(start).utc().startOf('day').toISOString()
    const newEnd = dayjs(end).utc().startOf('day').toISOString()
    onSubmit(newStart, newEnd)
  }

  onLastXSelect = (option) => {
    const { latestAvailableDataDate } = this.props
    const { start, end } = getLastX(option.num, option.unit, latestAvailableDataDate)
    this.setState({ currentLastXSelectedOption: option })
    this.setState({ start, end })
  }

  onStartChange = (e, end) => {
    if (!e.target.value || e.target.value === '') return
    const start = dayjs([e.target.value, 'T00:00:00.000Z'].join('')).utc().toISOString()
    const valid = e.target.validity.valid
    const beforeEnd = start < end
    this.setState({ startValid: valid && beforeEnd })
    this.setState({ start })
  }

  onEndChange = (e, start) => {
    if (!e.target.value || e.target.value === '') return
    const end = dayjs([e.target.value, 'T00:00:00.000Z'].join('')).utc().toISOString()
    const valid = e.target.validity.valid
    const afterStart = end > start
    this.setState({ endValid: valid && afterStart })
    this.setState({ end })
  }

  render() {
    const { start, end, startValid, endValid, currentLastXSelectedOption } = this.state
    const { labels, absoluteStart, absoluteEnd } = this.props

    if (start === undefined) {
      return null
    }

    const bounds = {
      min: dayjs(getTime(absoluteStart)).toISOString().slice(0, 10),
      max: dayjs(getTime(absoluteEnd)).toISOString().slice(0, 10),
    }

    const mStart = dayjs(start).utc()
    const mEnd = dayjs(end).utc()
    const disabled = !startValid || !endValid

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
                invalid={!startValid}
                onChange={(e) => this.onStartChange(e, end)}
                min={bounds.min}
                max={bounds.max}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.selectorGroup}>
              <span className={styles.selectorLabel}>{labels.end}</span>
              <InputDate
                value={mEnd.toISOString().slice(0, 10)}
                invalid={!endValid}
                onChange={(e) => this.onEndChange(e, start)}
                min={bounds.min}
                max={bounds.max}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.actions}>
            <Select
              className={classNames(styles.cta, styles.lastX)}
              direction="top"
              options={this.lastXOptions}
              selectedOption={currentLastXSelectedOption}
              onSelect={(selected) => {
                this.onLastXSelect(selected)
              }}
            />

            <button
              type="button"
              disabled={disabled}
              className={classNames(styles.cta, { [styles.disabled]: disabled })}
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
    last3months: PropTypes.string,
    last6months: PropTypes.string,
    lastYear: PropTypes.string,
    done: PropTypes.string,
  }),
}

TimeRangeSelector.defaultProps = {
  labels: {
    title: 'Select a time range',
    start: 'start',
    end: 'end',
    last30days: 'Last 30 days',
    last3months: 'Last 3 months',
    last6months: 'Last 6 months',
    lastYear: 'Last year',
    done: 'done',
  },
}

export default TimeRangeSelector
