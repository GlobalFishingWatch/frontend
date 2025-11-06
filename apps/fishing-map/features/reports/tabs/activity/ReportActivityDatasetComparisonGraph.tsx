import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
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

import { getContrastSafeLineColor } from '@globalfishingwatch/responsive-visualizations'

import { tickFormatter } from 'features/reports/report-area/area-reports.utils'
import { selectReportComparisonDataviewIds } from 'features/reports/reports.config.selectors'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import {
  formatComparisonEvolutionData,
  formatDateTicks,
} from 'features/reports/tabs/activity/reports-activity-timeseries.utils'

import EvolutionGraphTooltip from './EvolutionGraphTooltip'

import styles from './ReportActivityEvolution.module.css'

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
  const { t } = useTranslation()
  const comparisonDatasets = useSelector(selectReportComparisonDataviewIds)

  const interval = data[0]?.interval
  const filteredData = useMemo(() => {
    return data.map((dataview) => {
      const subLayerIndex = dataview.sublayers.findIndex((sublayer) => {
        return sublayer.id === comparisonDatasets?.main
      })
      if (subLayerIndex === -1) {
        return dataview
      }
      const filteredSublayers = dataview.sublayers.filter((_, index) => index === subLayerIndex)
      const filteredTimeSeries = dataview.timeseries.map((timeserie) => {
        return {
          ...timeserie,
          min: [timeserie.min?.[subLayerIndex]],
          max: [timeserie.max?.[subLayerIndex]],
        }
      })
      return { ...dataview, sublayers: filteredSublayers, timeseries: filteredTimeSeries }
    })
  }, [data, comparisonDatasets?.main])

  const dataFormated = useMemo(() => {
    return formatComparisonEvolutionData(filteredData)
  }, [filteredData])

  const xDomain = useMemo(() => {
    if (start && end && interval) {
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [interval]: 1 })
        .toISO() as string
      return [new Date(start).getTime(), new Date(cleanEnd).getTime()]
    }
    return undefined
  }, [start, end, interval])

  if (data.some((d) => !d.timeseries || d.timeseries.length === 0))
    return (
      <ReportActivityPlaceholder showHeader={false} animate={false}>
        {t('analysis.noDataByArea')}
      </ReportActivityPlaceholder>
    )

  if (!dataFormated || !xDomain || !dataFormated[0]) {
    return null
  }

  const leftAxisColor = getContrastSafeLineColor(
    filteredData[0].sublayers[0].legend?.color as string
  )
  const rightAxisColor = getContrastSafeLineColor(
    filteredData[1].sublayers[0].legend?.color as string
  )

  const rightAxisDomain = [
    Math.min(...dataFormated.map((d) => d.avg?.[1] || 0)),
    Math.max(...dataFormated.map((d) => d.avg?.[1] || 0)),
  ]

  return (
    <div className={styles.graph} data-test="report-activity-dataset-comparison">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataFormated}>
          <CartesianGrid vertical={false} syncWithTicks />
          <XAxis
            domain={xDomain}
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
            domain={rightAxisDomain}
          />
          {filteredData.flatMap((layer, layerIndex) =>
            layer.sublayers.map((sublayer, sublayerIndex) => {
              const globalIndex =
                layerIndex === 0 ? sublayerIndex : filteredData[1].sublayers.length + sublayerIndex
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
