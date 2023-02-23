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
import { max, min } from 'lodash'
import { DateTime } from 'luxon'
import { Interval } from '@globalfishingwatch/layer-composer'
import i18n from 'features/i18n/i18n'
import { formatDateForInterval, getUTCDateTime } from 'utils/dates'
import { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import styles from './ReportActivityGraph.module.css'
import { formatTooltipValue, tickFormatter } from './reports.utils'

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
  timeChunkInterval: Interval
}
const ReportGraphTooltip = (props: any) => {
  const { active, payload, label, timeChunkInterval } = props as ReportGraphTooltipProps

  if (active && payload && payload.length) {
    const date = getUTCDateTime(label).setLocale(i18n.language)
    const formattedLabel = formatDateForInterval(date, timeChunkInterval)
    const formattedValues = payload.filter(({ name }) => name === 'line')
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formattedLabel}</p>
        <ul>
          {formattedValues
            .sort((a, b) => b.value - a.value)
            .map(({ value, color, unit }, index) => {
              return (
                <li key={index} className={styles.tooltipValue}>
                  <span className={styles.tooltipValueDot} style={{ color }}></span>
                  {formatTooltipValue(value, unit)}
                </li>
              )
            })}
        </ul>
      </div>
    )
  }

  return null
}

const formatDateTicks = (tick: string, timeChunkInterval: Interval) => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

type ReportActivityProps = {
  data: ReportGraphProps
  start: string
  end: string
}
export default function ReportActivityGraph({ start, end, data }: ReportActivityProps) {
  // const [graphStartsInCero, setGraphStartsInCero] = useState(true)
  const dataFormated = useMemo(() => {
    return data?.timeseries
      ?.map(({ date, min, max }) => {
        const range = min.map((m, i) => [m, max[i]])
        const avg = min.map((m, i) => (m + max[i]) / 2)
        return {
          date: new Date(date).getTime(),
          range,
          avg,
        }
      })
      .filter((d) => {
        return !isNaN(d.avg[0])
      })
  }, [data?.timeseries])

  const domain = useMemo(() => {
    if (start && end && data?.interval) {
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [data?.interval]: 1 })
        .toISO()
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
    <div className={styles.graph}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data.timeseries} margin={graphMargin}>
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
          <Tooltip content={<ReportGraphTooltip timeChunkInterval={data?.interval} />} />
          {data?.sublayers.map(({ id, legend }, index) => (
            <Line
              key={`${id}-line`}
              name="line"
              type="monotone"
              dataKey={(data) => data.avg[index]}
              unit={legend.unit}
              dot={false}
              isAnimationActive={false}
              stroke={legend.color}
              strokeWidth={2}
            />
          ))}
          {data?.sublayers.map(({ id, legend }, index) => (
            <Area
              key={`${id}-area`}
              name="area"
              type="monotone"
              dataKey={(data) => data.range[index]}
              activeDot={false}
              fill={legend.color}
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
