import i18n from 'features/i18n/i18n'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { formatDate } from 'features/reports/report-area/area-reports.utils'
import { getUTCDateTime } from 'utils/dates'

import styles from './ReportActivityEvolution.module.css'

const formatTooltipValue = (value: number, payload: any, unit: string) => {
  if (value === undefined || !payload?.range) {
    return null
  }
  const index = payload.avg?.findIndex((avg: number) => avg === value)
  const range = payload.range?.[index]
  const difference = range ? range[1] - value : 0
  const imprecision = value > 0 && (difference / value) * 100
  // TODO review why abs is needed and why we have negative imprecision
  const imprecisionFormatted = imprecision ? Math.round(Math.abs(imprecision)).toString() : '0'
  const valueFormatted = formatI18nNumber(value, { maximumFractionDigits: 2 })
  const valueLabel = `${valueFormatted} ${unit ? unit : ''}`
  const imprecisionLabel =
    imprecisionFormatted !== '0' && valueFormatted !== '0' ? ` ± ${imprecisionFormatted}%` : ''
  return valueLabel + imprecisionLabel
}

export default function EvolutionGraphTooltip(props: any) {
  const { active, payload, label, timeChunkInterval } = props

  if (active && payload && payload.length) {
    const date = getUTCDateTime(label).setLocale(i18n.language)
    const formattedLabel = formatDate(date, timeChunkInterval)
    const formattedValues = payload.filter(({ name }: any) => {
      return name === 'line'
    })
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formattedLabel}</p>
        <ul>
          {formattedValues
            .sort((a: any, b: any) => b.value - a.value)
            .map(({ value, payload, color, unit }: any, index: number) => {
              return (
                <li key={index} className={styles.tooltipValue}>
                  <span className={styles.tooltipValueDot} style={{ color }}></span>
                  {formatTooltipValue(value, payload, unit)}
                </li>
              )
            })}
        </ul>
      </div>
    )
  }

  return null
}
