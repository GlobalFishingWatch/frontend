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
  ReferenceLine,
} from 'recharts'
import { DateTime, Interval as TimeInterval } from 'luxon'
import { useSelector } from 'react-redux'
import { Interval } from '@globalfishingwatch/layer-composer'
import i18n, { t } from 'features/i18n/i18n'
import { LAST_DATA_UPDATE } from 'data/config'
import { selectAnalysisTimeComparison } from 'features/app/app.selectors'
import { COLOR_GRADIENT, COLOR_PRIMARY_BLUE } from 'features/app/App'
import styles from './AnalysisEvolutionGraph.module.css'
import { formatDate, formatTooltipValue, tickFormatter } from './analysis.utils'

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

const DIFFERENCE = 'difference'
const BASELINE = 'baseline'
const COLOR_DECREASE = 'rgb(63, 238, 254)'
const COLOR_INCREASE = 'rgb(360, 62, 98)'

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

  if (label && active && payload.length > 0 && payload.length) {
    const difference = payload.find(({ name }) => name === DIFFERENCE)
    if (!difference) return null
    const baselineDate = DateTime.fromMillis(difference?.payload.date)
      .toUTC()
      .setLocale(i18n.language)
    const compareDate = DateTime.fromMillis(difference?.payload.compareDate)
      .toUTC()
      .setLocale(i18n.language)

    const differenceValue = difference?.payload.difference
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formatDate(baselineDate, timeChunkInterval)}</p>
        <span className={styles.tooltipValue}>
          {formatTooltipValue(difference?.payload.baseline as number, difference?.unit as string)}
        </span>
        <p className={styles.tooltipLabel}>{formatDate(compareDate, timeChunkInterval)}</p>
        <span className={styles.tooltipValue}>
          <span
            className={styles.tooltipValueDot}
            style={{ color: differenceValue > 0 ? COLOR_INCREASE : COLOR_DECREASE }}
          ></span>
          {formatTooltipValue(differenceValue as number, difference?.unit as string, true)}
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
  const timeComparison = useSelector(selectAnalysisTimeComparison)

  const unit = useMemo(() => {
    return sublayers[0].legend.unit
  }, [sublayers])

  const dtLastDataUpdate = useMemo(() => {
    return DateTime.fromISO(LAST_DATA_UPDATE).toUTC()
  }, [])

  const offsetedLastDataUpdate = useMemo(() => {
    // Need to offset LAST_DATA_UPDATE because graph uses dates from start, not compareStart
    const diff = DateTime.fromISO(timeComparison.compareStart)
      .diff(DateTime.fromISO(timeComparison.start))
      .toMillis()
    const offsetedLastDataUpdate = dtLastDataUpdate
      .minus({
        milliseconds: diff,
      })
      .toUTC()
      .toMillis()
    return offsetedLastDataUpdate
  }, [timeComparison])

  const baseline = useMemo(() => {
    if (!timeseries || !timeseries.length) return []

    return [
      {
        date: DateTime.fromISO(timeseries[0].date).toUTC().toMillis(),
        zero: 0,
      },
      {
        date: Math.min(
          DateTime.fromISO(timeseries[timeseries.length - 1].compareDate)
            .toUTC()
            .toMillis(),
          offsetedLastDataUpdate
        ),
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
        baseline: avgBaseline,
        difference,
      }
    })
  }, [timeseries])

  const range = useMemo(() => {
    return timeseries?.map(({ date, compareDate, min, max }) => {
      const baseAvg = min[0] + max[0] / 2
      const avgCompare = min[1] + max[1] / 2
      const difference = avgCompare - baseAvg
      const dtStart = DateTime.fromISO(date).toUTC()
      const dtCompareStart = DateTime.fromISO(compareDate).toUTC()
      const data = {
        date: dtStart.toMillis(),
        ...{ compareDate: compareDate ? dtCompareStart.toMillis() : {} },
        rangeDecrease: null,
        rangeIncrease: null,
      }
      if (dtStart.toMillis() < offsetedLastDataUpdate) {
        data.rangeDecrease = difference <= 0 ? [0, difference] : [0, 0]
        data.rangeIncrease = difference > 0 ? [0, difference] : [0, 0]
      }
      return data
    })
  }, [timeseries])

  const lastDate = useMemo(() => {
    return range?.[range?.length - 1].date
  }, [range])

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
            fill={COLOR_DECREASE}
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
            fill={COLOR_INCREASE}
            stroke="none"
            fillOpacity={0.2}
            isAnimationActive={false}
          />
          <Line
            key={`${BASELINE}_bg`}
            name={BASELINE}
            data={baseline}
            dataKey={(data) => data.zero}
            dot={false}
            isAnimationActive={false}
            stroke={COLOR_GRADIENT}
            strokeWidth={2}
          />
          <Line
            key={BASELINE}
            name={BASELINE}
            data={baseline}
            dataKey={(data) => data.zero}
            dot={false}
            unit={unit}
            isAnimationActive={false}
            stroke="rgb(111, 138, 182)"
            strokeDasharray="2 4"
            strokeWidth={2}
          />
          <Line
            key={DIFFERENCE}
            name={DIFFERENCE}
            type="step"
            data={difference}
            dataKey={(data) => data.difference}
            unit={unit}
            dot={false}
            isAnimationActive={false}
            stroke={COLOR_PRIMARY_BLUE}
            strokeWidth={2}
          />
          {offsetedLastDataUpdate < lastDate && (
            <ReferenceLine x={offsetedLastDataUpdate} stroke={COLOR_PRIMARY_BLUE} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalysisPeriodComparisonGraph
