import React from 'react'
import cx from 'classnames'
import { range } from 'lodash'
import { CURRENT_YEAR, FIRST_YEAR_OF_DATA } from 'data/config'
import styles from './TransmissionsTimeline.module.css'

type TransmissionsTimelineProps = {
  firstTransmissionDate: string
  lastTransmissionDate: string
}

const AVAILABLE_YEARS = range(FIRST_YEAR_OF_DATA, CURRENT_YEAR + 1)

function TransmissionsTimeline({
  firstTransmissionDate,
  lastTransmissionDate,
}: TransmissionsTimelineProps) {
  const firstYear = parseInt(firstTransmissionDate.slice(0, 4))
  const lastYear = parseInt(lastTransmissionDate.slice(0, 4))
  return (
    <div className={styles.timelineContainer}>
      {AVAILABLE_YEARS.map((year) => {
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
