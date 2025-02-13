import React, { useMemo } from 'react'
import max from 'lodash/max'
import min from 'lodash/min'
import { DateTime } from 'luxon'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

import i18n from 'features/i18n/i18n'
import { tickFormatter } from 'features/reports/report-area/area-reports.utils'
import type { ComparisonGraphData } from 'features/reports/tabs/activity/ReportActivityPeriodComparisonGraph'
import { formatEvolutionData } from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import { formatDateForInterval, getUTCDateTime } from 'utils/dates'

import EvolutionGraphTooltip from './EvolutionGraphTooltip'

import styles from './ReportActivityEvolution.module.css'

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

const formatDateTicks = (tick: string, timeChunkInterval: FourwingsInterval) => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

const ReportActivityEvolution: React.FC<{
  data: ComparisonGraphProps
  start: string
  end: string
}> = (props) => {
  const { data } = props
  const dataFormated = formatEvolutionData(data)

  const domain = useMemo(() => {
    if (props.start && props.end && data?.interval) {
      const cleanEnd = DateTime.fromISO(props.end, { zone: 'utc' })
        .minus({ [data?.interval]: 1 })
        .toISO() as string
      return [new Date(props.start).getTime(), new Date(cleanEnd).getTime()]
    }
  }, [props.start, props.end, data?.interval])

  if (!dataFormated || !domain) {
    return null
  }

  const dataMin: number = dataFormated.length
    ? (min(dataFormated.flatMap(({ range }) => range[0][0])) as number)
    : 0
  const dataMax: number = dataFormated.length
    ? (max(dataFormated.flatMap(({ range }) => range[0][1])) as number)
    : 0

  const domainPadding = (dataMax - dataMin) / 10
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  return (
    <div className={styles.graph} data-test="report-activity-evolution">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={dataFormated} margin={graphMargin}>
          <CartesianGrid vertical={false} syncWithTicks />
          <XAxis
            domain={domain}
            dataKey="date"
            interval="equidistantPreserveStart"
            tickFormatter={(tick: string) => formatDateTicks(tick, data?.interval)}
            axisLine={paddedDomain[0] === 0}
          />
          <YAxis
            scale="linear"
            domain={paddedDomain}
            interval="preserveEnd"
            tickFormatter={tickFormatter}
            axisLine={false}
            tickLine={false}
          />
          {dataFormated?.length && (
            <Tooltip content={<EvolutionGraphTooltip timeChunkInterval={data?.interval} />} />
          )}
          {data?.sublayers.map(({ id, legend }, index) => (
            <Line
              key={`${id}-line`}
              name="line"
              type="monotone"
              dataKey={(data) => data.avg?.[index]}
              unit={legend?.unit}
              dot={false}
              isAnimationActive={false}
              stroke={legend?.color}
              strokeWidth={2}
            />
          ))}
          {data?.sublayers.map(({ id, legend }, index) => (
            <Area
              key={`${id}-area`}
              name="area"
              type="monotone"
              dataKey={(data) => data.range?.[index]}
              activeDot={false}
              fill={legend?.color}
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

export default ReportActivityEvolution
