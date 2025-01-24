import { Fragment } from 'react'

import i18n from 'features/i18n/i18n'
import { formatDate, formatTooltipValue } from 'features/reports/areas/area-reports.utils'
import { getUTCDateTime } from 'utils/dates'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import styles from './ReportActivityEvolution.module.css'

export const DIFFERENCE = 'difference'
export const BASELINE = 'baseline'
export const COLOR_DECREASE = 'rgb(63, 238, 254)'
export const COLOR_INCREASE = 'rgb(360, 62, 98)'

export default function PeriodComparisonGraphTooltip(props: any) {
  const { active, payload, label, timeChunkInterval, offsetedLastDataUpdate } = props

  if (label && active && payload && payload.length > 0) {
    const difference = payload.find(({ name }: any) => name === DIFFERENCE)
    if (!difference) return null
    const baselineDate = getUTCDateTime(difference?.payload.date).setLocale(i18n.language)
    const compareDate = getUTCDateTime(difference?.payload.compareDate).setLocale(i18n.language)

    const differenceValue = difference?.payload.difference
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formatDate(baselineDate, timeChunkInterval)}</p>
        <span className={styles.tooltipValue}>
          {formatTooltipValue(difference?.payload.baseline as number, difference?.unit as string)}
        </span>
        <p className={styles.tooltipLabel}>{formatDate(compareDate, timeChunkInterval)}</p>
        <span className={styles.tooltipValue}>
          {difference?.payload.date > offsetedLastDataUpdate ? (
            EMPTY_FIELD_PLACEHOLDER
          ) : (
            <Fragment>
              <span
                className={styles.tooltipValueDot}
                style={{ color: differenceValue > 0 ? COLOR_INCREASE : COLOR_DECREASE }}
              ></span>
              {formatTooltipValue(differenceValue as number, difference?.unit as string, true)}
            </Fragment>
          )}
        </span>
      </div>
    )
  }

  return null
}
