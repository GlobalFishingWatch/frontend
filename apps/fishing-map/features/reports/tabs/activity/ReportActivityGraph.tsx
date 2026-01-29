import React, { Fragment, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import UserGuideLink from 'features/help/UserGuideLink'
import {
  useFitAreaInViewport,
  useReportAreaBounds,
} from 'features/reports/report-area/area-reports.hooks'
import {
  selectReportAreaStatus,
  selectTimeComparisonValues,
} from 'features/reports/report-area/area-reports.selectors'
import { REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON } from 'features/reports/reports.config'
import { selectReportActivityGraph } from 'features/reports/reports.config.selectors'
import type { ReportActivityGraph } from 'features/reports/reports.types'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import {
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
  useReportTimeSeriesErrors,
} from 'features/reports/reports-timeseries.hooks'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import { isTimeComparisonGraph } from 'features/reports/shared/utils/reports.utils'
import ReportActivityGraphSelector from 'features/reports/tabs/activity/ReportActivityGraphSelector'
import ReportActivityPeriodComparison from 'features/reports/tabs/activity/ReportActivityPeriodComparison'
import ReportActivityPeriodComparisonGraph from 'features/reports/tabs/activity/ReportActivityPeriodComparisonGraph'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'

import ReportActivityBeforeAfter from './ReportActivityBeforeAfter'
import ReportActivityBeforeAfterGraph from './ReportActivityBeforeAfterGraph'
import ReportActivityDatasetComparison from './ReportActivityDatasetComparison'
import ReportActivityDatasetComparisonGraph from './ReportActivityDatasetComparisonGraph'
import ReportActivityEvolution from './ReportActivityEvolution'

import styles from './ReportActivity.module.css'

export type ReportActivityProps = {
  data: ReportGraphProps
  start: string
  end: string
}

const SELECTORS_BY_TYPE: Record<ReportActivityGraph, React.FC | null> = {
  evolution: null,
  beforeAfter: ReportActivityBeforeAfter,
  periodComparison: ReportActivityPeriodComparison,
  datasetComparison: ReportActivityDatasetComparison,
}

type SharedGraphType = Exclude<ReportActivityGraph, 'datasetComparison'>
const SHARED_GRAPHS: Record<SharedGraphType, React.FC<ReportActivityProps>> = {
  evolution: ReportActivityEvolution,
  beforeAfter: ReportActivityBeforeAfterGraph,
  periodComparison: ReportActivityPeriodComparisonGraph,
}

export default function ReportActivity() {
  useComputeReportTimeSeries()

  const fitAreaInViewport = useFitAreaInViewport()
  const { loaded, bbox } = useReportAreaBounds()
  const bboxHash = bbox ? bbox.join(',') : ''

  // This ensures that the area is in viewport when then area load finishes
  useEffect(() => {
    if (loaded && bbox?.length) {
      fitAreaInViewport()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, bboxHash])

  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const reportActivityGraph = useSelector(selectReportActivityGraph)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)

  const SelectorsComponent = SELECTORS_BY_TYPE[reportActivityGraph]

  const loading = useReportFeaturesLoading()
  const reportAreaStatus = useSelector(selectReportAreaStatus)
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const layersTimeseriesErrors = useReportTimeSeriesErrors()

  // Simplified loading states
  const hasError = layersTimeseriesErrors?.some((error) => error !== '')
  const hasData = layersTimeseriesFiltered?.length > 0
  const isInitialLoad = loading || !hasData
  const isEmptyData = hasData && layersTimeseriesFiltered.every((data) => !data?.timeseries?.length)
  const showSelectors = !isInitialLoad
  const isDatasetComparison = reportActivityGraph === REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON

  const GraphElement = useMemo(() => {
    if (isDatasetComparison) {
      return (
        <ReportActivityDatasetComparisonGraph
          start={start}
          end={end}
          data={layersTimeseriesFiltered}
        />
      )
    }

    const Component = SHARED_GRAPHS[reportActivityGraph]
    return Component ? (
      <Component
        start={
          isTimeComparisonGraph(reportActivityGraph) && timeComparisonValues?.start
            ? timeComparisonValues.start
            : start
        }
        end={
          isTimeComparisonGraph(reportActivityGraph) && timeComparisonValues?.end
            ? timeComparisonValues.end
            : end
        }
        data={layersTimeseriesFiltered[0]}
      />
    ) : null
  }, [
    layersTimeseriesFiltered,
    reportActivityGraph,
    start,
    end,
    isDatasetComparison,
    timeComparisonValues?.start,
    timeComparisonValues?.end,
  ])

  return (
    <div className={styles.container}>
      {showSelectors && (
        <div className={styles.titleRow}>
          <label className={styles.blockTitle}>{t((t) => t.common.activity)}</label>
          <ReportActivityGraphSelector loading={isInitialLoad} />
        </div>
      )}
      {/* Dataset Comparison Selectors needs to go above the graph instead of time comparison selectors */}
      {showSelectors && SelectorsComponent && isDatasetComparison && <SelectorsComponent />}
      {isInitialLoad || reportAreaStatus !== AsyncReducerStatus.Finished ? (
        <ReportActivityPlaceholder showHeader={!showSelectors} loading />
      ) : isEmptyData || hasError ? (
        <ReportActivityPlaceholder showHeader={false} animate={false}>
          {hasError
            ? t((t) => t.errors.layerLoading)
            : isEmptyData && t((t) => t.analysis.noDataByArea)}
        </ReportActivityPlaceholder>
      ) : (
        GraphElement
      )}
      {showSelectors && SelectorsComponent && !isDatasetComparison && <SelectorsComponent />}
      {!isInitialLoad && (
        <Fragment>
          <div className={styles.disclaimer}>
            <UserGuideLink section="analysis" />
            <p className={styles.disclaimerText}>
              {t((t) => t.analysis.disclaimer)}{' '}
              <a
                href="https://globalfishingwatch.org/faqs/calculating-fishing-effort-estimates-in-dynamic-analysis-reports/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t((t) => t.common.learnMore)}.
              </a>
            </p>
          </div>
        </Fragment>
      )}
    </div>
  )
}
