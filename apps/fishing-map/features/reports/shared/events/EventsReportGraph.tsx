import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { ResponsiveTimeseries } from '@globalfishingwatch/responsive-visualizations'
import i18n from 'features/i18n/i18n'
import { formatDateForInterval, getUTCDateTime } from 'utils/dates'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import styles from './EventsReportGraph.module.css'

type EventsReportGraphTooltipProps = {
  active: boolean
  payload: {
    name: string
    dataKey: string
    label: number
    value: number
    payload: any
    color: string
    unit: string
  }[]
  label: number
  timeChunkInterval: FourwingsInterval
}

const ReportGraphTooltip = (props: any) => {
  const { active, payload, label, timeChunkInterval } = props as EventsReportGraphTooltipProps

  if (active && payload && payload.length) {
    const date = getUTCDateTime(label).setLocale(i18n.language)
    const formattedLabel = formatDateForInterval(date, timeChunkInterval)
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formattedLabel}</p>
        <p className={styles.tooltipValue}>
          {formatI18nNumber(payload[0].payload.value)} {payload[0].unit}
        </p>
      </div>
    )
  }

  return null
}

// TODO: REVIEW HOW TO HANDLE INTERVALS IN THIS COMPONENT
const formatDateTicks = (tick: string, timeChunkInterval: FourwingsInterval = 'DAY') => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

export default function EventsReportGraph({
  color = COLOR_PRIMARY_BLUE,
  end,
  start,
  timeseries,
}: {
  color?: string
  end: string
  start: string
  timeseries: { date: string; value: number }[]
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const getAggregatedData = useCallback(async () => timeseries, [timeseries])

  if (!timeseries.length) {
    return null
  }

  return (
    <div ref={containerRef} className={styles.graph}>
      <ResponsiveTimeseries
        start={start}
        end={end}
        containerRef={containerRef}
        getAggregatedData={getAggregatedData}
        tickLabelFormatter={formatDateTicks}
        color={color}
      />
    </div>
  )
}
