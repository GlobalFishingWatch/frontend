import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { DateTime } from 'luxon'
import { CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts'

import { useDeckLayerLoaded } from '@globalfishingwatch/deck-layer-composer'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getContrastSafeColor } from '@globalfishingwatch/responsive-visualizations'

import { selectReportComparisonDataviews } from 'features/_map/dataviews/selectors/dataviews.categories.selectors'
import { tickFormatter } from 'features/_reports/report-area/area-reports.utils'
import { selectReportComparisonDataviewIds } from 'features/_reports/reports.config.selectors'
import type { ReportGraphProps } from 'features/_reports/reports-timeseries.hooks'
import { useReportFeaturesLoading } from 'features/_reports/reports-timeseries.hooks'
import ReportActivityPlaceholder from 'features/_reports/shared/placeholders/ReportActivityPlaceholder'
import {
  formatDateTicks,
  formatEvolutionData,
} from 'features/_reports/tabs/activity/reports-activity-timeseries.utils'

import DataComparisonLegend from './DataComparisonLegend'
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

const findDataviewData = (data: ReportGraphProps[], dataviewId: string) => {
  return data.find(
    (d) => d.id === dataviewId || d.sublayers.some((sublayer) => sublayer.id === dataviewId)
  )
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

const calculateYAxisDomain = (data: any[], index: number): [number, number] => {
  const values = data.map((d) => d.avg?.[index]).filter((v) => v != null)

  if (values.length === 0) {
    return [0, 1]
  }

  const dataMin = Math.min(...values)
  const dataMax = Math.max(...values)

  const basePadding = (dataMax - dataMin) / 10
  const safePadding = basePadding === 0 ? Math.max(1, Math.abs(dataMax) * 0.1) : basePadding
  const paddedDomain: [number, number] = [Math.max(0, dataMin - safePadding), dataMax + safePadding]

  return paddedDomain
}

const ReportActivityDatasetComparisonGraph = ({
  data,
  start,
  end,
}: ReportActivityDatasetComparisonProps) => {
  const { t } = useTranslation()
  const comparisonDatasets = useSelector(selectReportComparisonDataviewIds)
  const comparisonDataviews = useSelector(selectReportComparisonDataviews)
  const reportFeaturesLoading = useReportFeaturesLoading()

  const filteredData = useMemo(() => {
    return filterDataBySublayer(data, comparisonDatasets?.main, comparisonDatasets?.compare)
  }, [data, comparisonDatasets?.main, comparisonDatasets?.compare])

  const intervals = filteredData.map((d) => d.interval)
  const interval = getFourwingsInterval(start, end, intervals)

  const mainDataviewId = comparisonDatasets?.main
  const compareDataviewId = comparisonDatasets?.compare
  const mainData = useMemo(
    () => (mainDataviewId ? findDataviewData(filteredData, mainDataviewId) : filteredData[0]),
    [filteredData, mainDataviewId]
  )
  const compareData = useMemo(
    () => (compareDataviewId ? findDataviewData(filteredData, compareDataviewId) : undefined),
    [filteredData, compareDataviewId]
  )

  const hasCompareDataview =
    !!compareDataviewId && comparisonDataviews.some((dataview) => dataview.id === compareDataviewId)
  const compareLayerLoaded = useDeckLayerLoaded(hasCompareDataview ? compareDataviewId : undefined)

  const hasMainData = (mainData?.timeseries?.length ?? 0) > 0
  const hasCompareData = (compareData?.timeseries?.length ?? 0) > 0
  const isLoading =
    reportFeaturesLoading ||
    !mainData ||
    (hasCompareDataview && (compareLayerLoaded !== true || !compareData))
  const isCompareEmpty = !isLoading && !!compareDataviewId && !hasCompareData

  const graphLayers = useMemo(() => {
    const layers = hasCompareData ? [mainData, compareData] : [mainData]
    return layers.filter((layer): layer is ReportGraphProps => layer !== undefined)
  }, [mainData, compareData, hasCompareData])

  const dataFormated = useMemo(() => {
    return formatEvolutionData(
      graphLayers[0],
      {
        start,
        end,
        timeseriesInterval: interval,
      },
      graphLayers[1]
    )
  }, [end, graphLayers, interval, start])

  const xDomain = useMemo(() => calculateXDomain(start, end, interval), [start, end, interval])

  if (isLoading) {
    return <ReportActivityPlaceholder showHeader={false} loading />
  }

  if (!hasMainData) {
    return (
      <ReportActivityPlaceholder showHeader={false} animate={false}>
        {t((t) => t.analysis.noDataByArea)}
      </ReportActivityPlaceholder>
    )
  }

  if (!dataFormated || !xDomain || !dataFormated[0]) {
    return null
  }

  const leftAxisColor = getContrastSafeColor(graphLayers[0].sublayers[0].legend?.color as string)
  const leftAxisDomain = calculateYAxisDomain(dataFormated, 0)

  const rightAxisColor = hasCompareData
    ? getContrastSafeColor(graphLayers[1].sublayers[0].legend?.color as string)
    : undefined
  const rightAxisDomain = hasCompareData && calculateYAxisDomain(dataFormated, 1)

  return (
    <div className={styles.graphContainer}>
      <div
        className={cx(styles.graph, { [styles.faded]: isCompareEmpty })}
        data-testid="report-activity-dataset-comparison"
      >
        <ComposedChart
          responsive
          width="100%"
          height="100%"
          data={dataFormated}
          margin={{
            top: 10,
            right: hasCompareData ? -30 : 5,
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
            axisLine={{
              stroke: leftAxisDomain[0] === 0 ? 'var(--color-primary-blue)' : 'transparent',
            }}
          />
          <YAxis
            yAxisId="left"
            scale="linear"
            interval="preserveEnd"
            tickFormatter={tickFormatter}
            tick={{ style: { fill: leftAxisColor, stroke: leftAxisColor, strokeWidth: 0.5 } }}
            axisLine={{ stroke: leftAxisColor }}
            tickLine={false}
            orientation="left"
            domain={
              leftAxisDomain[1] === 0
                ? rightAxisDomain
                  ? rightAxisDomain
                  : [0, 1]
                : leftAxisDomain
            }
          />
          {rightAxisDomain && (
            <YAxis
              yAxisId="right"
              scale="linear"
              interval="preserveEnd"
              tickFormatter={tickFormatter}
              tick={{ style: { fill: rightAxisColor, stroke: rightAxisColor, strokeWidth: 0.5 } }}
              axisLine={{ stroke: rightAxisColor }}
              tickLine={false}
              orientation="right"
              domain={rightAxisDomain}
            />
          )}
          {graphLayers.map((layer, layerIndex) => {
            const sublayer = layer.sublayers[0]
            const yAxisId = layerIndex === 0 ? 'left' : 'right'
            const strokeColor = getContrastSafeColor(sublayer.legend?.color as string)

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
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ width: '100%', left: 0 }}
            content={(props) => <DataComparisonLegend {...props} />}
          />
          {dataFormated.length > 0 && (
            <Tooltip content={<EvolutionGraphTooltip timeChunkInterval={interval} />} />
          )}
        </ComposedChart>
      </div>
      {isCompareEmpty && (
        <div className={styles.emptyCompareOverlay}>
          <p className={styles.emptyCompareMessage} data-testid="report-comparison-dataset-no-data">
            {t((t) => t.analysis.noDataByComparedDataset)}
          </p>
        </div>
      )}
    </div>
  )
}

export default ReportActivityDatasetComparisonGraph
