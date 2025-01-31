import { getUTCDateTime } from '@globalfishingwatch/data-transforms'

import i18n from 'features/i18n/i18n'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { formatDate } from 'features/reports/report-area/area-reports.utils'

import styles from './ReportActivityEvolution.module.css'

const formatTooltipValue = (value: number, payload: any, unit: string) => {
  if (value === undefined || !payload?.range) {
    return null
  }
  const difference = payload.range ? payload.range[1] - value : 0
  const imprecision = value > 0 && (difference / value) * 100
  // TODO review why abs is needed and why we have negative imprecision
  const imprecisionFormatted = imprecision ? Math.round(Math.abs(imprecision)).toString() : '0'
  const valueFormatted = formatI18nNumber(value, { maximumFractionDigits: 2 })
  const valueLabel = `${valueFormatted} ${unit ? unit : ''}`
  const imprecisionLabel =
    imprecisionFormatted !== '0' && valueFormatted !== '0' ? ` ± ${imprecisionFormatted}%` : ''
  return valueLabel + imprecisionLabel
}

export default function BeforeAfterGraphTooltip(props: any) {
  const { active, payload, timeChunkInterval } = props

  if (active && payload && payload.length) {
    const avgLineValue = payload?.find((p: any) => p.name === 'line')
    if (!avgLineValue) return null

    const date = getUTCDateTime(avgLineValue.payload.date).setLocale(i18n.language)
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formatDate(date, timeChunkInterval)}</p>
        <span className={styles.tooltipValue}>
          {formatTooltipValue(
            avgLineValue.payload.avg as number,
            avgLineValue.payload,
            avgLineValue.unit as string
          )}
        </span>
      </div>
    )
  }

  return null
}
