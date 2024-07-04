import React, { Component } from 'react'
import classNames from 'classnames'
import { string, func, shape } from 'prop-types'
import dayjs from 'dayjs'
import {
  LIMITS_BY_INTERVAL,
  getFourwingsInterval,
  FOURWINGS_INTERVALS_ORDER,
} from '@globalfishingwatch/deck-layers'
import { Select, Tooltip } from '@globalfishingwatch/ui-components'
import { getTime } from '../utils/internal-utils'
import { getLastX } from '../utils'
import styles from './timerange-selector.module.css'

class TimeRangeSelector extends Component {
  constructor(props) {
    super(props)
    const { start, end, labels, absoluteStart, absoluteEnd } = props
    const startDate = dayjs.utc(start)
    const endDate = dayjs.utc(end)
    this.bounds = {
      min: dayjs.utc(getTime(absoluteStart)).toISOString().slice(0, 10),
      max: dayjs.utc(getTime(absoluteEnd)).toISOString().slice(0, 10),
    }
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
      startInputValues: {
        year: startDate.year(),
        month: startDate.month() + 1,
        date: startDate.date(),
      },
      endInputValues: {
        year: endDate.year(),
        month: endDate.month() + 1,
        date: endDate.date(),
      },
      startInputValids: {
        year: true,
        month: true,
        date: true,
      },
      endInputValids: {
        year: true,
        month: true,
        date: true,
      },
      currentLastXSelectedOption: this.lastXOptions[0],
    }
  }

  submit(start, end) {
    const { onSubmit } = this.props
    const disabledFields = this.getDisabledFields(start, end)
    // on release, "stick" to day/hour
    const newStart = dayjs
      .utc({
        year: start.year(),
        month: disabledFields['MONTH'] ? 0 : start.month(),
        date: disabledFields['DAY'] ? 0 : start.date(),
      })
      .startOf('day')
      .toISOString()
    const newEnd = dayjs
      .utc({
        year: end.year(),
        month: disabledFields['MONTH'] ? 0 : end.month(),
        date: disabledFields['DAY'] ? 0 : end.date(),
      })
      .startOf('day')
      .toISOString()
    onSubmit(newStart, newEnd)
  }

  onLastXSelect = (option) => {
    const { latestAvailableDataDate } = this.props
    const { start, end } = getLastX(option.num, option.unit, latestAvailableDataDate)
    const interval = getFourwingsInterval(start, end, FOURWINGS_INTERVALS_ORDER)
    this.submit(
      dayjs.utc(start).endOf(interval.toLowerCase()).add(1, 'millisecond'),
      dayjs.utc(end).endOf(interval.toLowerCase()).add(1, 'millisecond')
    )
  }

  getDisabledFields = (startDate, endDate) => {
    /** @type {Interval[]} */
    const intervalsToCheck = ['MONTH', 'DAY']
    return intervalsToCheck.reduce((acc, limit) => {
      const limitConfig = LIMITS_BY_INTERVAL[limit]
      if (limitConfig) {
        const duration = endDate.diff(startDate, limitConfig.unit)
        return {
          ...acc,
          [limit]: Math.floor(duration) > limitConfig.value,
        }
      }
    }, {})
  }

  onStartChange = (e, property) => {
    const startDate = dayjs.utc(this.state.startInputValues)
    const endDate = dayjs.utc(this.state.endInputValues)
    const disabledFields = this.getDisabledFields(startDate, endDate)
    const currentMonthDays = dayjs
      .utc({
        year: property === 'year' ? e.target.value : startDate.year(),
        month: property === 'month' ? e.target.value : startDate.month(),
      })
      .daysInMonth()
    const dateHigherThanDaysInMonth = startDate.date() > currentMonthDays
    this.setState((state) => ({
      startInputValues: {
        ...state.startInputValues,
        date: dateHigherThanDaysInMonth ? currentMonthDays : startDate.date(),
        [property]: property.month && disabledFields['MONTH'] ? 0 : e.target.value,
      },
      startInputValids: {
        ...state.startInputValids,
        [property]: e.target.validity.valid,
      },
    }))
  }

  onStartBlur = (e, property) => {
    if (e.target.value === '') {
      this.setState((state) => ({
        startInputValues: {
          ...state.startInputValues,
          [property]: property === 'year' ? this.bounds.min.slice(0, 4) : 1,
        },
        startInputValids: {
          ...state.startInputValids,
          [property]: true,
        },
      }))
    }
  }

  onEndChange = (e, property) => {
    const endDate = dayjs.utc(this.state.endInputValues)
    const currentMonthDays = dayjs
      .utc({
        year: property === 'year' ? e.target.value : endDate.year(),
        month: property === 'month' ? e.target.value : endDate.month(),
      })
      .daysInMonth()
    const dateHigherThanDaysInMonth = endDate.date() > currentMonthDays
    this.setState((state) => ({
      endInputValues: {
        ...state.endInputValues,
        date: dateHigherThanDaysInMonth ? currentMonthDays : endDate.date(),
        [property]: e.target.value,
      },
      endInputValids: {
        ...state.endInputValids,
        [property]: e.target.validity.valid,
      },
    }))
  }

  onEndBlur = (e, property) => {
    if (e.target.value === '') {
      this.setState((state) => ({
        endInputValues: {
          ...state.endInputValues,
          [property]: property === 'year' ? parseInt(this.bounds.max.slice(0, 4)) + 1 : 1,
        },
        endInputValids: {
          ...state.endInputValids,
          [property]: true,
        },
      }))
    }
  }

  onResolutionChange = (option) => {
    this.setState({ resolution: option.id })
  }

  render() {
    const {
      startInputValues,
      endInputValues,
      startInputValids,
      endInputValids,
      currentLastXSelectedOption,
    } = this.state
    const { labels } = this.props

    const startDate = dayjs.utc({
      ...startInputValues,
      month: startInputValues.month - 1,
    })
    const startValid =
      Object.values(startInputValids).every((valid) => valid) &&
      Object.values(startInputValues).every((value) => !!value) &&
      startDate.isValid()
    const endDate = dayjs.utc({
      ...endInputValues,
      month: endInputValues.month - 1,
    })
    const endValid =
      Object.values(endInputValids).every((valid) => valid) &&
      Object.values(endInputValues).every((value) => !!value) &&
      endDate.isValid()
    const startBeforeEnd =
      startValid && endValid ? startDate.toISOString() < endDate.toISOString() : false

    let errorMessage = ''
    if (!startValid || !endValid) {
      errorMessage = `${labels.selectAValidDate}: ${this.bounds.min.slice(0, 4)} - ${(
        parseInt(this.bounds.max.slice(0, 4)) + 1
      ).toString()}`
    } else if (!startBeforeEnd) {
      errorMessage = labels.endBeforeStart
    }

    const disabledFields = this.getDisabledFields(startDate, endDate)

    return (
      <div className={styles.TimeRangeSelector}>
        <div className={styles.veil} onClick={this.props.onDiscard} />
        <div className={styles.inner}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (startValid && endValid) {
                this.submit(startDate.toISOString(), endDate.toISOString())
              }
            }}
          >
            <h2 className={styles.title}>{labels.title}</h2>
            <div className={styles.datesContainer}>
              <div className={styles.dateContainer}>
                <label className={styles.dateLabel}>{labels.start}</label>
                <div className={styles.selectorsContainer}>
                  <div className={classNames(styles.selectorGroup, styles.long)}>
                    <label className={styles.selectorLabel}>{labels.year}</label>
                    <input
                      autoFocus
                      name="start year"
                      type="number"
                      min={this.bounds.min.slice(0, 4)}
                      max={this.bounds.max.slice(0, 4)}
                      value={startInputValues.year}
                      onChange={(e) => this.onStartChange(e, 'year')}
                      onBlur={(e) => this.onStartBlur(e, 'year')}
                      step="1"
                      className={classNames(styles.input, {
                        [styles.error]: !startValid || !startBeforeEnd,
                      })}
                    />
                  </div>
                  <Tooltip content={disabledFields['MONTH'] ? labels.tooLongForMonths : ''}>
                    <div className={styles.selectorGroup}>
                      <label
                        className={classNames(styles.selectorLabel, {
                          [styles.faded]: disabledFields['MONTH'],
                        })}
                      >
                        {labels.month}
                      </label>
                      <input
                        name="start month"
                        type="number"
                        min="1"
                        max="12"
                        value={disabledFields['MONTH'] ? 1 : startInputValues.month}
                        onChange={(e) => this.onStartChange(e, 'month')}
                        onBlur={(e) => this.onStartBlur(e, 'month')}
                        step={'1'}
                        disabled={disabledFields['MONTH']}
                        className={classNames(styles.input, {
                          [styles.error]: !startValid || !startBeforeEnd,
                        })}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip content={disabledFields['DAY'] ? labels.tooLongForDays : ''}>
                    <div className={styles.selectorGroup}>
                      <label
                        className={classNames(styles.selectorLabel, {
                          [styles.faded]: disabledFields['DAY'],
                        })}
                      >
                        {labels.day}
                      </label>
                      <input
                        name="start day"
                        type="number"
                        min={'1'}
                        max={startDate.daysInMonth()}
                        value={disabledFields['DAY'] ? 1 : startInputValues.date}
                        onChange={(e) => this.onStartChange(e, 'date')}
                        onBlur={(e) => this.onStartBlur(e, 'date')}
                        step={'1'}
                        disabled={disabledFields['DAY']}
                        className={classNames(styles.input, {
                          [styles.error]: !startValid || !startBeforeEnd,
                        })}
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className={styles.dateContainer}>
                <label className={styles.dateLabel}>{labels.end}</label>
                <div className={styles.selectorsContainer}>
                  <div className={classNames(styles.selectorGroup, styles.long)}>
                    <label className={styles.selectorLabel}>{labels.year}</label>
                    <input
                      name="end year"
                      type="number"
                      min={this.bounds.min.slice(0, 4)}
                      max={this.bounds.max.slice(0, 4)}
                      value={endInputValues.year}
                      onChange={(e) => this.onEndChange(e, 'year')}
                      onBlur={(e) => this.onEndBlur(e, 'year')}
                      step={'1'}
                      className={classNames(styles.input, {
                        [styles.error]: !endValid || !startBeforeEnd,
                      })}
                    />
                  </div>
                  <Tooltip content={disabledFields['MONTH'] ? labels.tooLongForMonths : ''}>
                    <div className={styles.selectorGroup}>
                      <label
                        className={classNames(styles.selectorLabel, {
                          [styles.faded]: disabledFields['MONTH'],
                        })}
                      >
                        {labels.month}
                      </label>
                      <input
                        name="end month"
                        type="number"
                        min="1"
                        max="12"
                        value={disabledFields['MONTH'] ? 1 : endInputValues.month}
                        onChange={(e) => this.onEndChange(e, 'month')}
                        onBlur={(e) => this.onEndBlur(e, 'month')}
                        step={'1'}
                        disabled={
                          disabledFields['MONTH'] ||
                          endInputValues.year > this.bounds.max.slice(0, 4)
                        }
                        className={classNames(styles.input, {
                          [styles.error]: !endValid || !startBeforeEnd,
                        })}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip content={disabledFields['DAY'] ? labels.tooLongForDays : ''}>
                    <div className={styles.selectorGroup}>
                      <label
                        className={classNames(styles.selectorLabel, {
                          [styles.faded]: disabledFields['DAY'],
                        })}
                      >
                        {labels.day}
                      </label>
                      <input
                        name="end day"
                        type="number"
                        min={'1'}
                        max={endDate.daysInMonth()}
                        value={disabledFields['DAY'] ? 1 : endInputValues.date}
                        onChange={(e) => this.onEndChange(e, 'date')}
                        onBlur={(e) => this.onEndBlur(e, 'date')}
                        step={'1'}
                        disabled={disabledFields['DAY']}
                        className={classNames(styles.input, {
                          [styles.error]: !endValid || !startBeforeEnd,
                        })}
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
            <span className={styles.errorMessage}>{errorMessage}</span>
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
                type="submit"
                disabled={!startValid || !endValid || !startBeforeEnd}
                className={styles.cta}
                onClick={() => {
                  if (startValid && endValid) {
                    this.submit(startDate, endDate)
                  }
                }}
              >
                {labels.done}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

TimeRangeSelector.propTypes = {
  onSubmit: func.isRequired,
  start: string.isRequired,
  end: string.isRequired,
  absoluteStart: string.isRequired,
  absoluteEnd: string.isRequired,
  latestAvailableDataDate: string.isRequired,
  onDiscard: func.isRequired,
  labels: shape({
    title: string,
    start: string,
    end: string,
    year: string,
    month: string,
    day: string,
    selectAValidDate: string,
    endBeforeStart: string,
    tooLongForMonths: string,
    last30days: string,
    last3months: string,
    last6months: string,
    lastYear: string,
    done: string,
  }),
}

TimeRangeSelector.defaultProps = {
  labels: {
    title: 'Select a time range',
    start: 'start',
    end: 'end',
    year: 'year',
    month: 'month',
    day: 'day',
    selectAValidDate: 'Please select a valid date',
    endBeforeStart: 'The end needs to be after the start',
    tooLongForMonths: 'Your timerange is too long to see individual months',
    tooLongForDays: 'Your timerange is too long to see individual days',
    last30days: 'Last 30 days',
    last3months: 'Last 3 months',
    last6months: 'Last 6 months',
    lastYear: 'Last year',
    done: 'done',
  },
}

export default TimeRangeSelector
