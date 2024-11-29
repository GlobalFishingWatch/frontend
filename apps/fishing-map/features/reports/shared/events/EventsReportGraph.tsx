import React, { useMemo } from 'react'
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ComposedChart,
} from 'recharts'
import min from 'lodash/min'
import max from 'lodash/max'
import type { DurationUnit } from 'luxon';
import { DateTime, Duration } from 'luxon'
import { useTranslation } from 'react-i18next'
import type { FourwingsInterval} from '@globalfishingwatch/deck-loaders';
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import i18n from 'features/i18n/i18n'
import { formatDateForInterval, getUTCDateTime } from 'utils/dates'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { tickFormatter } from 'features/reports/areas/area-reports.utils'
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

const formatDateTicks = (tick: string, timeChunkInterval: FourwingsInterval) => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

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
  const { t } = useTranslation()
  const startMillis = DateTime.fromISO(start).toMillis()
  const endMillis = DateTime.fromISO(end).toMillis()
  const interval = getFourwingsInterval(startMillis, endMillis)

  const domain = useMemo(() => {
    if (start && end && interval) {
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [interval]: 1 })
        .toISO() as string
      return [new Date(start).getTime(), new Date(cleanEnd).getTime()]
    }
  }, [start, end, interval])

  const dataMin: number = timeseries.length
    ? (min(timeseries.map(({ value }: { value: number }) => value)) as number)
    : 0
  const dataMax: number = timeseries.length
    ? (max(timeseries.map(({ value }: { value: number }) => value)) as number)
    : 0

  const domainPadding = (dataMax - dataMin) / 8
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]
  const intervalDiff = Math.floor(
    Duration.fromMillis(endMillis - startMillis).as(interval.toLowerCase() as DurationUnit)
  )
  const fullTimeseries = useMemo(() => {
    if (!timeseries || !domain) {
      return []
    }
    return Array(intervalDiff)
      .fill(0)
      .map((_, i) => i)
      .map((i) => {
        const d = DateTime.fromMillis(startMillis, { zone: 'UTC' })
          .plus({ [interval]: i })
          .toISO()
        return {
          date: d,
          value: timeseries.find(({ date }: { date: string }) => date === d)?.value || 0,
        }
      })
  }, [timeseries, domain, intervalDiff, startMillis, interval])

  if (!fullTimeseries.length || !domain) {
    return null
  }

  return (
    <div className={styles.graph}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={fullTimeseries} margin={graphMargin}>
          <CartesianGrid vertical={false} />
          <XAxis
            domain={domain}
            dataKey="date"
            interval="preserveStartEnd"
            tickFormatter={(tick: string) => formatDateTicks(tick, interval)}
            axisLine={paddedDomain[0] === 0}
          />
          <YAxis
            scale="linear"
            domain={paddedDomain}
            interval="preserveEnd"
            tickFormatter={tickFormatter}
            axisLine={false}
            tickLine={false}
            tickCount={4}
          />
          {timeseries?.length && (
            <Tooltip content={<ReportGraphTooltip timeChunkInterval={interval} />} />
          )}
          <Line
            name="line"
            type="monotone"
            dataKey="value"
            unit={t('common.events', 'Events').toLowerCase()}
            dot={false}
            isAnimationActive={false}
            stroke={color}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
