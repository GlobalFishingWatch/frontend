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
import { DateTime } from 'luxon'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import i18n from 'features/i18n/i18n'
import styles from './AnalysisGraph.module.css'

export interface GraphData {
  date: string
  min: number
  max: number
}

interface AnalysisGraphProps {
  timeseries: GraphData[]
  graphColor?: string
  graphUnit?: string
}

const tickFormatter = (tick: number) => {
  const formatter = tick < 1 ? '~r' : '~s'
  return format(formatter)(tick)
}

const formatDates = (tick: string) => {
  const tickDate = DateTime.fromISO(tick)
  return tickDate.toFormat('d LLL yy')
}

const formatTooltipValue = (value: number, payload: any, unit: string) => {
  if (!value || !payload?.range) {
    return null
  }
  const difference = payload.range[1] - value
  const imprecision = (difference / value) * 100
  return `${formatI18nNumber(value.toFixed())} ${unit ? unit : ''} ± ${imprecision.toFixed()}%`
}

type AnalysisGraphTooltipProps = {
  active: boolean
  payload: {
    dataKey: string
    label: string
    value: number
    payload: any
    color: string
    unit: string
  }[]
  label: string
}

const AnalysisGraphTooltip = (props: any) => {
  const { active, payload, label } = props as AnalysisGraphTooltipProps
  if (active && payload && payload.length) {
    const formattedLabel = DateTime.fromISO(label).toLocaleString({ locale: i18n.language })
    const formattedValues = payload.filter(({ dataKey }) => dataKey === 'avg')
    console.log(payload)
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formattedLabel}</p>
        <ul>
          {formattedValues.map(({ value, payload, color, unit }) => {
            return (
              <li className={styles.tooltipValue}>
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
  const { timeseries, graphColor = '#163f89', graphUnit = 'hours' } = props
  const { start, end } = useTimerangeConnect()

  if (!timeseries) return null

  const data = timeseries.filter((current: any) => {
    const currentDate = DateTime.fromISO(current.date)
    const startDate = DateTime.fromISO(start)
    const endDate = DateTime.fromISO(end)
    return currentDate >= startDate && currentDate < endDate
  })

  const dataMax: number = data.length
    ? data.reduce((prev: GraphData, curr: GraphData) => (curr.max > prev.max ? curr : prev)).max
    : 0
  const dataMin: number = data.length
    ? data.reduce((prev: GraphData, curr: GraphData) => (curr.min < prev.min ? curr : prev)).min
    : 0

  const domainPadding = (dataMax - dataMin) / 8
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  const dataFormated = data.map(({ date, min, max }) => ({
    date,
    range: [min, max],
    avg: (min + max) / 2,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={dataFormated} margin={{ top: 15, right: 20, left: -20, bottom: -10 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          interval="preserveStartEnd"
          tickFormatter={(tick: string) => formatDates(tick)}
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
        <Tooltip content={<AnalysisGraphTooltip />} />
        <Line
          type="linear"
          dataKey="avg"
          unit={graphUnit}
          dot={false}
          stroke={graphColor}
          strokeWidth={2}
          isAnimationActive={false}
        />
        <Area dataKey="range" activeDot={false} fill={graphColor} stroke="none" fillOpacity={0.2} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default AnalysisGraph
