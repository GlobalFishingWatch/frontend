import { useMemo } from 'react'
import max from 'lodash/max'
import min from 'lodash/min'
import { DateTime } from 'luxon'
import { Area, CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts'

import { getContrastSafeLineColor } from '@globalfishingwatch/responsive-visualizations'

import { tickFormatter } from 'features/reports/report-area/area-reports.utils'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import {
  formatDateTicks,
  formatEvolutionData,
} from 'features/reports/tabs/activity/reports-activity-timeseries.utils'

import EvolutionGraphTooltip from './EvolutionGraphTooltip'

import styles from './ReportActivityEvolution.module.css'

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

const ReportActivityEvolution = ({
  data,
  start,
  end,
}: {
  data: ReportGraphProps
  start: string
  end: string
}) => {
  const colors = (data?.sublayers || []).map((sublayer) => sublayer?.legend?.color)?.join(',')
  const dataFormated = useMemo(
    () => formatEvolutionData(data, { start, end, timeseriesInterval: data?.interval }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, end, start, colors]
  )
  const domain = useMemo(() => {
    if (start && end && data?.interval) {
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [data?.interval]: 1 })
        .toISO() as string
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

  const basePadding = (dataMax - dataMin) / 10
  const safePadding = basePadding === 0 ? Math.max(1, Math.abs(dataMax) * 0.1) : basePadding
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - safePadding)),
    Math.ceil(dataMax + safePadding),
  ]

  return (
    <div className={styles.graph} data-test="report-activity-evolution">
      <ComposedChart responsive width="100%" height="100%" data={dataFormated} margin={graphMargin}>
        <CartesianGrid vertical={false} syncWithTicks />
        <XAxis
          domain={domain}
          dataKey="date"
          minTickGap={10}
          interval="preserveStartEnd"
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
            key={`${id}-${index}-line`}
            name="line"
            type="monotone"
            dataKey={(data) => data.avg?.[index]}
            unit={legend?.unit}
            dot={false}
            isAnimationActive={false}
            stroke={getContrastSafeLineColor(legend?.color as string)}
            strokeWidth={2}
          />
        ))}
        {data?.sublayers.map(({ id, legend }, index) => (
          <Area
            key={`${id}-${index}-area`}
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
    </div>
  )
}

export default ReportActivityEvolution
