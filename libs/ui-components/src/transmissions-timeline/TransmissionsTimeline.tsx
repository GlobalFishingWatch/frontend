import React from 'react'
import cx from 'classnames'
import { range } from 'lodash'
import styles from './TransmissionsTimeline.module.css'

type TransmissionsTimelineProps = {
  firstTransmissionDate: string
  lastTransmissionDate: string
  firstYearOfData: number
  shortYears?: boolean
  parsedYears?: number[]
}

export function TransmissionsTimeline({
  firstTransmissionDate,
  lastTransmissionDate,
  firstYearOfData,
  shortYears,
  parsedYears
}: TransmissionsTimelineProps) {
  const availableYears = range(firstYearOfData, new Date().getFullYear() + 1)
  const firstYear = parseInt(firstTransmissionDate.slice(0, 4))
  const lastYear = parseInt(lastTransmissionDate.slice(0, 4))
  return (
    <div className={styles.timelineContainer}>
      {availableYears.map((year) => {
        const yearWithTransmissions = parsedYears?.length ? parsedYears.includes(year) :
          year >= firstYear && year <= lastYear
        const yearLabel = shortYears ? year.toString().slice(-2) : year.toString()

        return (
          <div
            key={year}
            className={cx(styles.year, { [styles.highlighted]: yearWithTransmissions })}
          >
            {year === firstYear || year === lastYear ? yearLabel : parsedYears?.length ? yearLabel : '‎'}
          </div>
        )
      })}
    </div>
  )
}
