import React, { useMemo } from 'react'
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ComposedChart,
  Area,
} from 'recharts'
import min from 'lodash/min'
import max from 'lodash/max'
import { DateTime } from 'luxon'
import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import i18n from 'features/i18n/i18n'
import { formatDateForInterval, getUTCDateTime } from 'utils/dates'
import { toFixed } from 'utils/shared'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { ReportActivityProps } from 'features/area-report/activity/ReportActivity'
import { formatEvolutionData } from 'features/area-report/reports-timeseries.utils'
import { tickFormatter } from '../reports.utils'
import styles from './ReportActivityEvolution.module.css'

type ReportGraphTooltipProps = {
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

const ReportGraphTooltip = (props: any) => {
  const { active, payload, label, timeChunkInterval } = props as ReportGraphTooltipProps

  if (active && payload && payload.length) {
    const date = getUTCDateTime(label).setLocale(i18n.language)
    const formattedLabel = formatDateForInterval(date, timeChunkInterval)
    const formattedValues = payload.filter(({ name }) => {
      return name === 'line'
    })
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formattedLabel}</p>
        <ul>
          {formattedValues
            .sort((a, b) => b.value - a.value)
            .map(({ value, payload, color, unit }, index) => {
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

const formatDateTicks = (tick: string, timeChunkInterval: FourwingsInterval) => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

export default function ReportActivityGraph({ start, end, data }: ReportActivityProps) {
  const dataFormated = formatEvolutionData(data)

  const domain = useMemo(() => {
    if (start && end && data?.interval) {
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [data?.interval]: 1 })
        .toISO() as string
      return [new Date(start).getTime(), new Date(cleanEnd).getTime()]
    }
  }, [start, end, data?.interval])

  if (!dataFormated || !domain) {
    return null
  }

  const dataMin: number = dataFormated.length
    ? (min(dataFormated.flatMap(({ range }) => range[0][0])) as number)
    : 0
  const dataMax: number = dataFormated.length
    ? (max(dataFormated.flatMap(({ range }) => range[0][1])) as number)
    : 0

  const domainPadding = (dataMax - dataMin) / 8
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  return (
    <div className={styles.graph} data-test="report-activity-evolution">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={dataFormated} margin={graphMargin}>
          <CartesianGrid vertical={false} />
          <XAxis
            domain={domain}
            dataKey="date"
            interval="preserveStartEnd"
            tickFormatter={(tick: string) => formatDateTicks(tick, data?.interval)}
            axisLine={paddedDomain[0] === 0}
            // scale={'time'}
            type={'number'}
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
          {dataFormated?.length && (
            <Tooltip content={<ReportGraphTooltip timeChunkInterval={data?.interval} />} />
          )}
          {data?.sublayers.map(({ id, legend }, index) => (
            <Line
              key={`${id}-line`}
              name="line"
              type="monotone"
              dataKey={(data) => data.avg?.[index]}
              unit={legend?.unit}
              dot={false}
              isAnimationActive={false}
              stroke={legend?.color}
              strokeWidth={2}
            />
          ))}
          {data?.sublayers.map(({ id, legend }, index) => (
            <Area
              key={`${id}-area`}
              name="area"
              type="monotone"
              dataKey={(data) => data.range?.[index]}
              activeDot={false}
              fill={legend?.color}
              stroke="none"
              fillOpacity={0.2}
              isAnimationActive={false}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
