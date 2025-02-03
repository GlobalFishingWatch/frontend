import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import i18n from 'features/i18n/i18n'
import { tickFormatter } from 'features/reports/report-area/area-reports.utils'
import { selectReportTimeComparison } from 'features/reports/reports.config.selectors'
import type { ReportActivityTimeComparison } from 'features/reports/reports.types'
import { getUTCDateTime } from 'utils/dates'

import BeforeAfterGraphTooltip from './BeforeAfterGraphTooltip'

import styles from './ReportActivityEvolution.module.css'

interface ComparisonGraphData {
  date: string
  min: number[]
  max: number[]
}

interface ComparisonGraphProps {
  timeseries: ComparisonGraphData[]
  sublayers: {
    id: string
    legend: {
      color?: string
      unit?: string
    }
  }[]
  interval: FourwingsInterval
}

const formatDateTicks = (tick: number, timeComparison: ReportActivityTimeComparison) => {
  if (!timeComparison) return ''
  const dtTick = getUTCDateTime(tick)
  const dtStart = getUTCDateTime(timeComparison.compareStart)
  if (tick !== dtStart?.toMillis()) {
    const diff = dtTick.diff(dtStart, timeComparison.durationType as any).toObject() as any
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

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

const ReportActivityBeforeAfterGraph: React.FC<{
  data: ComparisonGraphProps
  start: string
  end: string
}> = (props) => {
  const { start, end } = props
  const { timeseries, sublayers, interval } = props.data
  const timeComparison = useSelector(selectReportTimeComparison)

  const dtStart = useMemo(() => {
    if (!timeComparison?.compareStart) return null
    return getUTCDateTime(timeComparison?.compareStart)
  }, [timeComparison?.compareStart])

  const range = useMemo(() => {
    const values = (timeseries || [])?.flatMap(({ date, min, max }) => {
      // Values from before are in sublayer 0 and values from after are in sublayer 1
      const minValue = min.reduce((acc, val) => acc + val, 0)
      const maxValue = max.reduce((acc, val) => acc + val, 0)
      return [
        {
          date: getUTCDateTime(date)?.toMillis(),
          range: [minValue, maxValue],
          avg: (minValue + maxValue) / 2,
        },
      ]
    })
    values.sort((v1, v2) => v2.date - v1.date)

    return values
  }, [timeseries])

  const ticks = useMemo(() => {
    if (!timeComparison || !dtStart) {
      return []
    }
    const finalTicks = [dtStart?.toMillis()]
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
    return sublayers?.[0]?.legend?.unit
  }, [sublayers])

  if (!start || !end || !range || !timeComparison) {
    return null
  }

  return (
    <div className={styles.graph}>
      <ResponsiveContainer width="100%" height={'100%'}>
        <ComposedChart data={range} margin={graphMargin}>
          <CartesianGrid vertical={false} />
          <XAxis
            domain={[getUTCDateTime(start)?.toMillis(), getUTCDateTime(end)?.toMillis()]}
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
          <ReferenceLine x={dtStart?.toMillis()} stroke={COLOR_PRIMARY_BLUE} />
          <Tooltip content={<BeforeAfterGraphTooltip timeChunkInterval={interval} />} />
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

export default ReportActivityBeforeAfterGraph
