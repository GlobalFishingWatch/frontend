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
import {
  REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON,
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
} from 'features/reports/reports.config'
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
import ReportActivityGraphSelector from 'features/reports/tabs/activity/ReportActivityGraphSelector'
import ReportActivityPeriodComparison from 'features/reports/tabs/activity/ReportActivityPeriodComparison'
import ReportActivityPeriodComparisonGraph from 'features/reports/tabs/activity/ReportActivityPeriodComparisonGraph'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'

import ReportActivityBeforeAfter from './ReportActivityBeforeAfter'
import ReportActivityBeforeAfterGraph from './ReportActivityBeforeAfterGraph'
import ReportActivityDatasetComparisonGraph, {
  type ReportActivityDatasetComparisonProps,
} from './ReportActivityDatasetComparisonGraph'
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
  datasetComparison: null,
}

const GRAPH_BY_TYPE: Record<
  ReportActivityGraph,
  React.FC<ReportActivityProps> | React.FC<ReportActivityDatasetComparisonProps> | null
> = {
  evolution: ReportActivityEvolution,
  beforeAfter: ReportActivityBeforeAfterGraph,
  periodComparison: ReportActivityPeriodComparisonGraph,
  datasetComparison:
    ReportActivityDatasetComparisonGraph as React.FC<ReportActivityDatasetComparisonProps>,
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

  const SelectorsComponent = useMemo(
    () => SELECTORS_BY_TYPE[reportActivityGraph],
    [reportActivityGraph]
  )
  const GraphComponent = useMemo(
    () => GRAPH_BY_TYPE[reportActivityGraph] as any,
    [reportActivityGraph]
  )
  const loading = useReportFeaturesLoading()
  const reportAreaStatus = useSelector(selectReportAreaStatus)
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const layersTimeseriesErrors = useReportTimeSeriesErrors()
  const hasError = layersTimeseriesErrors?.[0] !== ''
  const showSelectors = layersTimeseriesFiltered !== undefined
  const isEmptyData =
    !loading && layersTimeseriesFiltered?.length
      ? layersTimeseriesFiltered.every((data) => data?.timeseries?.length === 0)
      : false

  return (
    <div className={styles.container}>
      {showSelectors && (
        <div className={styles.titleRow}>
          <label className={styles.blockTitle}>{t('common.activity')}</label>
          <ReportActivityGraphSelector loading={loading} />
        </div>
      )}
      {loading || reportAreaStatus !== AsyncReducerStatus.Finished ? (
        <ReportActivityPlaceholder showHeader={!showSelectors} />
      ) : isEmptyData || hasError ? (
        <ReportActivityPlaceholder showHeader={false} animate={false}>
          {hasError && t('errors.layerLoading')}
          {/* : t('analysis.noDataByArea')} */}
        </ReportActivityPlaceholder>
      ) : reportActivityGraph === REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON ? (
        <ReportActivityDatasetComparisonGraph
          start={start}
          end={end}
          data={layersTimeseriesFiltered}
        />
      ) : (
        <GraphComponent
          start={
            reportActivityGraph === REPORT_ACTIVITY_GRAPH_EVOLUTION
              ? start
              : timeComparisonValues?.start
          }
          end={
            reportActivityGraph === REPORT_ACTIVITY_GRAPH_EVOLUTION
              ? end
              : timeComparisonValues?.end
          }
          data={layersTimeseriesFiltered?.[0]}
        />
      )}
      {showSelectors && SelectorsComponent && <SelectorsComponent />}
      {!loading && (
        <Fragment>
          <div className={styles.disclaimer}>
            <UserGuideLink section="analysis" />
            <p className={styles.disclaimerText}>
              {t('analysis.disclaimer')}{' '}
              <a
                href="https://globalfishingwatch.org/faqs/calculating-fishing-effort-estimates-in-dynamic-analysis-reports/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('common.learnMore')}.
              </a>
            </p>
          </div>
        </Fragment>
      )}
    </div>
  )
}
