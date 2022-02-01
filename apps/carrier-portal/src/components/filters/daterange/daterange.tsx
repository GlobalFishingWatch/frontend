import React, { Component, createRef } from 'react'
import cx from 'classnames'
import DatePicker from 'react-datepicker'
import { DateRange } from 'components/filters/filters'
import { ReactComponent as IconDelete } from 'assets/icons/delete.svg'
import IconButton from 'components/icon-button/icon-button'
import { getUTCDate } from 'utils'
import { DATE_FORMAT } from 'data/constants'
import styles from './daterange.module.css'
import './datepicker.scss'

interface DaterangeProps {
  dateRange: DateRange
  className: string
  label: string
  datasetDates: {
    start: string
    end: string
  }
  setDateRange: (dateRange: DateRange) => void
  onCleanClick?: (date: 'start' | 'end') => void
}

class Daterange extends Component<DaterangeProps> {
  afterRef = createRef<DatePicker>()
  beforeRef = createRef<DatePicker>()

  handleDateChange = (date: Date, interval: 'start' | 'end') => {
    const { dateRange } = this.props
    this.props.setDateRange({
      ...dateRange,
      [interval]: date
        ? new Date(date.getTime() - date.getTimezoneOffset() * 1000 * 60).toISOString()
        : null,
    })
  }

  handleAfterDateChange = (date: Date) => {
    this.handleDateChange(date, 'start')
  }

  handleBeforeDateChange = (date: Date) => {
    this.handleDateChange(date, 'end')
  }

  handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const node = this.beforeRef && (this.beforeRef.current as any).calendar
    if (node && !node.componentNode.contains(event.target)) {
      if (this.beforeRef.current) this.beforeRef.current.setBlur()
    }
  }

  render() {
    const { dateRange, className, label, onCleanClick, datasetDates } = this.props
    const isStartDefault = dateRange.start === datasetDates.start
    const isEndDefault = dateRange.end === datasetDates.end
    const startDate = dateRange.start !== null ? getUTCDate(dateRange.start) : null
    const endDate = dateRange.end !== null ? getUTCDate(dateRange.end) : null
    const maxDate = getUTCDate(datasetDates.end)
    const minDate = getUTCDate(datasetDates.start)

    return (
      <div className={cx(className, 'react-datepicker-open')}>
        {label && <label>{label}</label>}
        <div className={styles.datePickerContainer}>
          <span
            title="Start:"
            className={cx(styles.title, {
              [styles.titleSecondary]: isStartDefault,
            })}
          />
          <DatePicker
            ref={this.afterRef}
            className={cx(styles.input, {
              [styles.inputSecondary]: isStartDefault,
            })}
            selectsStart
            dateFormat={DATE_FORMAT}
            onClickOutside={this.handleClickOutside}
            selected={startDate}
            shouldCloseOnSelect={false}
            startDate={startDate}
            endDate={endDate}
            maxDate={maxDate}
            minDate={minDate}
            onChange={this.handleAfterDateChange}
          />
          {onCleanClick !== undefined && !isStartDefault && (
            <IconButton
              size="small"
              aria-label="Remove filter"
              className={styles.cleanBtn}
              onClick={() => onCleanClick('start')}
            >
              <IconDelete />
            </IconButton>
          )}
        </div>

        <div className={styles.datePickerContainer}>
          <span
            title="End:"
            className={cx(styles.title, {
              [styles.titleSecondary]: isEndDefault,
            })}
          />
          <DatePicker
            // open={open}
            ref={this.beforeRef}
            className={cx(styles.input, {
              [styles.inputSecondary]: isEndDefault,
            })}
            selectsEnd
            dateFormat={DATE_FORMAT}
            selected={endDate}
            shouldCloseOnSelect={false}
            startDate={startDate}
            endDate={endDate}
            maxDate={maxDate}
            minDate={minDate}
            onChange={this.handleBeforeDateChange}
          />
          {onCleanClick !== undefined && !isEndDefault && (
            <IconButton
              size="small"
              aria-label="Remove filter"
              className={styles.cleanBtn}
              onClick={() => onCleanClick('end')}
            >
              <IconDelete />
            </IconButton>
          )}
        </div>
      </div>
    )
  }
}

export default Daterange
