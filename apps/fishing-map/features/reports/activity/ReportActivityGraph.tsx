import React, { Fragment, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ReportActivityGraphSelector from 'features/reports/activity/ReportActivityGraphSelector'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  getReportGraphMode,
  ReportGraphProps,
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
} from 'features/reports/activity/reports-activity-timeseries.hooks'
import { selectTimeComparisonValues } from 'features/reports/areas/area-reports.selectors'
import ReportActivityPlaceholder from 'features/reports/areas/placeholders/ReportActivityPlaceholder'
import ReportActivityPeriodComparison from 'features/reports/activity/ReportActivityPeriodComparison'
import ReportActivityPeriodComparisonGraph from 'features/reports/activity/ReportActivityPeriodComparisonGraph'
import UserGuideLink from 'features/help/UserGuideLink'
import {
  useFitAreaInViewport,
  useReportAreaBounds,
} from 'features/reports/areas/area-reports.hooks'
import { selectReportActivityGraph } from '../areas/area-reports.config.selectors'
import { ReportActivityGraph } from '../areas/area-reports.types'
import ReportActivityEvolution from './ReportActivityEvolution'
import ReportActivityBeforeAfter from './ReportActivityBeforeAfter'
import ReportActivityBeforeAfterGraph from './ReportActivityBeforeAfterGraph'
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
}
const GRAPH_BY_TYPE: Record<ReportActivityGraph, React.FC<ReportActivityProps> | null> = {
  evolution: ReportActivityEvolution,
  beforeAfter: ReportActivityBeforeAfterGraph,
  periodComparison: ReportActivityPeriodComparisonGraph,
}

const emptyGraphData = {} as ReportGraphProps

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
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const reportGraphMode = getReportGraphMode(reportActivityGraph)
  const isSameTimeseriesMode = layersTimeseriesFiltered?.[0]?.mode === reportGraphMode
  const showSelectors = layersTimeseriesFiltered !== undefined
  const showPlaceholder = loading || !isSameTimeseriesMode
  const isEmptyData =
    layersTimeseriesFiltered &&
    layersTimeseriesFiltered.every(({ timeseries }) => timeseries.length === 0) &&
    !loading

  return (
    <div className={styles.container}>
      {showSelectors && (
        <div className={styles.titleRow}>
          <label className={styles.blockTitle}>{t('common.activity', 'Activity')}</label>
          <ReportActivityGraphSelector loading={showPlaceholder} />
        </div>
      )}
      {showPlaceholder ? (
        <ReportActivityPlaceholder showHeader={!showSelectors} />
      ) : isEmptyData ? (
        <ReportActivityPlaceholder showHeader={false} animate={false}>
          {t('analysis.noDataByArea', 'No data available for the selected area')}
        </ReportActivityPlaceholder>
      ) : (
        <GraphComponent
          start={reportActivityGraph === 'evolution' ? start : timeComparisonValues?.start}
          end={reportActivityGraph === 'evolution' ? end : timeComparisonValues?.end}
          data={isSameTimeseriesMode ? layersTimeseriesFiltered?.[0] : emptyGraphData}
        />
      )}
      {showSelectors && SelectorsComponent && <SelectorsComponent />}
      {!showPlaceholder && (
        <Fragment>
          <div className={styles.disclaimer}>
            <UserGuideLink section="analysis" />
            <p>
              {t('analysis.disclaimer', 'The data shown above should be taken as an estimate.')}
            </p>
          </div>
        </Fragment>
      )}
    </div>
  )
}