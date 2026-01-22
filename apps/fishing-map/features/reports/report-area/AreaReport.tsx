import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'
import dynamic from 'next/dynamic'

import type { ContextFeature } from '@globalfishingwatch/deck-layers'
import type { Tab } from '@globalfishingwatch/ui-components'
import { Spinner, Tabs } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimebarSelectedEnvId } from 'features/app/selectors/app.timebar.selectors'
import { selectReportLayersVisible } from 'features/dataviews/selectors/dataviews.selectors'
import { OUT_OF_TIME_REPORT_AREA_ID } from 'features/reports/report-area/area-reports.config'
import {
  useFetchReportArea,
  useFitAreaInViewport,
  useHighlightReportArea,
} from 'features/reports/report-area/area-reports.hooks'
import {
  selectHasReportBuffer,
  selectReportArea,
  selectReportAreaStatus,
} from 'features/reports/report-area/area-reports.selectors'
import { getReportCategoryFromDataview } from 'features/reports/report-area/area-reports.utils'
import { REPORT_ACTIVITY_GRAPH_EVOLUTION } from 'features/reports/reports.config'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import {
  resetReportData,
  selectReportVesselsStatus,
} from 'features/reports/tabs/activity/reports-activity.slice'
import { useSetReportTimeComparison } from 'features/reports/tabs/activity/reports-activity-timecomparison.hooks'
import {
  useTimebarEnvironmentConnect,
  useTimebarVisualisationConnect,
} from 'features/timebar/timebar.hooks'
import { selectHasChangedSettingsOnce } from 'features/timebar/timebar.slice'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import ErrorPlaceholder from 'features/workspace/ErrorPlaceholder'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { useMigrateWorkspaceToast } from 'features/workspace/workspace-migration.hooks'
import WorkspaceError from 'features/workspace/WorkspaceError'
import { useLocationConnect } from 'routes/routes.hook'
import { TimebarVisualisations } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from 'features/reports/report-area/AreaReport.module.css'

const ReportActivity = dynamic(() =>
  import(
    /* webpackChunkName: "ReportActivity" */ 'features/reports/tabs/activity/ReportActivity'
  ).catch((err) => {
    // To catch ChunkLoadErrors due to deployment updates
    if (err instanceof SyntaxError || err.message.includes("Unexpected token '<'")) {
      console.warn('Detected HTML served as JS. Possible deployment update. Reloading...')
      window.location.reload()
    }
    throw err
  })
)
const ReportEnvironment = dynamic(() =>
  import(
    /* webpackChunkName: "ReportEnvironment" */ 'features/reports/tabs/environment/ReportEnvironment'
  ).catch((err) => {
    if (err instanceof SyntaxError || err.message.includes("Unexpected token '<'")) {
      console.warn('Detected HTML served as JS. Possible deployment update. Reloading...')
      window.location.reload()
    }
    throw err
  })
)
const ReportOthers = dynamic(() =>
  import(/* webpackChunkName: "ReportOthers" */ 'features/reports/tabs/others/ReportOthers').catch(
    (err) => {
      if (err instanceof SyntaxError || err.message.includes("Unexpected token '<'")) {
        console.warn('Detected HTML served as JS. Possible deployment update. Reloading...')
        window.location.reload()
      }
      throw err
    }
  )
)
const ReportEvents = dynamic(() =>
  import(/* webpackChunkName: "ReportEvents" */ 'features/reports/tabs/events/EventsReport').catch(
    (err) => {
      if (err instanceof SyntaxError || err.message.includes("Unexpected token '<'")) {
        console.warn('Detected HTML served as JS. Possible deployment update. Reloading...')
        window.location.reload()
      }
      throw err
    }
  )
)

export default function Report() {
  useMigrateWorkspaceToast()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const highlightArea = useHighlightReportArea()
  const { dispatchQueryParams } = useLocationConnect()
  const reportCategory = useSelector(selectReportCategory)
  const reportStatus = useSelector(selectReportVesselsStatus)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const reportAreaError = useSelector(selectReportAreaStatus) === AsyncReducerStatus.Error
  const { dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { dispatchTimebarSelectedEnvId } = useTimebarEnvironmentConnect()
  const { resetReportTimecomparison } = useSetReportTimeComparison()
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)
  const reportArea = useSelector(selectReportArea)
  const hasReportBuffer = useSelector(selectHasReportBuffer)
  const reportDataviews = useSelector(selectReportLayersVisible)
  const timebarSelectedEnvId = useSelector(selectTimebarSelectedEnvId)
  const hasChangedSettingsOnce = useSelector(selectHasChangedSettingsOnce)

  const dataviewCategories = useMemo(
    () => uniq(reportDataviews?.map((d) => getReportCategoryFromDataview(d)) || []),
    [reportDataviews]
  )
  const categoryTabs: Tab<ReportCategory>[] = [
    {
      id: ReportCategory.Activity,
      title: t('common.activity'),
    },
    {
      id: ReportCategory.Detections,
      title: t('common.detections'),
    },
    {
      id: ReportCategory.Events,
      title: t('common.events'),
    },
    {
      id: ReportCategory.Environment,
      title: t('common.environment'),
    },
    {
      id: ReportCategory.Others,
      title: t('common.others'),
    },
  ]
  const filteredCategoryTabs = categoryTabs.flatMap((tab) => {
    if (!dataviewCategories.includes(tab.id)) {
      return []
    }
    return {
      ...tab,
      disabled: tab.id !== reportCategory && reportStatus === AsyncReducerStatus.Loading,
    }
  })

  const { status } = useFetchReportArea()
  const fitAreaInViewport = useFitAreaInViewport()

  // This ensures that the area is in viewport when then area load finishes
  useEffect(() => {
    if (status === AsyncReducerStatus.Finished && reportArea?.bounds) {
      fitAreaInViewport()
    }
    // Reacting only to the area status and fitting bounds after load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, reportArea])

  useEffect(() => {
    if (reportArea && !hasReportBuffer) {
      highlightArea(reportArea as ContextFeature)
    }
    return () => {
      highlightArea(undefined)
    }
  }, [highlightArea, reportArea, hasReportBuffer])

  const setTimebarVisualizationByCategory = useCallback(
    (category: ReportCategory) => {
      if (
        category === ReportCategory.Environment &&
        reportDataviews &&
        reportDataviews.length > 0
      ) {
        dispatchTimebarVisualisation(TimebarVisualisations.Environment)
        dispatchTimebarSelectedEnvId(timebarSelectedEnvId || reportDataviews[0]?.id)
      } else if (category === ReportCategory.Activity || category === ReportCategory.Detections) {
        dispatchTimebarVisualisation(
          category === ReportCategory.Detections
            ? TimebarVisualisations.HeatmapDetections
            : TimebarVisualisations.HeatmapActivity
        )
      }
    },
    [
      reportDataviews,
      dispatchTimebarSelectedEnvId,
      dispatchTimebarVisualisation,
      timebarSelectedEnvId,
    ]
  )

  useEffect(() => {
    if (!hasChangedSettingsOnce) setTimebarVisualizationByCategory(reportCategory)
  }, [hasChangedSettingsOnce, reportCategory, setTimebarVisualizationByCategory])

  const handleTabClick = (option: Tab<ReportCategory>) => {
    if (option.id !== reportCategory) {
      dispatch(resetReportData())
      dispatchQueryParams({
        reportCategory: option.id,
        reportVesselPage: 0,
        reportActivityGraph: REPORT_ACTIVITY_GRAPH_EVOLUTION,
        reportComparisonDataviewIds: undefined,
      })
      resetReportTimecomparison()

      fitAreaInViewport()
      trackEvent({
        category: TrackCategory.Analysis,
        action: `Click on ${option.id} report`,
      })
    }
  }

  if (
    workspaceStatus === AsyncReducerStatus.Error ||
    workspaceVesselGroupsStatus === AsyncReducerStatus.Error
  ) {
    return <WorkspaceError />
  }

  if (reportAreaError) {
    return <ErrorPlaceholder title={t('errors.areaLoad')}></ErrorPlaceholder>
  }

  if (!reportCategory) {
    return <Spinner />
  }

  if (reportArea?.id === OUT_OF_TIME_REPORT_AREA_ID) {
    return <ErrorPlaceholder title={t('errors.areaOutOfTime')}></ErrorPlaceholder>
  }

  return (
    <Fragment>
      {filteredCategoryTabs.length > 1 && (
        <div className={styles.tabContainer}>
          <Tabs
            tabs={filteredCategoryTabs}
            activeTab={reportCategory}
            onTabClick={handleTabClick}
          />
        </div>
      )}
      {reportCategory === ReportCategory.Environment ? (
        <ReportEnvironment />
      ) : reportCategory === ReportCategory.Events ? (
        <ReportEvents />
      ) : reportCategory === ReportCategory.Others ? (
        <ReportOthers />
      ) : (
        <ReportActivity />
      )}
    </Fragment>
  )
}
