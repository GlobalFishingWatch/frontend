import React from 'react'
import cx from 'classnames'
import { CURRENT_YEAR, FIRST_YEAR_OF_DATA } from 'data/config'
import styles from './TransmissionsTimeline.module.css'

type TransmissionsTimelineProps = {
  firstTransmissionDate: string
  lastTransmissionDate: string
}

const YEARS_SICE_FIRST_YEAR_OF_DATA: number[] = new Array(
  CURRENT_YEAR - FIRST_YEAR_OF_DATA + 1
).fill(undefined)

function TransmissionsTimeline({
  firstTransmissionDate,
  lastTransmissionDate,
}: TransmissionsTimelineProps) {
  const firstYear = parseInt(firstTransmissionDate.slice(0, 4))
  const lastYear = parseInt(lastTransmissionDate.slice(0, 4))
  return (
    <div className={styles.timelineContainer}>
      {YEARS_SICE_FIRST_YEAR_OF_DATA.map((_, i) => {
        const year = FIRST_YEAR_OF_DATA + i
        const yearWithTransmissions = year >= firstYear && year <= lastYear
        return (
          <div
            key={year}
            className={cx(styles.year, { [styles.highlighted]: yearWithTransmissions })}
          >
            {year.toString().slice(2, 4)}
          </div>
        )
      })}
    </div>
  )
}

export default TransmissionsTimeline
