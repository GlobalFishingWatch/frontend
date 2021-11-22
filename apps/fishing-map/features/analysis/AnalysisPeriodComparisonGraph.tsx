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
import { DateTime, Interval as TimeInterval } from 'luxon'
import { Interval } from '@globalfishingwatch/layer-composer'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import i18n, { t } from 'features/i18n/i18n'
import styles from './AnalysisEvolutionGraph.module.css'

export interface ComparisonGraphData {
  date: string
  compareDate?: string
  min: number[]
  max: number[]
}

export interface ComparisonGraphProps {
  timeseries: ComparisonGraphData[]
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
const BASELINE = 'baseline'

const tickFormatter = (tick: number) => {
  const formatter = tick < 1 && tick > -1 ? '~r' : '~s'
  return format(formatter)(tick)
}

const formatDateTicks = (tick: number, start: string, timeChunkInterval: Interval) => {
  const startDate = DateTime.fromISO(start).toUTC()
  const date = DateTime.fromMillis(tick).toUTC().setLocale(i18n.language)
  const diff = TimeInterval.fromDateTimes(startDate, date)

  if (!diff.length('hours') && !diff.length('days')) return ''

  return timeChunkInterval === 'hour'
    ? `${diff.length('hours').toFixed()} ${
        diff.length('hours') === 1 ? t('common.hour_one') : t('common.hour_other')
      }`
    : `${diff.length('days').toFixed()} ${
        diff.length('days') === 1 ? t('common.days_one') : t('common.days_other')
      }`
}

const formatTooltipValue = (value: number, unit: string, asDifference = false) => {
  if (value === undefined) {
    return null
  }
  const valueFormatted = formatI18nNumber(value, { maximumFractionDigits: 2 })
  const valueLabel = `${value > 0 && asDifference ? '+' : ''}${valueFormatted} ${unit ? unit : ''}`
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

const formatDate = (date: DateTime, timeChunkInterval: Interval) => {
  let formattedLabel = ''
  switch (timeChunkInterval) {
    case 'month':
      formattedLabel += date.toFormat('LLLL y')
      break
    case '10days':
      const timeRangeStart = date.toLocaleString(DateTime.DATE_MED)
      const timeRangeEnd = date.plus({ days: 9 }).toLocaleString(DateTime.DATE_MED)
      formattedLabel += `${timeRangeStart} - ${timeRangeEnd}`
      break
    case 'day':
      formattedLabel += date.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
      break
    default:
      formattedLabel += date.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
      break
  }
  return formattedLabel
}

const AnalysisGraphTooltip = (props: any) => {
  const { active, payload, label, timeChunkInterval } = props as AnalysisGraphTooltipProps

  if (label && active && payload.length > 0 && payload.length) {
    const baseline = payload.find(({ name }) => name === BASELINE)
    const difference = payload.find(
      ({ name, value }) =>
        (name === DIFFERENCE_INCREASE && value > 0) || (name === DIFFERENCE_DECREASE && value < 0)
    )
    if (!difference) return null
    const baselineDate = DateTime.fromMillis(difference?.payload.date)
      .toUTC()
      .setLocale(i18n.language)
    const compareDate = DateTime.fromMillis(difference?.payload.compareDate)
      .toUTC()
      .setLocale(i18n.language)

    const { value, color, unit } = difference || {}
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formatDate(baselineDate, timeChunkInterval)}</p>
        <span className={styles.tooltipValue}>
          {formatTooltipValue(baseline?.payload.value as number, unit as string)}
        </span>
        <p className={styles.tooltipLabel}>{formatDate(compareDate, timeChunkInterval)}</p>
        <span className={styles.tooltipValue}>
          <span className={styles.tooltipValueDot} style={{ color }}></span>
          {formatTooltipValue(value as number, unit as string, true)}
        </span>
      </div>
    )
  }

  return null
}

const AnalysisPeriodComparisonGraph: React.FC<{
  graphData: ComparisonGraphProps
  start: string
  end: string
}> = (props) => {
  const { start, end } = props
  const { interval, timeseries, sublayers } = props.graphData

  const unit = useMemo(() => {
    return sublayers[0].legend.unit
  }, [sublayers])

  const baseline = useMemo(() => {
    if (!timeseries || !timeseries.length) return []
    return [
      {
        date: DateTime.fromISO(timeseries[0].date).toUTC().toMillis(),
        zero: 0,
      },
      {
        date: DateTime.fromISO(timeseries[timeseries.length - 1].date)
          .toUTC()
          .toMillis(),
        zero: 0,
      },
    ]
  }, [timeseries])

  const difference = useMemo(() => {
    return timeseries?.map(({ date, compareDate, min, max }) => {
      const avgBaseline = min[0] + max[0] / 2
      const avgCompare = min[1] + max[1] / 2
      const difference = avgCompare - avgBaseline
      return {
        date: DateTime.fromISO(date).toUTC().toMillis(),
        ...{ compareDate: compareDate ? DateTime.fromISO(compareDate).toUTC().toMillis() : {} },
        valueIncrease: difference >= 0 ? difference : 0,
        valueDecrease: difference < 0 ? difference : 0,
      }
    })
  }, [timeseries])

  const range = useMemo(() => {
    return timeseries?.map(({ date, compareDate, min, max }, index) => {
      const baseAvg = min[0] + max[0] / 2
      const avgCompare = min[1] + max[1] / 2
      const difference = avgCompare - baseAvg
      return {
        date: DateTime.fromISO(date).toUTC().toMillis(),
        ...{ compareDate: compareDate ? DateTime.fromISO(compareDate).toUTC().toMillis() : {} },
        rangeDecrease: difference <= 0 ? [0, difference] : [0, 0],
        rangeIncrease: difference > 0 ? [0, difference] : [0, 0],
      }
    })
  }, [timeseries])

  if (!range) return null

  return (
    <div className={styles.graph}>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={range} margin={{ top: 15, right: 20, left: -20, bottom: -10 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            domain={[
              DateTime.fromISO(start).toUTC().toMillis(),
              DateTime.fromISO(end).toUTC().toMillis(),
            ]}
            dataKey="date"
            interval="preserveStartEnd"
            tickFormatter={(tick: number) => formatDateTicks(tick, start, interval)}
            scale={'time'}
            type={'number'}
          />
          <YAxis
            scale="linear"
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
            stroke="rgb(22, 63, 137) "
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
            stroke="rgb(22, 63, 137) "
            strokeWidth={2}
          />
          <Line
            key={`${BASELINE}_bg`}
            name={BASELINE}
            data={baseline}
            dataKey={(data) => data.zero}
            dot={false}
            isAnimationActive={false}
            stroke="rgb(229, 240, 242)"
            strokeWidth={2}
          />
          <Line
            key={BASELINE}
            name={BASELINE}
            data={baseline}
            dataKey={(data) => data.zero}
            dot={false}
            isAnimationActive={false}
            stroke="rgb(111, 138, 182)"
            strokeDasharray="2 4"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalysisPeriodComparisonGraph
