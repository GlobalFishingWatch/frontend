import { useMemo } from 'react'
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
import { Interval } from '@globalfishingwatch/layer-composer'
import { selectReportTimeComparison } from 'features/app/app.selectors'
import { ReportActivityTimeComparison } from 'types'
import i18n from 'features/i18n/i18n'
import { COLOR_PRIMARY_BLUE } from 'features/app/App'
import { getUTCDateTime } from 'utils/dates'
import { formatDate, formatTooltipValue, tickFormatter } from 'features/reports/reports.utils'
import styles from './ReportActivityBeforeAfter.module.css'

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

const formatDateTicks = (tick: number, timeComparison: ReportActivityTimeComparison) => {
  const dtTick = getUTCDateTime(tick)
  const dtStart = getUTCDateTime(timeComparison.compareStart)
  if (tick !== dtStart.toMillis()) {
    const diff = dtTick.diff(dtStart, timeComparison.durationType as any).toObject()
    const diffValue = Math.round(diff[timeComparison.durationType as any])
    const sign = diffValue > 0 ? '+' : ''
    return [sign, diffValue].join('')
  }
  const date = dtTick.setLocale(i18n.language)
  let formattedTick = ''
  switch (timeComparison.durationType) {
    case 'months':
      formattedTick = date.toFormat('LLL y')
      break
    default:
      formattedTick = date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      break
  }
  return formattedTick
}

const AnalysisGraphTooltip = (props: any) => {
  const { payload, timeChunkInterval } = props

  const avgLineValue = payload?.find((p) => p.name === 'line')
  if (!avgLineValue) return null

  const date = getUTCDateTime(avgLineValue.payload.date).setLocale(i18n.language)
  return (
    <div className={styles.tooltipContainer}>
      <p className={styles.tooltipLabel}>{formatDate(date, timeChunkInterval)}</p>
      <span className={styles.tooltipValue}>
        {formatTooltipValue(avgLineValue.payload.avg as number, avgLineValue.unit as string)}
      </span>
    </div>
  )
}

const AnalysisBeforeAfterGraph: React.FC<{
  data: ComparisonGraphProps
  start: string
  end: string
}> = (props) => {
  const { start, end } = props
  const { timeseries, sublayers, interval } = props.data
  const timeComparison = useSelector(selectReportTimeComparison)

  const dtStart = useMemo(() => {
    return getUTCDateTime(timeComparison.compareStart)
  }, [timeComparison.compareStart])

  const range = useMemo(() => {
    const values = timeseries?.flatMap(({ date, compareDate, min, max }) => {
      return [
        {
          date: getUTCDateTime(date)?.toMillis(),
          range: [min[0], max[0]],
          avg: (max[0] + min[0]) / 2,
        },
        {
          date: getUTCDateTime(compareDate)?.toMillis(),
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
            domain={[getUTCDateTime(start).toMillis(), getUTCDateTime(end).toMillis()]}
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
          <ReferenceLine x={dtStart.toMillis()} stroke={COLOR_PRIMARY_BLUE} />
          <Tooltip content={<AnalysisGraphTooltip timeChunkInterval={interval} />} />
          <Line
            name="line"
            type="monotone"
            dataKey="avg"
            unit={unit}
            dot={false}
            isAnimationActive={false}
            stroke={COLOR_PRIMARY_BLUE}
            strokeWidth={2}
          />
          <Area
            name="area"
            type="monotone"
            dataKey="range"
            activeDot={false}
            fill={COLOR_PRIMARY_BLUE}
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
