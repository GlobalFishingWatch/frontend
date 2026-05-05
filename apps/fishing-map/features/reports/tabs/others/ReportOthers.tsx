import { useSelector } from 'react-redux'

import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'

import { selectOthersActiveReportDataviewsGrouped } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { isPolygonsDataviewReportSupported } from 'features/reports/report-area/area-reports.utils'
import {
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
} from 'features/reports/reports-timeseries.hooks'
import ReportPointsGraph from 'features/reports/tabs/others/ReportPointsGraph'
import ReportPolygonsGraph from 'features/reports/tabs/others/ReportPolygonsGraph'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

import styles from './ReportOthers.module.css'
import reportStyles from 'features/reports/report-area/AreaReport.module.css'

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
      {Object.values(otherDataviewsGrouped).map((dataviews) => {
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
