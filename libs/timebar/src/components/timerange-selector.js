import React, { Component } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import classNames from 'classnames'
import { Select } from '@globalfishingwatch/ui-components'
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
      startDate: dayjs.utc(start),
      endDate: dayjs.utc(end),
      startValid: true,
      endValid: true,
      currentLastXSelectedOption: this.lastXOptions[0],
    }
  }

  componentDidMount() {
    const { start, end } = this.props
    this.setState({ startDate: dayjs.utc(start), endDate: dayjs.utc(end) })
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

  onStartChange = (e, property, endDate) => {
    if (!e.target?.value || e.target?.value === '') return
    const { startDate } = this.state
    const start = dayjs.utc({
      year: startDate.year(),
      month: startDate.month(),
      date: startDate.date(),
      hour: startDate.hour(),
      [property]: property === 'month' ? e.target.value - 1 : e.target.value,
    })
    const valid = e.target.validity.valid
    const startBeforeEnd = start.toISOString() < endDate.toISOString()
    this.setState({ startValid: valid && startBeforeEnd, endValid: startBeforeEnd })
    this.setState({ startDate: start })
  }

  onEndChange = (e, property, startDate) => {
    if (!e.target?.value || e.target?.value === '') return
    const { endDate } = this.state
    const end = dayjs.utc({
      year: endDate.year(),
      month: endDate.month(),
      date: endDate.date(),
      hour: endDate.hour(),
      [property]: property === 'month' ? e.target.value - 1 : e.target.value,
    })
    const valid = e.target.validity.valid
    const startBeforeEnd = startDate.toISOString() < end.toISOString()
    this.setState({ startValid: startBeforeEnd, endValid: valid && startBeforeEnd })
    this.setState({ endDate: end })
  }

  onResolutionChange = (option) => {
    this.setState({ resolution: option.id })
  }

  render() {
    const { startDate, endDate, startValid, endValid, currentLastXSelectedOption } = this.state
    const { labels, absoluteStart, absoluteEnd } = this.props

    if (startDate === undefined) {
      return null
    }

    const bounds = {
      min: dayjs.utc(getTime(absoluteStart)).toISOString().slice(0, 10),
      max: dayjs.utc(getTime(absoluteEnd)).toISOString().slice(0, 10),
    }
    const disabled = !startValid || !endValid

    return (
      <div className={styles.TimeRangeSelector}>
        <div className={styles.veil} onClick={this.props.onDiscard} />
        <div className={styles.inner}>
          <h2 className={styles.title}>{labels.title}</h2>
          <div className={styles.datesContainer}>
            <div className={styles.dateContainer}>
              <label className={styles.dateLabel}>{labels.start}</label>
              <div className={styles.selectorsContainer}>
                <div className={styles.selectorGroup}>
                  <label className={styles.selectorLabel}>{labels.year || 'year'}</label>
                  <input
                    type="number"
                    min={bounds.min.slice(0, 4)}
                    max={bounds.max.slice(0, 4)}
                    value={startDate.year().toString()}
                    onChange={(e) => this.onStartChange(e, 'year', endDate)}
                    step={'1'}
                    className={styles.input}
                  />
                </div>
                <div className={styles.selectorGroup}>
                  <label className={styles.selectorLabel}>{labels.month || 'month'}</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={(startDate.month() + 1).toString()}
                    onChange={(e) => this.onStartChange(e, 'month', endDate)}
                    step={'1'}
                    className={styles.input}
                  />
                </div>
                <div className={styles.selectorGroup}>
                  <label className={styles.selectorLabel}>{labels.day || 'day'}</label>
                  <input
                    type="number"
                    min={'1'}
                    max={'31'}
                    value={startDate.date().toString()}
                    onChange={(e) => this.onStartChange(e, 'date', endDate)}
                    step={'1'}
                    className={styles.input}
                  />
                </div>
                <div className={styles.selectorGroup}>
                  <label className={styles.selectorLabel}>{labels.hour || 'hour'}</label>
                  <input
                    type="number"
                    min={'0'}
                    max={'23'}
                    value={startDate.hour().toString()}
                    onChange={(e) => this.onStartChange(e, 'hour', endDate)}
                    step={'1'}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
            <div className={styles.dateContainer}>
              <label className={styles.dateLabel}>{labels.end}</label>
              <div className={styles.selectorsContainer}>
                <div className={styles.selectorGroup}>
                  <label className={styles.selectorLabel}>{labels.year || 'year'}</label>
                  <input
                    type="number"
                    min={bounds.min.slice(0, 4)}
                    max={bounds.max.slice(0, 4)}
                    value={endDate.year().toString()}
                    onChange={(e) => this.onEndChange(e, 'year', startDate)}
                    step={'1'}
                    className={styles.input}
                  />
                </div>
                <div className={styles.selectorGroup}>
                  <label className={styles.selectorLabel}>{labels.month || 'month'}</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={(endDate.month() + 1).toString()}
                    onChange={(e) => this.onEndChange(e, 'month', startDate)}
                    step={'1'}
                    className={styles.input}
                  />
                </div>
                <div className={styles.selectorGroup}>
                  <label className={styles.selectorLabel}>{labels.day || 'day'}</label>
                  <input
                    type="number"
                    min={'1'}
                    max={'31'}
                    value={endDate.date().toString()}
                    onChange={(e) => this.onEndChange(e, 'date', startDate)}
                    step={'1'}
                    className={styles.input}
                  />
                </div>
                <div className={styles.selectorGroup}>
                  <label className={styles.selectorLabel}>{labels.hour || 'hour'}</label>
                  <input
                    type="number"
                    min={'0'}
                    max={'23'}
                    value={endDate.hour().toString()}
                    onChange={(e) => this.onEndChange(e, 'hour', startDate)}
                    step={'1'}
                    className={styles.input}
                  />
                </div>
              </div>
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
                this.submit(startDate.toISOString(), endDate.toISOString())
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
    startDate: PropTypes.object,
    endDate: PropTypes.object,
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
    startDate: 'startDate',
    endDate: 'endDate',
    last30days: 'Last 30 days',
    last3months: 'Last 3 months',
    last6months: 'Last 6 months',
    lastYear: 'Last year',
    done: 'done',
  },
}

export default TimeRangeSelector
