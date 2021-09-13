import React from 'react'
import cx from 'classnames'
import { range } from 'lodash'
import styles from './TransmissionsTimeline.module.css'

type TransmissionsTimelineProps = {
  firstTransmissionDate: string
  lastTransmissionDate: string
  firstYearOfData: number
}

function TransmissionsTimeline({
  firstTransmissionDate,
  lastTransmissionDate,
  firstYearOfData,
}: TransmissionsTimelineProps) {
  const availableYears = range(firstYearOfData, new Date().getFullYear() + 1)
  const firstYear = parseInt(firstTransmissionDate.slice(0, 4))
  const lastYear = parseInt(lastTransmissionDate.slice(0, 4))
  return (
    <div className={styles.timelineContainer}>
      {availableYears.map((year) => {
        const yearWithTransmissions = year >= firstYear && year <= lastYear
        return (
          <div
            key={year}
            className={cx(styles.year, { [styles.highlighted]: yearWithTransmissions })}
          >
            {year === firstYear || year === lastYear ? year : '‎'}
          </div>
        )
      })}
    </div>
  )
}

export default TransmissionsTimeline
