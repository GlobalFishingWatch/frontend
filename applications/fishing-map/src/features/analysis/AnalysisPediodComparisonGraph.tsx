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
import { format } from 'd3-format'
import { min, max } from 'lodash'
import { DateTime } from 'luxon'
import { Interval } from '@globalfishingwatch/layer-composer/dist/generators/heatmap/util/time-chunks'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import i18n from 'features/i18n/i18n'
import styles from './AnalysisEvolutionGraph.module.css'

export interface GraphData {
  date: string
  min: number[]
  max: number[]
}

export interface AnalysisGraphProps {
  timeseries: GraphData[]
  sublayers: {
    id: string
    legend: {
      color?: string
      unit?: string
    }
  }[]
  interval: Interval
}

const tickFormatter = (tick: number) => {
  const formatter = tick < 1 ? '~r' : '~s'
  return format(formatter)(tick)
}

const formatDateTicks = (tick: number, start: string, timeChunkInterval: Interval) => {
  const startDate = DateTime.fromISO(start).toUTC()
  const date = DateTime.fromMillis(tick).toUTC().setLocale(i18n.language)
  const diff = date.diff(startDate, ['months', 'days'])

  return diff.months > 1 ? `${diff.days} months` : `${diff.days} days`
}

const formatTooltipValue = (value: number, payload: any, unit: string) => {
  if (value === undefined) {
    return null
  }
  const valueFormatted = formatI18nNumber(value, { maximumFractionDigits: 2 })
  const valueLabel = `${valueFormatted} ${unit ? unit : ''}`
  return valueLabel
}

type AnalysisGraphTooltipProps = {
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

const AnalysisGraphTooltip = (props: any) => {
  const { active, payload, label, timeChunkInterval } = props as AnalysisGraphTooltipProps

  if (active && payload && payload.length) {
    const date = DateTime.fromMillis(label).toUTC().setLocale(i18n.language)
    let formattedLabel = ''
    switch (timeChunkInterval) {
      case 'month':
        formattedLabel = date.toFormat('LLLL y')
        break
      case '10days':
        const timeRangeStart = date.toLocaleString(DateTime.DATE_MED)
        const timeRangeEnd = date.plus({ days: 9 }).toLocaleString(DateTime.DATE_MED)
        formattedLabel = `${timeRangeStart} - ${timeRangeEnd}`
        break
      case 'day':
        formattedLabel = date.toLocaleString(DateTime.DATE_MED)
        break
      default:
        formattedLabel = date.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
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

const AnalysisPeriodComparisonGraph: React.FC<{
  graphData: any
  start: string
  end: string
}> = (props) => {
  const { start, end } = props
  const { interval = '10days' } = props.graphData

  const unit = useMemo(() => {
    return props.graphData?.[0].sublayers[0].unit
  }, [props.graphData])

  const baseline = useMemo(() => {
    return (props.graphData?.[0].timeseries as GraphData[])
      ?.map(({ date, min, max }) => {
        const avg = min[0] + max[0] / 2
        return {
          date: new Date(date).getTime(),
          avg: avg,
        }
      })
      .filter((d) => {
        return !isNaN(d.avg)
      })
  }, [props.graphData])

  const compare = useMemo(() => {
    return (props.graphData?.[0].timeseries as GraphData[])
      ?.map(({ date, min, max }) => {
        const avg = min[1] + max[1] / 2
        return {
          date: new Date(date).getTime(),
          avg: avg,
        }
      })
      .filter((d) => {
        return !isNaN(d.avg)
      })
  }, [props.graphData])

  const range = useMemo(() => {
    return (props.graphData?.[0].timeseries as GraphData[])?.map(({ date, min, max }) => {
      const baseAvg = min[0] + max[0] / 2
      const compareAvg = min[1] + max[1] / 2
      return {
        date: new Date(date).getTime(),
        rangeDecrease: baseAvg >= compareAvg ? [baseAvg, compareAvg] : [baseAvg, baseAvg],
        rangeIncrease: baseAvg <= compareAvg ? [baseAvg, compareAvg] : [baseAvg, baseAvg],
      }
    })
  }, [props.graphData])

  if (!range) return null

  const dataMin: number = range.length
    ? (min(range.flatMap(({ rangeDecrease }) => rangeDecrease[0])) as number)
    : 0
  const dataMax: number = range.length
    ? (max(range.flatMap(({ rangeIncrease }) => rangeIncrease[0])) as number)
    : 0

  const domainPadding = (dataMax - dataMin) / 8
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  return (
    <div className={styles.graph}>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={range} margin={{ top: 15, right: 20, left: -20, bottom: -10 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            domain={[new Date(start).getTime(), new Date(end).getTime()]}
            dataKey="date"
            interval="preserveStartEnd"
            tickFormatter={(tick: number) => formatDateTicks(tick, start, interval)}
            axisLine={paddedDomain[0] === 0}
            scale={'time'}
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
          <Tooltip content={<AnalysisGraphTooltip timeChunkInterval={interval} />} />
          <Line
            key={`base-line`}
            name="line"
            type="step"
            data={baseline}
            dataKey={(data) => data.avg}
            unit={unit}
            dot={false}
            isAnimationActive={false}
            stroke="rgba(22, 63, 137, .65)"
            strokeWidth={2}
          />
          <Line
            key={`compare-line`}
            name="line"
            type="step"
            data={compare}
            dataKey={(data) => data.avg}
            unit={unit}
            dot={false}
            isAnimationActive={false}
            stroke="rgba(22, 63, 137, 1)"
            strokeWidth={2}
          />
          <Area
            key={`decrease-area`}
            name="area"
            type="step"
            dataKey={(data) => data.rangeDecrease}
            activeDot={false}
            fill="rgba(22, 63, 137, 1)"
            stroke="none"
            fillOpacity={0.2}
            isAnimationActive={false}
          />
          <Area
            key={`increase-area`}
            name="area"
            type="step"
            dataKey={(data) => data.rangeIncrease}
            activeDot={false}
            fill="rgba(360, 62, 98, 1)"
            stroke="none"
            fillOpacity={0.2}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalysisPeriodComparisonGraph
