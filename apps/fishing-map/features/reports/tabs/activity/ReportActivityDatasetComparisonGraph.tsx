import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts'

import { useIsDeckLayersLoading } from '@globalfishingwatch/deck-layer-composer'
import { getContrastSafeLineColor } from '@globalfishingwatch/responsive-visualizations'

import { tickFormatter } from 'features/reports/report-area/area-reports.utils'
import { selectReportComparisonDataviewIds } from 'features/reports/reports.config.selectors'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import {
  formatDateTicks,
  formatEvolutionData,
} from 'features/reports/tabs/activity/reports-activity-timeseries.utils'

import EvolutionGraphTooltip from './EvolutionGraphTooltip'

import styles from './ReportActivityDatasetComparison.module.css'

export type ReportActivityDatasetComparisonProps = {
  data: ReportGraphProps[]
  start: string
  end: string
}

const filterDataBySublayer = (
  data: ReportGraphProps[],
  mainDatasetId?: string,
  compareDatasetId?: string
) => {
  return data
    .map((dataview) => {
      const subLayerIndex = dataview.sublayers.findIndex(
        (sublayer) => sublayer.id === mainDatasetId
      )

      if (subLayerIndex === -1) {
        const compareSublayer = dataview.sublayers.find(
          (sublayer) => sublayer.id === compareDatasetId
        )
        if (compareSublayer) {
          return dataview
        }
        return
      }

      const filteredSublayers = dataview.sublayers.filter((_, index) => index === subLayerIndex)
      const filteredTimeSeries = dataview.timeseries.map((timeserie) => ({
        ...timeserie,
        min: [timeserie.min?.[subLayerIndex]],
        max: [timeserie.max?.[subLayerIndex]],
      }))

      return { ...dataview, sublayers: filteredSublayers, timeseries: filteredTimeSeries }
    })
    .filter(Boolean) as ReportGraphProps[]
}

const calculateXDomain = (start: string, end: string, interval?: string) => {
  if (!start || !end || !interval) {
    return undefined
  }

  const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
    .minus({ [interval]: 1 })
    .toISO() as string

  return [new Date(start).getTime(), new Date(cleanEnd).getTime()]
}

const calculateYAxisDomain = (data: any[], index: number) => {
  return [
    Math.min(...data.map((d) => d.avg?.[index])),
    Math.max(...data.map((d) => d.avg?.[index])),
  ]
}

const ReportActivityDatasetComparisonGraph = ({
  data,
  start,
  end,
}: ReportActivityDatasetComparisonProps) => {
  const { t } = useTranslation()
  const comparisonDatasets = useSelector(selectReportComparisonDataviewIds)
  const mapLoading = useIsDeckLayersLoading()

  const filteredData = useMemo(() => {
    return filterDataBySublayer(data, comparisonDatasets?.main, comparisonDatasets?.compare)
  }, [data, comparisonDatasets?.main, comparisonDatasets?.compare])

  const interval = filteredData[0]?.interval

  const dataFormated = useMemo(
    () =>
      formatEvolutionData(filteredData[0], filteredData[1], {
        start,
        end,
        timeseriesInterval: interval,
      }),
    [end, filteredData, interval, start]
  )

  const xDomain = useMemo(() => calculateXDomain(start, end, interval), [start, end, interval])

  const hasEmptyData = data.some((d) => !d.timeseries || d.timeseries.length === 0)

  if (hasEmptyData) {
    return (
      <ReportActivityPlaceholder showHeader={false} animate={false}>
        {t('analysis.noDataByArea')}
      </ReportActivityPlaceholder>
    )
  }

  if (mapLoading) {
    return <ReportActivityPlaceholder showHeader={false} />
  }

  if (!dataFormated || !xDomain || !dataFormated[0]) {
    return null
  }

  const leftAxisColor = getContrastSafeLineColor(
    filteredData[0].sublayers[0].legend?.color as string
  )
  const leftAxisDomain = calculateYAxisDomain(dataFormated, 0)

  const rightAxisColor =
    comparisonDatasets?.compare && filteredData[1]
      ? getContrastSafeLineColor(filteredData[1].sublayers[0].legend?.color as string)
      : undefined
  const rightAxisDomain = comparisonDatasets?.compare && calculateYAxisDomain(dataFormated, 1)

  return (
    <div className={styles.graph} data-test="report-activity-dataset-comparison">
      <ComposedChart
        responsive
        width="100%"
        height="100%"
        data={dataFormated}
        margin={{
          top: 10,
          right: comparisonDatasets?.compare ? -30 : 5,
          left: -20,
          bottom: -10,
        }}
      >
        <CartesianGrid vertical={true} syncWithTicks />
        <XAxis
          domain={xDomain}
          dataKey="date"
          minTickGap={10}
          tickFormatter={(tick: string) => formatDateTicks(tick, interval)}
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
          domain={
            leftAxisDomain[1] === 0 ? (rightAxisDomain ? rightAxisDomain : [0, 1]) : leftAxisDomain
          }
        />
        {comparisonDatasets?.compare && rightAxisDomain && (
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
        )}
        {filteredData.map((layer, layerIndex) => {
          const sublayer = layer.sublayers[0]
          const yAxisId = layerIndex === 0 ? 'left' : 'right'
          const strokeColor = getContrastSafeLineColor(sublayer.legend?.color as string)

          return (
            <Line
              key={`${sublayer.id}-${layerIndex}-line`}
              yAxisId={yAxisId}
              name="line"
              type="monotone"
              dataKey={(data) => data.avg?.[layerIndex]}
              unit={sublayer.legend?.unit}
              dot={false}
              isAnimationActive={false}
              stroke={strokeColor}
              strokeWidth={2}
            />
          )
        })}
        {dataFormated.length > 0 && (
          <Tooltip content={<EvolutionGraphTooltip timeChunkInterval={interval} />} />
        )}
      </ComposedChart>
    </div>
  )
}

export default ReportActivityDatasetComparisonGraph
