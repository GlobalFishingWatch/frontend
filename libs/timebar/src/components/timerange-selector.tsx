import type { ChangeEvent, MouseEventHandler } from 'react'
import { Component } from 'react'
import classNames from 'classnames'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import {
  FOURWINGS_INTERVALS_ORDER,
  getFourwingsInterval,
  LIMITS_BY_INTERVAL,
} from '@globalfishingwatch/deck-loaders'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Select, Tooltip } from '@globalfishingwatch/ui-components'

import { getLastX } from '../utils'

import styles from './timerange-selector.module.css'

type TimeRangeSelectorProps = {
  onSubmit: (start: string, end: string) => void
  start: string
  end: string
  absoluteStart: string
  absoluteEnd: string
  latestAvailableDataDate?: string
  onDiscard: MouseEventHandler<HTMLDivElement> | undefined
  labels: {
    title?: string
    start?: string
    end?: string
    year?: string
    month?: string
    day?: string
    selectAValidDate?: string
    endBeforeStart?: string
    tooLongForMonths?: string
    tooLongForDays?: string
    last30days?: string
    last3months?: string
    last6months?: string
    lastYear?: string
    done?: string
  }
}

type TimeRangeSelectorState = {
  startDate: DateTime
  endDate: DateTime
  startInputValues: Record<string, number>
  endInputValues: Record<string, number>
  startInputValids: Record<string, boolean>
  endInputValids: Record<string, boolean>
  currentLastXSelectedOption: any
}

type LastXOption = SelectOption & { num: number; unit: DateTimeUnit }

type DateProperty = 'year' | 'month' | 'day'

class TimeRangeSelector extends Component<TimeRangeSelectorProps> {
  bounds = {
    min: '',
    max: '',
  }
  lastXOptions: LastXOption[] = []
  state: TimeRangeSelectorState

  static defaultProps = {
    latestAvailableDataDate: '',
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

  constructor(props: TimeRangeSelectorProps) {
    super(props)
    const { start, end, labels, absoluteStart, absoluteEnd } = props
    const startDate = DateTime.fromISO(start, { zone: 'utc' })
    const endDate = DateTime.fromISO(end, { zone: 'utc' })
    this.bounds = {
      min: DateTime.fromISO(absoluteStart, { zone: 'utc' }).toISO()?.slice(0, 10) || '',
      max: DateTime.fromISO(absoluteEnd, { zone: 'utc' }).toISO()?.slice(0, 10) || '',
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
      startDate: DateTime.fromISO(start, { zone: 'utc' }),
      endDate: DateTime.fromISO(end, { zone: 'utc' }),
      startInputValues: {
        year: startDate.year,
        month: startDate.month,
        day: startDate.day,
      },
      endInputValues: {
        year: endDate.year,
        month: endDate.month,
        day: endDate.day,
      },
      startInputValids: {
        year: true,
        month: true,
        day: true,
      },
      endInputValids: {
        year: true,
        month: true,
        day: true,
      },
      currentLastXSelectedOption: this.lastXOptions[0],
    }
  }

  submit(start: DateTime, end: DateTime) {
    const { onSubmit } = this.props
    const disabledFields = this.getDisabledFields(start, end)
    // on release, "stick" to day/hour
    const newStart = DateTime.fromObject(
      {
        year: start.year,
        month: disabledFields['MONTH'] ? 1 : start.month,
        day: disabledFields['DAY'] ? 1 : start.day,
      },
      { zone: 'utc' }
    ).toISO()
    const newEnd = DateTime.fromObject(
      {
        year: end.year,
        month: disabledFields['MONTH'] ? 1 : end.month,
        day: disabledFields['DAY'] ? 1 : end.day,
      },
      { zone: 'utc' }
    )
      .startOf('day')
      .toISO()

    if (newStart && newEnd) {
      onSubmit(newStart, newEnd)
    }
  }

  onLastXSelect = (option: LastXOption) => {
    const { latestAvailableDataDate } = this.props
    const { start, end } = getLastX(option.num, option.unit, latestAvailableDataDate)
    if (!start || !end) {
      return
    }
    const startDateTime = DateTime.fromISO(start, { zone: 'utc' })
    const endDateTime = DateTime.fromISO(end, { zone: 'utc' })
    const interval = getFourwingsInterval(
      startDateTime.toMillis(),
      endDateTime.toMillis(),
      FOURWINGS_INTERVALS_ORDER
    )
    this.submit(
      startDateTime.endOf(interval.toLowerCase() as DateTimeUnit).plus({
        millisecond: 1,
      }),
      endDateTime.endOf(interval.toLowerCase() as DateTimeUnit).plus({
        millisecond: 1,
      })
    )
  }

  getDisabledFields = (startDate: DateTime, endDate: DateTime) => {
    const intervalsToCheck: FourwingsInterval[] = ['MONTH', 'DAY']
    return intervalsToCheck.reduce((acc, limit) => {
      const limitConfig = LIMITS_BY_INTERVAL[limit]
      if (limitConfig) {
        const unit = limitConfig.unit === 'year' ? 'years' : limitConfig.unit
        const duration = endDate.diff(startDate, [unit])?.[unit]
        return {
          ...acc,
          [limit]: Math.ceil(duration) > limitConfig.value,
        }
      }
      return acc
    }, {} as Record<FourwingsInterval, boolean>)
  }

  onStartChange = (e: ChangeEvent<HTMLInputElement>, property: DateProperty) => {
    const eventValue = parseInt(e.target.value)
    const startDate = DateTime.fromObject(this.state.startInputValues, { zone: 'utc' })
    const currentMonthDays = eventValue
      ? DateTime.fromObject(
          {
            year: property === 'year' ? eventValue : startDate.year,
            month: property === 'month' ? eventValue : startDate.month,
          },
          { zone: 'utc' }
        ).daysInMonth
      : undefined
    const dateHigherThanDaysInMonth = startDate.day > currentMonthDays!
    const startInputValues = {
      ...this.state.startInputValues,
      day: dateHigherThanDaysInMonth ? currentMonthDays : startDate.day,
      [property]: eventValue || undefined,
    }
    if (!DateTime.fromObject(startInputValues).isValid) {
      return
    }
    this.setState((state: TimeRangeSelectorState) => ({
      startInputValues,
      startInputValids: {
        ...state.startInputValids,
        [property]: e.target.validity.valid,
      },
    }))
  }

  onStartBlur = (e: ChangeEvent<HTMLInputElement>, property: DateProperty) => {
    if (e.target.value === '') {
      this.setState((state: TimeRangeSelectorState) => ({
        startInputValues: {
          ...state.startInputValues,
          [property]: undefined,
        },
        startInputValids: {
          ...state.startInputValids,
          [property]: true,
        },
      }))
    }
  }

  onEndChange = (e: ChangeEvent<HTMLInputElement>, property: DateProperty) => {
    const eventValue = parseInt(e.target.value)
    const endDate = DateTime.fromObject(this.state.endInputValues, { zone: 'utc' })
    const currentMonthDays = eventValue
      ? DateTime.fromObject(
          {
            year: property === 'year' ? eventValue : endDate.year,
            month: property === 'month' ? eventValue : endDate.month,
          },
          { zone: 'utc' }
        ).daysInMonth
      : undefined
    const dateHigherThanDaysInMonth = endDate.day > currentMonthDays!
    const endInputValues = {
      ...this.state.endInputValues,
      day: dateHigherThanDaysInMonth ? currentMonthDays : endDate.day,
      [property]: eventValue || undefined,
    }
    if (!DateTime.fromObject(endInputValues).isValid) {
      return
    }
    this.setState((state: TimeRangeSelectorState) => ({
      endInputValues,
      endInputValids: {
        ...state.endInputValids,
        [property]: e.target.validity.valid,
      },
    }))
  }

  onEndBlur = (e: ChangeEvent<HTMLInputElement>, property: DateProperty) => {
    if (e.target.value === '') {
      this.setState((state: TimeRangeSelectorState) => ({
        endInputValues: {
          ...state.endInputValues,
          [property]: undefined,
        },
        endInputValids: {
          ...state.endInputValids,
          [property]: true,
        },
      }))
    }
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

    const startDate = DateTime.fromObject(startInputValues, { zone: 'utc' })
    const startValid =
      Object.values(startInputValids).every((valid) => valid) &&
      Object.values(startInputValues).every((value) => !!value) &&
      startDate.isValid
    const endDate = DateTime.fromObject(endInputValues, { zone: 'utc' })
    const endValid =
      Object.values(endInputValids).every((valid) => valid) &&
      Object.values(endInputValues).every((value) => !!value) &&
      endDate.isValid
    const startBeforeEnd = startValid && endValid ? startDate.toISO() < endDate.toISO() : false

    let errorMessage = ''
    if (!startValid || !endValid) {
      errorMessage = `${labels.selectAValidDate}: ${this.bounds.min.slice(0, 4)} - ${(
        parseInt(this.bounds.max.slice(0, 4)) + 1
      ).toString()}`
    } else if (!startBeforeEnd) {
      errorMessage = labels.endBeforeStart || ''
    }

    const disabledFields = this.getDisabledFields(startDate, endDate)

    return (
      <div className={styles.TimeRangeSelector}>
        <div role="button" tabIndex={0} className={styles.veil} onClick={this.props.onDiscard} />
        <div className={styles.inner}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (startValid && endValid) {
                this.submit(startDate, endDate)
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
                      // eslint-disable-next-line jsx-a11y/no-autofocus
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
                        value={
                          disabledFields['MONTH'] && startInputValues.month
                            ? 1
                            : startInputValues.month
                        }
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
                        max={startDate.daysInMonth}
                        value={
                          disabledFields['DAY'] && startInputValues.day ? 1 : startInputValues.day
                        }
                        onChange={(e) => this.onStartChange(e, 'day')}
                        onBlur={(e) => this.onStartBlur(e, 'day')}
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
                        value={
                          disabledFields['MONTH'] && endInputValues.month ? 1 : endInputValues.month
                        }
                        onChange={(e) => this.onEndChange(e, 'month')}
                        onBlur={(e) => this.onEndBlur(e, 'month')}
                        step={'1'}
                        disabled={
                          disabledFields['MONTH'] ||
                          endInputValues.year > parseInt(this.bounds.max.slice(0, 4))
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
                        max={endDate.daysInMonth}
                        value={disabledFields['DAY'] && endInputValues.day ? 1 : endInputValues.day}
                        onChange={(e) => this.onEndChange(e, 'day')}
                        onBlur={(e) => this.onEndBlur(e, 'day')}
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
                  this.onLastXSelect(selected as LastXOption)
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

export default TimeRangeSelector
