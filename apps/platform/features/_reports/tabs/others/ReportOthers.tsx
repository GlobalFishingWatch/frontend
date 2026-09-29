import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { DatasetGeometryType } from '@globalfishingwatch/api-types'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { trackEvent } from '@globalfishingwatch/react-hooks'
import { Button, Icon } from '@globalfishingwatch/ui-components'

import {
  selectAllOthersReportDataviewsAreReportArea,
  selectOthersActiveReportDataviewsGrouped,
} from 'features/_map/dataviews/selectors/dataviews.categories.selectors'
import { useTimerangeConnect } from 'features/_map/timebar/timebar.hooks'
import ErrorPlaceholder from 'features/_map/workspace/ErrorPlaceholder'
import { isPolygonsDataviewReportSupported } from 'features/_reports/report-area/area-reports.utils'
import { isUserHeatmapDataviewReportSupported } from 'features/_reports/report-dataview-category.utils'
import { categoryToDataviewMap, ReportCategory } from 'features/_reports/reports.types'
import type { ReportGraphProps } from 'features/_reports/reports-timeseries.hooks'
import {
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
} from 'features/_reports/reports-timeseries.hooks'
import ReportEnvironmentGraph from 'features/_reports/tabs/environment/ReportEnvironmentGraph'
import ReportPointsGraph from 'features/_reports/tabs/others/ReportPointsGraph'
import ReportPolygonsGraph from 'features/_reports/tabs/others/ReportPolygonsGraph'
import { TrackCategory } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'

import styles from './ReportOthers.module.css'
import reportStyles from 'features/_reports/report-area/AreaReport.module.css'

// User geometries this tab can graph: user points, polygons and heatmaps
const REPORT_OTHERS_USER_GEOMETRIES: DatasetGeometryType[] = ['polygons', 'points', 'gridded']

function ReportOthers() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  useComputeReportTimeSeries()
  const { start, end } = useTimerangeConnect()
  const timeseriesLoading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const loading = timeseriesLoading || layersTimeseriesFiltered?.some((d) => d?.mode === 'loading')
  const otherDataviewsGrouped = useSelector(selectOthersActiveReportDataviewsGrouped)
  const allDataviewsAreReportArea = useSelector(selectAllOthersReportDataviewsAreReportArea)
  const hasOtherDataviews = Object.keys(otherDataviewsGrouped).length > 0

  const onAddLayerClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Open panel to add a report layer`,
    })
    const open = categoryToDataviewMap[ReportCategory.Others]
    if (open) {
      dispatch(
        setModalOpen({
          id: 'layerLibrary',
          open,
          singleCategory: true,
          userGeometries: REPORT_OTHERS_USER_GEOMETRIES,
        })
      )
    }
  }, [dispatch])

  if (!hasOtherDataviews && !allDataviewsAreReportArea) {
    return null
  }

  return (
    <div className={reportStyles.section}>
      {!hasOtherDataviews && (
        <ErrorPlaceholder
          title={t((t) => t.analysis.othersLayersAreReportArea, {
            defaultValue:
              "The layers used to create this report area can't be analysed against themselves. Turn on another polygon or point layer to see results here.",
          })}
        />
      )}
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
      <div className={styles.addLayerContainer}>
        <Button
          type="border-secondary"
          size="medium"
          icon={<Icon icon="plus" />}
          onClick={onAddLayerClick}
        >
          {t((t) => t.layer.add)}
        </Button>
      </div>
    </div>
  )
}

export default ReportOthers
