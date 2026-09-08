import { useSelector } from 'react-redux'

import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'

import { selectOthersActiveReportDataviewsGrouped } from 'features/_map/dataviews/selectors/dataviews.categories.selectors'
import { useTimerangeConnect } from 'features/_map/timebar/timebar.hooks'
import { isPolygonsDataviewReportSupported } from 'features/_reports/report-area/area-reports.utils'
import { isUserHeatmapDataviewReportSupported } from 'features/_reports/report-dataview-category.utils'
import type { ReportGraphProps } from 'features/_reports/reports-timeseries.hooks'
import {
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
} from 'features/_reports/reports-timeseries.hooks'
import ReportEnvironmentGraph from 'features/_reports/tabs/environment/ReportEnvironmentGraph'
import ReportPointsGraph from 'features/_reports/tabs/others/ReportPointsGraph'
import ReportPolygonsGraph from 'features/_reports/tabs/others/ReportPolygonsGraph'

import styles from './ReportOthers.module.css'
import reportStyles from 'features/_reports/report-area/AreaReport.module.css'

function ReportOthers() {
  useComputeReportTimeSeries()
  const { start, end } = useTimerangeConnect()
  const timeseriesLoading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const loading = timeseriesLoading || layersTimeseriesFiltered?.some((d) => d?.mode === 'loading')
  const otherDataviewsGrouped = useSelector(selectOthersActiveReportDataviewsGrouped)

  if (!Object.keys(otherDataviewsGrouped)?.length) return null
  return (
    <div className={reportStyles.section}>
      {Object.values(otherDataviewsGrouped).map((dataviews, index) => {
        const dataview = dataviews[0]
        const mergedDataviewId = getMergedDataviewId(dataviews)

        const layerTimeseries = layersTimeseriesFiltered?.find((ts) => ts.id === mergedDataviewId)
        const layerTimeseriesWithCurrentColors = layerTimeseries
          ? {
              ...layerTimeseries,
              sublayers: layerTimeseries.sublayers.map((sublayer, i) => ({
                ...sublayer,
                legend: {
                  ...sublayer.legend,
                  color: dataviews[i]?.config?.color || sublayer.legend.color,
                },
              })),
            }
          : undefined

        if (isUserHeatmapDataviewReportSupported(dataview)) {
          // No evolution graph yet.
          return (
            <ReportEnvironmentGraph
              key={mergedDataviewId}
              dataview={dataview}
              data={layerTimeseriesWithCurrentColors as ReportGraphProps}
              isLoading={loading}
              index={index}
            />
          )
        }

        if (isPolygonsDataviewReportSupported(dataview)) {
          return (
            <ReportPolygonsGraph
              key={mergedDataviewId}
              dataview={dataview}
              dataviews={dataviews}
              statsId={mergedDataviewId}
              data={layerTimeseriesWithCurrentColors}
              loading={loading}
              start={start}
              end={end}
              className={styles.subsection}
            />
          )
        }

        return (
          <ReportPointsGraph
            key={mergedDataviewId}
            dataview={dataview}
            dataviews={dataviews}
            statsId={mergedDataviewId}
            data={layerTimeseriesWithCurrentColors}
            loading={loading}
            start={start}
            end={end}
            className={styles.subsection}
          />
        )
      })}
    </div>
  )
}

export default ReportOthers
