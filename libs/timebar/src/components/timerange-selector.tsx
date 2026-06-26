import type { ChangeEvent, MouseEventHandler } from 'react'
import { useMemo, useState } from 'react'
import classNames from 'classnames'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import {
  FOURWINGS_INTERVALS_ORDER,
  getFourwingsInterval,
  LIMITS_BY_INTERVAL,
} from '@globalfishingwatch/deck-loaders'
import { FIRST_YEAR_OF_DATA, Select, Tooltip } from '@globalfishingwatch/ui-components'

import { getLastX, isYearInBounds } from '../utils'

import styles from './timerange-selector.module.css'

const DEFAULT_LABELS = {
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
}

type TimeRangeSelectorProps = {
  onSubmit: (start: string, end: string) => void
  start: string
  end: string
  absoluteStart: string
  absoluteEnd: string
  latestAvailableDataDate?: string
  onDiscard: MouseEventHandler<HTMLDivElement> | undefined
  labels?: Partial<typeof DEFAULT_LABELS>
  /** Quick-select "last N units" options. Defaults to 30 days / 3 + 6 months / 1 year. */
  lastXOptions?: LastXOption[]
}

/** A "last N units" quick-select option (e.g. last 30 days, last 3 months). */
export type LastXOption = {
  id: string
  label: string
  num: number
  unit: DateTimeUnit
}

type DateProperty = 'year' | 'month' | 'day'

type DateInputValues = Record<DateProperty, number | undefined>
type DateInputValids = Record<DateProperty, boolean>

const getDisabledFields = (startDate: DateTime, endDate: DateTime) => {
  const intervalsToCheck: FourwingsInterval[] = ['MONTH', 'DAY']
  return intervalsToCheck.reduce(
    (acc, limit) => {
      const limitConfig = LIMITS_BY_INTERVAL[limit]
      if (limitConfig) {
        const unit = limitConfig.unit === 'year' ? 'years' : limitConfig.unit
        const duration = endDate.diff(startDate, [unit])?.[unit]
        return { ...acc, [limit]: Math.ceil(duration) > limitConfig.value }
      }
      return acc
    },
    {} as Record<FourwingsInterval, boolean>
  )
}

function TimeRangeSelector({
  onSubmit,
  start,
  end,
  absoluteStart,
  absoluteEnd,
  latestAvailableDataDate = '',
  onDiscard,
  labels: labelsProp,
  lastXOptions: lastXOptionsProp,
}: TimeRangeSelectorProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }

  const bounds = useMemo(
    () => ({
      min: DateTime.fromISO(absoluteStart, { zone: 'utc' }).toISO()?.slice(0, 10) || '',
      max: DateTime.fromISO(absoluteEnd, { zone: 'utc' }).toISO()?.slice(0, 10) || '',
    }),
    [absoluteStart, absoluteEnd]
  )

  const lastXOptions = useMemo<LastXOption[]>(
    () =>
      lastXOptionsProp ?? [
        { id: 'last30days', label: labels.last30days, num: 30, unit: 'day' },
        { id: 'last3months', label: labels.last3months, num: 3, unit: 'month' },
        { id: 'last6months', label: labels.last6months, num: 6, unit: 'month' },
        { id: 'lastYear', label: labels.lastYear, num: 1, unit: 'year' },
      ],
    [lastXOptionsProp, labels.last30days, labels.last3months, labels.last6months, labels.lastYear]
  )

  // Initialized once from props (matches the legacy constructor — inputs don't reset on prop change).
  const [startInputValues, setStartInputValues] = useState<DateInputValues>(() => {
    const date = DateTime.fromISO(start, { zone: 'utc' })
    return { year: date.year, month: date.month, day: date.day }
  })
  const [endInputValues, setEndInputValues] = useState<DateInputValues>(() => {
    const date = DateTime.fromISO(end, { zone: 'utc' })
    return { year: date.year, month: date.month, day: date.day }
  })
  const [startInputValids, setStartInputValids] = useState<DateInputValids>(() => ({
    year: isYearInBounds(DateTime.fromISO(start, { zone: 'utc' }).year, { absoluteStart, absoluteEnd }),
    month: true,
    day: true,
  }))
  const [endInputValids, setEndInputValids] = useState<DateInputValids>(() => ({
    year: isYearInBounds(DateTime.fromISO(end, { zone: 'utc' }).year, { absoluteStart, absoluteEnd }),
    month: true,
    day: true,
  }))
  const [currentLastXSelectedOption, setCurrentLastXSelectedOption] = useState<LastXOption>(
    () => lastXOptions[0]
  )

  const submit = (start: DateTime, end: DateTime) => {
    const disabledFields = getDisabledFields(start, end)
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

  const onLastXSelect = (option: LastXOption) => {
    setCurrentLastXSelectedOption(option)
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
    submit(
      startDateTime.endOf(interval.toLowerCase() as DateTimeUnit).plus({ millisecond: 1 }),
      endDateTime.endOf(interval.toLowerCase() as DateTimeUnit).plus({ millisecond: 1 })
    )
  }

  const onDateChange = (
    e: ChangeEvent<HTMLInputElement>,
    property: DateProperty,
    values: DateInputValues,
    setValues: (next: DateInputValues) => void,
    setValids: (update: (prev: DateInputValids) => DateInputValids) => void
  ) => {
    if (property === 'year' && e.target.value.length > 4) {
      e.target.value = e.target.value.slice(0, 4)
    }
    const eventValue = parseInt(e.target.value)
    const date = DateTime.fromObject(values, { zone: 'utc' })
    const currentMonthDays = eventValue
      ? DateTime.fromObject(
          {
            year: property === 'year' ? eventValue : date.year,
            month: property === 'month' ? eventValue : date.month,
          },
          { zone: 'utc' }
        ).daysInMonth
      : undefined
    const dateHigherThanDaysInMonth = date.day > currentMonthDays!
    const nextValues = {
      ...values,
      day: dateHigherThanDaysInMonth ? currentMonthDays : date.day,
      [property]: eventValue || undefined,
    }
    if (!DateTime.fromObject(nextValues).isValid) {
      return
    }
    setValues(nextValues)
    setValids((prev) => ({ ...prev, [property]: e.target.validity.valid }))
  }

  const onDateBlur = (
    e: ChangeEvent<HTMLInputElement>,
    property: DateProperty,
    setValues: (update: (prev: DateInputValues) => DateInputValues) => void,
    setValids: (update: (prev: DateInputValids) => DateInputValids) => void
  ) => {
    if (e.target.value === '') {
      setValues((prev) => ({ ...prev, [property]: undefined }))
      setValids((prev) => ({ ...prev, [property]: true }))
    }
  }

  const onStartChange = (e: ChangeEvent<HTMLInputElement>, property: DateProperty) =>
    onDateChange(e, property, startInputValues, setStartInputValues, setStartInputValids)
  const onEndChange = (e: ChangeEvent<HTMLInputElement>, property: DateProperty) =>
    onDateChange(e, property, endInputValues, setEndInputValues, setEndInputValids)
  const onStartBlur = (e: ChangeEvent<HTMLInputElement>, property: DateProperty) =>
    onDateBlur(e, property, setStartInputValues, setStartInputValids)
  const onEndBlur = (e: ChangeEvent<HTMLInputElement>, property: DateProperty) =>
    onDateBlur(e, property, setEndInputValues, setEndInputValids)

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
    errorMessage = `${labels.selectAValidDate}: ${bounds.min ? bounds.min.slice(0, 4) : ''} - ${(bounds.max
      ? parseInt(bounds.max.slice(0, 4)) + 1
      : DateTime.now().year
    ).toString()}`
  } else if (!startBeforeEnd) {
    errorMessage = labels.endBeforeStart || ''
  }

  const disabledFields = getDisabledFields(startDate, endDate)

  return (
    <div className={styles.TimeRangeSelector}>
      <div
        role="button"
        tabIndex={0}
        data-testid="timerange-veil"
        className={styles.veil}
        onClick={onDiscard}
      />
      <div className={styles.inner}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (startValid && endValid) {
              submit(startDate, endDate)
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
                    min={bounds.min.slice(0, 4)}
                    max={bounds.max.slice(0, 4)}
                    value={startInputValues.year}
                    onChange={(e) => onStartChange(e, 'year')}
                    onBlur={(e) => onStartBlur(e, 'year')}
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
                        disabledFields['MONTH'] && startInputValues.month ? 1 : startInputValues.month
                      }
                      onChange={(e) => onStartChange(e, 'month')}
                      onBlur={(e) => onStartBlur(e, 'month')}
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
                      onChange={(e) => onStartChange(e, 'day')}
                      onBlur={(e) => onStartBlur(e, 'day')}
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
                    min={FIRST_YEAR_OF_DATA}
                    max={(new Date().getUTCFullYear() + 1).toString()}
                    value={endInputValues.year}
                    onChange={(e) => onEndChange(e, 'year')}
                    onBlur={(e) => onEndBlur(e, 'year')}
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
                      onChange={(e) => onEndChange(e, 'month')}
                      onBlur={(e) => onEndBlur(e, 'month')}
                      step={'1'}
                      disabled={
                        disabledFields['MONTH'] ||
                        (endInputValues.year ?? 0) > parseInt(bounds.max.slice(0, 4))
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
                      onChange={(e) => onEndChange(e, 'day')}
                      onBlur={(e) => onEndBlur(e, 'day')}
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
              options={lastXOptions}
              selectedOption={currentLastXSelectedOption}
              onSelect={(selected) => {
                onLastXSelect(selected as LastXOption)
              }}
            />
            <button
              type="submit"
              disabled={!startValid || !endValid || !startBeforeEnd}
              className={styles.cta}
              onClick={() => {
                if (startValid && endValid) {
                  submit(startDate, endDate)
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

export default TimeRangeSelector
