import { useMemo } from 'react'
import max from 'lodash/max'
import min from 'lodash/min'
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
  console.log('🚀 ~ ReportActivityDatasetComparisonGraph ~ data:', data)
  const colors = data.map((layer) => layer.sublayers[0]?.legend?.color)?.join(',')
  const dataFormated = useMemo(() => formatComparisonEvolutionData(data), [colors])
  console.log('🚀 ~ ReportActivityDatasetComparisonGraph ~ dataFormated:', dataFormated)

  const domain = useMemo(() => {
    if (start && end && data[0]?.interval) {
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [data[0]?.interval]: 1 })
        .toISO() as string
      return [new Date(start).getTime(), new Date(cleanEnd).getTime()]
    }
  }, [start, end, data[0]?.interval])

  if (!dataFormated || !domain) {
    return null
  }

  const dataMin: number = dataFormated.length
    ? (min(dataFormated.filter((d) => d !== null).flatMap(({ range }) => range[0][0])) as number)
    : 0
  const dataMax: number = dataFormated.length
    ? (max(dataFormated.filter((d) => d !== null).flatMap(({ range }) => range[0][1])) as number)
    : 0

  const domainPadding = (dataMax - dataMin) / 10
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

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
            axisLine={paddedDomain[0] === 0}
          />

          {data.map((layer) => {
            return layer?.sublayers.map(({ id, legend }, index) => {
              const strokeColor = getContrastSafeLineColor(legend?.color as string)
              return (
                <>
                  <YAxis
                    scale="linear"
                    domain={paddedDomain}
                    interval="preserveEnd"
                    tickFormatter={tickFormatter}
                    tick={{ stroke: strokeColor, strokeWidth: 0.5 }}
                    axisLine={{ stroke: strokeColor }}
                    tickLine={false}
                    orientation={index % 2 === 0 ? 'left' : 'right'}
                    yAxisId={index % 2 === 0 ? 'left' : 'right'}
                  />
                  <Line
                    key={`${id}-${index}-line`}
                    yAxisId={index % 2 === 0 ? 'left' : 'right'}
                    name="line"
                    type="monotone"
                    dataKey={(data) => data.avg?.[index]}
                    unit={legend?.unit}
                    dot={false}
                    isAnimationActive={false}
                    stroke={strokeColor}
                    strokeWidth={2}
                  />
                </>
              )
            })
          })}
          {dataFormated?.length && (
            <Tooltip content={<EvolutionGraphTooltip timeChunkInterval={data[0]?.interval} />} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ReportActivityDatasetComparisonGraph
