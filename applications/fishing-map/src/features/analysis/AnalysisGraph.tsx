import React from 'react'
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
import { format } from 'd3-format'
import min from 'lodash/min'
import max from 'lodash/max'
import { DateTime } from 'luxon'
import { Interval } from '@globalfishingwatch/layer-composer'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import i18n from 'features/i18n/i18n'
import styles from './AnalysisGraph.module.css'

export interface GraphData {
  date: string
  min: number[]
  max: number[]
}

interface AnalysisGraphProps {
  timeseries: GraphData[]
  datasets: {
    id: string
    color?: string
    unit?: string
  }[]
  timeChunkInterval?: Interval
}

const tickFormatter = (tick: number) => {
  const formatter = tick < 1 ? '~r' : '~s'
  return format(formatter)(tick)
}

const formatDateTicks = (tick: string, timeChunkInterval: Interval) => {
  const date = DateTime.fromISO(tick).toUTC()
  let formattedTick = ''
  switch (timeChunkInterval) {
    case 'hour':
      formattedTick = date.setLocale(i18n.language).toFormat("ccc', 'DD T")
      break
    default:
      formattedTick = date.setLocale(i18n.language).toFormat("ccc', 'DD")
      break
  }
  return formattedTick
}

const formatTooltipValue = (value: number, payload: any, unit: string) => {
  if (value === undefined || !payload?.range) {
    return null
  }
  const index = payload.avg?.findIndex((avg: number) => avg === value)
  const range = payload.range?.[index]
  const difference = range ? range[1] - value : 0
  const imprecision = value > 0 && (difference / value) * 100
  const valueLabel = `${formatI18nNumber(value?.toFixed())} ${unit ? unit : ''}`
  const imprecisionLabel =
    imprecision && imprecision?.toFixed() !== '0' && value?.toFixed() !== '0'
      ? ` ± ${imprecision?.toFixed()}%`
      : ''
  return valueLabel + imprecisionLabel
}

type AnalysisGraphTooltipProps = {
  active: boolean
  payload: {
    name: string
    dataKey: string
    label: string
    value: number
    payload: any
    color: string
    unit: string
  }[]
  label: string
  timeChunkInterval: Interval
}

const AnalysisGraphTooltip = (props: any) => {
  const { active, payload, label, timeChunkInterval } = props as AnalysisGraphTooltipProps

  if (active && payload && payload.length) {
    const date = DateTime.fromISO(label).toUTC()
    let formattedLabel = ''
    switch (timeChunkInterval) {
      case '10days':
        const timeRangeStart = date.setLocale(i18n.language).toFormat('DDD')
        const timeRangeEnd = date.plus({ days: 9 }).setLocale(i18n.language).toFormat('DDD')
        formattedLabel = `${timeRangeStart} - ${timeRangeEnd}`
        break
      case 'day':
        formattedLabel = date.setLocale(i18n.language).toFormat("ccc', 'DDD")
        break
      default:
        formattedLabel = date.setLocale(i18n.language).toFormat("ccc', 'DDD T")
        break
    }
    const formattedValues = payload.filter(({ name }) => name === 'line')
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formattedLabel}</p>
        <ul>
          {formattedValues.map(({ value, payload, color, unit }, index) => {
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

const AnalysisGraph: React.FC<AnalysisGraphProps> = (props) => {
  const { timeseries, timeChunkInterval = '10days', datasets } = props

  if (!timeseries) return null

  const dataMin: number = timeseries.length
    ? (min(timeseries.flatMap(({ min }) => min)) as number)
    : 0
  const dataMax: number = timeseries.length
    ? (max(timeseries.flatMap(({ max }) => max)) as number)
    : 0

  const domainPadding = (dataMax - dataMin) / 8
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  const dataFormated = timeseries.map(({ date, min, max }) => {
    const range = min.map((m, i) => [m, max[i]])
    const avg = min.map((m, i) => (m + max[i]) / 2)
    return {
      date: date,
      range,
      avg,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={dataFormated} margin={{ top: 15, right: 20, left: -20, bottom: -10 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          interval="preserveStartEnd"
          tickFormatter={(tick: string) => formatDateTicks(tick, timeChunkInterval)}
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
        <Tooltip content={<AnalysisGraphTooltip timeChunkInterval={timeChunkInterval} />} />
        {datasets.map(({ id, color, unit }, index) => (
          <Line
            key={`${id}-line`}
            name="line"
            type="monotone"
            dataKey={(data) => data.avg[index]}
            unit={unit}
            dot={false}
            isAnimationActive={false}
            stroke={color}
            strokeWidth={2}
          />
        ))}
        {datasets.map(({ id, color }, index) => (
          <Area
            key={`${id}-area`}
            name="area"
            type="monotone"
            dataKey={(data) => data.range[index]}
            activeDot={false}
            fill={color}
            stroke="none"
            fillOpacity={0.2}
            isAnimationActive={false}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default AnalysisGraph
