import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import { DataviewType } from '@globalfishingwatch/api-types'
import type { ContextFeature } from '@globalfishingwatch/deck-layers'
import type { Tab } from '@globalfishingwatch/ui-components'
import { Tabs } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectAllDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
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
import ReportTitle from 'features/reports/report-area/title/ReportTitle'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import ActivityReport from 'features/reports/tabs/activity/ReportActivity'
import {
  resetReportData,
  selectReportVesselsStatus,
} from 'features/reports/tabs/activity/reports-activity.slice'
import { useSetTimeseries } from 'features/reports/tabs/activity/reports-activity-timeseries.hooks'
import ReportEnvironment from 'features/reports/tabs/environment/ReportEnvironment'
import {
  useTimebarEnvironmentConnect,
  useTimebarVisualisationConnect,
} from 'features/timebar/timebar.hooks'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import ErrorPlaceholder from 'features/workspace/ErrorPlaceholder'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { useMigrateWorkspaceToast } from 'features/workspace/workspace-migration.hooks'
import WorkspaceError from 'features/workspace/WorkspaceError'
import { useLocationConnect } from 'routes/routes.hook'
import { TimebarVisualisations } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from 'features/reports/report-area/AreaReport.module.css'

export default function Report() {
  useMigrateWorkspaceToast()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const setTimeseries = useSetTimeseries()
  const highlightArea = useHighlightReportArea()
  const { dispatchQueryParams } = useLocationConnect()
  const reportCategory = useSelector(selectReportCategory)
  const reportStatus = useSelector(selectReportVesselsStatus)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const reportAreaError = useSelector(selectReportAreaStatus) === AsyncReducerStatus.Error
  const { dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { dispatchTimebarSelectedEnvId } = useTimebarEnvironmentConnect()
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)
  const reportArea = useSelector(selectReportArea)
  const hasReportBuffer = useSelector(selectHasReportBuffer)

  const dataviews = useSelector(selectAllDataviewInstancesResolved)
  const heatmapDataviews = useMemo(
    () =>
      dataviews?.filter(
        (d) =>
          d.config?.visible === true &&
          (d.config?.type === DataviewType.HeatmapAnimated ||
            d.config?.type === DataviewType.HeatmapStatic)
      ),
    [dataviews]
  )
  const dataviewCategories = useMemo(
    () => uniq(heatmapDataviews?.map((d) => getReportCategoryFromDataview(d)) || []),
    [heatmapDataviews]
  )
  const categoryTabs: Tab<ReportCategory>[] = [
    {
      id: ReportCategory.Activity,
      title: t('common.activity', 'Activity'),
    },
    {
      id: ReportCategory.Detections,
      title: t('common.detections', 'Detections'),
    },
    {
      id: ReportCategory.Environment,
      title: t('common.environment', 'Environment'),
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
  }, [highlightArea, reportArea, hasReportBuffer])

  const setTimebarVisualizationByCategory = useCallback(
    (category: ReportCategory) => {
      if (category === ReportCategory.Environment && dataviews && dataviews.length > 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.Environment)
        dispatchTimebarSelectedEnvId(dataviews[0]?.id)
      } else {
        dispatchTimebarVisualisation(
          category === ReportCategory.Detections
            ? TimebarVisualisations.HeatmapDetections
            : TimebarVisualisations.HeatmapActivity
        )
      }
    },
    [dataviews, dispatchTimebarSelectedEnvId, dispatchTimebarVisualisation]
  )

  useEffect(() => {
    setTimebarVisualizationByCategory(reportCategory)
  }, [reportCategory, setTimebarVisualizationByCategory])

  const handleTabClick = (option: Tab<ReportCategory>) => {
    if (option.id !== reportCategory) {
      setTimeseries([])
      dispatch(resetReportData())
      dispatchQueryParams({ reportCategory: option.id, reportVesselPage: 0 })
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
    return (
      <ErrorPlaceholder
        title={t('errors.areaLoad', 'There was an error loading the report area')}
      ></ErrorPlaceholder>
    )
  }

  return (
    <Fragment>
      {reportArea && <ReportTitle area={reportArea} />}
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
      ) : (
        <div>
          <ActivityReport reportName={reportArea?.name} />
        </div>
      )}
    </Fragment>
  )
}
