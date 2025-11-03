import { useMemo } from 'react'
import { DateTime } from 'luxon'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatDateForInterval } from '@globalfishingwatch/data-transforms'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getContrastSafeLineColor } from '@globalfishingwatch/responsive-visualizations'

import i18n from 'features/i18n/i18n'
import { tickFormatter } from 'features/reports/report-area/area-reports.utils'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import { formatComparisonEvolutionData } from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import { getUTCDateTime } from 'utils/dates'

import EvolutionGraphTooltip from './EvolutionGraphTooltip'

import styles from './ReportActivityEvolution.module.css'

const formatDateTicks = (tick: string, timeChunkInterval: FourwingsInterval) => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

export type ReportActivityDatasetComparisonProps = {
  data: ReportGraphProps[]
  start: string
  end: string
}

const ReportActivityDatasetComparisonGraph = ({
  data,
  start,
  end,
}: ReportActivityDatasetComparisonProps) => {
  const interval = data[0]?.interval
  const dataFormated = useMemo(() => formatComparisonEvolutionData(data), [data])

  const domain = useMemo(() => {
    if (start && end && interval) {
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [interval]: 1 })
        .toISO() as string
      return [new Date(start).getTime(), new Date(cleanEnd).getTime()]
    }
    return undefined
  }, [start, end, interval])

  if (!dataFormated || !domain || !dataFormated[0]) {
    return null
  }

  const leftAxisColor = getContrastSafeLineColor(data[0].sublayers[0].legend?.color as string)
  const rightAxisColor = getContrastSafeLineColor(data[1].sublayers[0].legend?.color as string)

  return (
    <div className={styles.graph} data-test="report-activity-dataset-comparison">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataFormated} margin={graphMargin}>
          <CartesianGrid vertical={false} syncWithTicks />
          <XAxis
            domain={domain}
            dataKey="date"
            minTickGap={10}
            tickFormatter={(tick: string) => formatDateTicks(tick, data[0]?.interval)}
          />
          <YAxis
            yAxisId="left"
            scale="linear"
            interval="preserveEnd"
            tickFormatter={tickFormatter}
            tick={{ stroke: leftAxisColor, strokeWidth: 0.5 }}
            axisLine={{ stroke: leftAxisColor }}
            tickLine={false}
            orientation="left"
          />
          <YAxis
            yAxisId="right"
            scale="linear"
            interval="preserveEnd"
            tickFormatter={tickFormatter}
            tick={{ stroke: rightAxisColor, strokeWidth: 0.5 }}
            axisLine={{ stroke: rightAxisColor }}
            tickLine={false}
            orientation="right"
          />
          {data.flatMap((layer, layerIndex) =>
            layer.sublayers.map((sublayer, sublayerIndex) => {
              const globalIndex =
                layerIndex === 0 ? sublayerIndex : data[1].sublayers.length + sublayerIndex
              const yAxisId = layerIndex === 0 ? 'left' : 'right'
              const strokeColor = getContrastSafeLineColor(sublayer.legend?.color as string)
              return (
                <Line
                  key={`${sublayer.id}-${layerIndex}-${sublayerIndex}-line`}
                  yAxisId={yAxisId}
                  name="line"
                  type="monotone"
                  dataKey={(data) => data.avg?.[globalIndex]}
                  unit={sublayer.legend?.unit}
                  dot={false}
                  isAnimationActive={false}
                  stroke={strokeColor}
                  strokeWidth={2}
                />
              )
            })
          )}

          {dataFormated?.length && (
            <Tooltip content={<EvolutionGraphTooltip timeChunkInterval={data[0]?.interval} />} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ReportActivityDatasetComparisonGraph
