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

const DIFFERENCE_INCREASE = 'difference-increase'
const DIFFERENCE_DECREASE = 'difference-decrease'

const tickFormatter = (tick: number) => {
  const formatter = tick < 1 && tick > -1 ? '~r' : '~s'
  return format(formatter)(tick)
}

const formatDateTicks = (tick: number, start: string, timeChunkInterval: Interval) => {
  const startDate = DateTime.fromISO(start).toUTC()
  const date = DateTime.fromMillis(tick).toUTC().setLocale(i18n.language)
  const diff = date.diff(startDate, ['months', 'days'])

  return diff.months >= 1 ? `${diff.months} months` : `${diff.days} days`
}

const formatTooltipValue = (value: number, payload: any, unit: string) => {
  if (value === undefined) {
    return null
  }
  const valueFormatted = formatI18nNumber(value, { maximumFractionDigits: 2 })
  const valueLabel = `${value > 0 ? '+' : ''}${valueFormatted} ${unit ? unit : ''}`
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
    const formattedValues = payload.find(
      ({ name, value }) =>
        (name === DIFFERENCE_INCREASE && value > 0) || (name === DIFFERENCE_DECREASE && value < 0)
    )
    if (!formattedValues) return null
    const { value, payload: linePayload, color, unit } = formattedValues || {}
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formattedLabel}</p>
        <ul>
          <li className={styles.tooltipValue}>
            <span className={styles.tooltipValueDot} style={{ color }}></span>
            {formatTooltipValue(value as number, linePayload, unit as string)}
          </li>
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

  const baseline = (props.graphData?.[0].timeseries as GraphData[])?.map((time) => ({
    date: new Date(time.date).getTime(),
    value: 0,
  }))

  const difference = useMemo(() => {
    return (props.graphData?.[0].timeseries as GraphData[])?.map(({ date, min, max }) => {
      const avgBaseline = min[0] + max[0] / 2
      const avgCompare = min[1] + max[1] / 2
      const difference = avgCompare - avgBaseline
      return {
        date: new Date(date).getTime(),
        valueIncrease: difference >= 0 ? difference : 0,
        valueDecrease: difference < 0 ? difference : 0,
      }
    })
  }, [props.graphData])

  const range = useMemo(() => {
    return (props.graphData?.[0].timeseries as GraphData[])?.map(({ date, min, max }, index) => {
      const baseAvg = min[0] + max[0] / 2
      const avgCompare = min[1] + max[1] / 2
      const difference = avgCompare - baseAvg

      return {
        date: new Date(date).getTime(),
        rangeDecrease: difference <= 0 ? [0, difference] : [0, 0],
        rangeIncrease: difference > 0 ? [0, difference] : [0, 0],
      }
    })
  }, [props.graphData])

  if (!range) return null
  console.log(range)

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
          <Area
            key={`decrease-area`}
            name="area"
            type="step"
            dataKey={(data) => data.rangeDecrease}
            activeDot={false}
            fill="rgb(63, 238, 254)"
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
            fill="rgb(360, 62, 98)"
            stroke="none"
            fillOpacity={0.2}
            isAnimationActive={false}
          />
          <Line
            key={DIFFERENCE_INCREASE}
            name={DIFFERENCE_INCREASE}
            type="step"
            data={difference}
            dataKey={(data) => data.valueIncrease}
            unit={unit}
            dot={false}
            isAnimationActive={false}
            stroke="rgb(360, 62, 98)"
            strokeWidth={2}
          />
          <Line
            key={DIFFERENCE_DECREASE}
            name={DIFFERENCE_DECREASE}
            type="step"
            data={difference}
            dataKey={(data) => data.valueDecrease}
            unit={unit}
            dot={false}
            isAnimationActive={false}
            stroke="rgb(63, 238, 254)"
            strokeWidth={2}
          />
          <Line
            key="baseline"
            name="baseline"
            type="step"
            data={baseline}
            dataKey={(data) => data.value}
            unit={unit}
            dot={false}
            isAnimationActive={false}
            stroke="rgb(111, 138, 182)"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalysisPeriodComparisonGraph
