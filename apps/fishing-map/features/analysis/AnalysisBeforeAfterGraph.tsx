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
import { DateTime } from 'luxon'
import { useSelector } from 'react-redux'
import { selectAnalysisTimeComparison } from 'features/app/app.selectors'
import { WorkspaceAnalysisTimeComparison } from 'types'
import i18n from 'features/i18n/i18n'
import { formatDate, formatTooltipValue, tickFormatter } from './analysis.utils'
import styles from './AnalysisEvolutionGraph.module.css'
import { ComparisonGraphProps } from './AnalysisPeriodComparisonGraph'

const formatDateTicks = (tick: number, timeComparison: WorkspaceAnalysisTimeComparison) => {
  const dtTick = DateTime.fromMillis(tick).toUTC()
  const dtStart = DateTime.fromISO(timeComparison.compareStart).toUTC()
  if (tick !== dtStart.toMillis()) {
    const diff = dtTick.diff(dtStart, timeComparison.durationType as any).toObject()
    const diffValue = Math.round(diff[timeComparison.durationType as any])
    const sign = diffValue > 0 ? '+' : ''
    return [sign, diffValue].join('')
  }
  const date = dtTick.setLocale(i18n.language)
  let formattedTick = ''
  switch (timeComparison.durationType) {
    case 'month':
      formattedTick = date.toFormat('LLL y')
      break
    default:
      formattedTick = date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      break
  }
  return formattedTick
}

const AnalysisGraphTooltip = (props: any) => {
  const { payload } = props

  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const avgLineValue = payload?.find((p) => p.name === 'line')
  if (!avgLineValue) return null

  const date = DateTime.fromMillis(avgLineValue.payload.date).toUTC().setLocale(i18n.language)
  return (
    <div className={styles.tooltipContainer}>
      <p className={styles.tooltipLabel}>{formatDate(date, timeComparison.durationType)}</p>
      <span className={styles.tooltipValue}>
        {formatTooltipValue(avgLineValue.payload.avg as number, avgLineValue.unit as string)}
      </span>
    </div>
  )
}

const AnalysisBeforeAfterGraph: React.FC<{
  graphData: ComparisonGraphProps
  start: string
  end: string
}> = (props) => {
  const { start, end } = props
  const { timeseries, sublayers } = props.graphData
  const timeComparison = useSelector(selectAnalysisTimeComparison)

  const dtStart = useMemo(() => {
    return DateTime.fromISO(timeComparison.compareStart).toUTC()
  }, [timeComparison.compareStart])

  const range = useMemo(() => {
    const values = timeseries?.flatMap(({ date, compareDate, min, max }) => {
      return [
        {
          date: DateTime.fromISO(date).toUTC().toMillis(),
          range: [min[0], max[0]],
          avg: (max[0] + min[0]) / 2,
        },
        {
          date: DateTime.fromISO(compareDate).toUTC().toMillis(),
          range: [min[1], max[1]],
          avg: (max[1] + min[1]) / 2,
        },
      ]
    })
    values.sort((v1, v2) => v2.date - v1.date)

    return values
  }, [timeseries])

  const ticks = useMemo(() => {
    const finalTicks = [dtStart.toMillis()]
    const FRACTION_OF_AXIS_WITHOUT_TICKS = 0.35
    const startTicksAt = Math.ceil(timeComparison.duration * FRACTION_OF_AXIS_WITHOUT_TICKS)
    for (let i = startTicksAt; i <= timeComparison.duration; i++) {
      finalTicks.push(
        dtStart
          .plus({ [timeComparison.durationType]: i })
          .toUTC()
          .toMillis()
      )
      finalTicks.push(
        dtStart
          .minus({ [timeComparison.durationType]: i })
          .toUTC()
          .toMillis()
      )
    }
    finalTicks.sort()
    return finalTicks
  }, [timeComparison, dtStart])

  const unit = useMemo(() => {
    return sublayers[0].legend.unit
  }, [sublayers])

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
            tickFormatter={(tick: number) => formatDateTicks(tick, timeComparison)}
            scale={'time'}
            type={'number'}
            ticks={ticks}
          />
          <YAxis
            scale="linear"
            interval="preserveEnd"
            tickFormatter={tickFormatter}
            axisLine={false}
            tickLine={false}
            tickCount={4}
          />
          <ReferenceLine x={dtStart.toMillis()} stroke="rgb(22, 63, 137)" />
          <Tooltip content={<AnalysisGraphTooltip />} />
          <Line
            name="line"
            type="monotone"
            dataKey="avg"
            unit={unit}
            dot={false}
            isAnimationActive={false}
            stroke="rgb(22, 63, 137)"
            strokeWidth={2}
          />
          <Area
            name="area"
            type="monotone"
            dataKey="range"
            activeDot={false}
            fill="rgb(22, 63, 137)"
            stroke="none"
            fillOpacity={0.2}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalysisBeforeAfterGraph
