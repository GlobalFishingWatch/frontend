import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { type FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { BaseResponsiveTimeseriesProps } from '@globalfishingwatch/responsive-visualizations'
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

const AggregatedGraphTooltip = (props: any) => {
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

const IndividualGraphTooltip = ({ data }: { data?: any }) => {
  return data.label
}

const formatDateTicks: BaseResponsiveTimeseriesProps['tickLabelFormatter'] = (
  tick,
  timeChunkInterval
) => {
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
  const getIndividualData = useCallback(async () => {
    return timeseries.map((t) => ({
      date: t.date,
      values: [...new Array(t.value)].map((v, i) => ({ label: t.date, value: i })),
    }))
  }, [timeseries])

  if (!timeseries.length) {
    return null
  }

  return (
    // TODO: remove this ref and move it inside
    <div ref={containerRef} className={styles.graph}>
      <ResponsiveTimeseries
        start={start}
        end={end}
        containerRef={containerRef}
        getAggregatedData={getAggregatedData}
        getIndividualData={getIndividualData}
        tickLabelFormatter={formatDateTicks}
        aggregatedTooltipTooltip={<AggregatedGraphTooltip />}
        individualTooltip={<IndividualGraphTooltip />}
        color={color}
      />
    </div>
  )
}
