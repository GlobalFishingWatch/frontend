import { Fragment, useCallback, useEffect, useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'lodash'
import { Button, Tab, Tabs } from '@globalfishingwatch/ui-components'
import { isAuthError } from '@globalfishingwatch/api-client'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useLocationConnect } from 'routes/routes.hook'
import { isActivityReport, selectReportCategory, selectTimeRange } from 'features/app/app.selectors'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import WorkspaceError, { WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import { selectHasReportVessels } from 'features/reports/reports.selectors'
import ReportVesselsPlaceholder from 'features/reports/placeholders/ReportVesselsPlaceholder'
import { isGuestUser } from 'features/user/user.slice'
import { ReportCategory, TimebarVisualisations } from 'types'
import { getDownloadReportSupported } from 'features/download/download.utils'
import { SUPPORT_EMAIL } from 'data/config'
import {
  useTimebarEnvironmentConnect,
  useTimebarVisualisationConnect,
} from 'features/timebar/timebar.hooks'
import { getReportCategoryFromDataview } from 'features/reports/reports.utils'
import {
  getDateRangeHash,
  resetReportData,
  selectReportVesselsDateRangeHash,
  selectReportVesselsStatus,
  setDateRangeHash,
} from 'features/reports/reports.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectLocationAreaId, selectLocationDatasetId } from 'routes/routes.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { useSetTimeseries } from 'features/reports/reports-timeseries.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useFetchReportArea, useFetchReportVessel } from './reports.hooks'
import ReportSummary from './summary/ReportSummary'
import ReportTitle from './title/ReportTitle'
import ReportActivity from './activity/ReportActivity'
import ReportVessels from './vessels/ReportVessels'
import ReportDownload from './download/ReportDownload'
import ReportEnvironment from './environment/ReportEnvironment'
import styles from './Report.module.css'

export type ReportActivityUnit = 'hour' | 'detection'

function ActivityReport({ reportName }: { reportName: string }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const reportCategory = useSelector(selectReportCategory)
  const timerange = useSelector(selectTimeRange)
  const guestUser = useSelector(isGuestUser)
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)
  const reportDateRangeHash = useSelector(selectReportVesselsDateRangeHash)
  const timerangeTooLong = !getDownloadReportSupported(timerange.start, timerange.end)
  const { status: reportStatus, error: statusError } = useFetchReportVessel()
  const hasVessels = useSelector(selectHasReportVessels)

  // TODO get this from datasets config
  const activityUnit = isActivityReport(reportCategory) ? 'hour' : 'detection'

  const reportLoading = reportStatus === AsyncReducerStatus.Loading
  const reportError = reportStatus === AsyncReducerStatus.Error
  const reportLoaded = reportStatus === AsyncReducerStatus.Finished
  const reportOutdated = reportDateRangeHash !== getDateRangeHash(timerange)
  const hasAuthError = reportError && isAuthError(statusError)

  const ReportComponent = useMemo(() => {
    if (reportOutdated && !reportLoading) {
      return (
        <ReportVesselsPlaceholder>
          <div className={cx(styles.cover, styles.center)}>
            <p
              dangerouslySetInnerHTML={{
                __html: t('analysis.newTimeRange', {
                  defaultValue:
                    'Click Update to see the vessels active in the area<br/>between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
                  start: formatI18nDate(timerange?.start),
                  end: formatI18nDate(timerange?.end),
                }),
              }}
            />
            <Button onClick={() => dispatch(setDateRangeHash(''))}>
              {t('common.update', 'Update')}
            </Button>
          </div>
        </ReportVesselsPlaceholder>
      )
    }
    if (reportLoading) {
      return <ReportVesselsPlaceholder />
    }
    if (reportLoaded) {
      return hasVessels ? (
        <Fragment>
          <ReportVessels activityUnit={activityUnit} reportName={reportName} />
          <ReportDownload />
        </Fragment>
      ) : (
        <p className={styles.error}>
          {t('analysis.noDataByArea', 'No data available for the selected area')}
        </p>
      )
    }
    if (reportError) {
      return hasAuthError ? (
        <ReportVesselsPlaceholder>
          <div className={styles.cover}>
            <WorkspaceLoginError
              title={
                guestUser
                  ? t('errors.reportLogin', 'Login to see the vessels active in the area')
                  : t(
                      'errors.privateReport',
                      "Your account doesn't have permissions to see the vessels active in this area"
                    )
              }
              emailSubject={`Requesting access for ${datasetId}-${areaId} report`}
            />
          </div>
        </ReportVesselsPlaceholder>
      ) : (
        <p className={styles.error}>
          <span>
            {t('errors.generic', 'Something went wrong, try again or contact:')}{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </span>
        </p>
      )
    }
    return null
  }, [
    activityUnit,
    areaId,
    datasetId,
    dispatch,
    guestUser,
    hasAuthError,
    hasVessels,
    reportError,
    reportLoaded,
    reportLoading,
    reportName,
    reportOutdated,
    t,
    timerange?.end,
    timerange?.start,
  ])

  return (
    <Fragment>
      <ReportSummary activityUnit={activityUnit} reportStatus={reportStatus} />
      <ReportActivity />
      {ReportComponent}
      {timerangeTooLong && (
        <p className={styles.error}>
          {t(
            'analysis.timeRangeTooLong',
            'Reports are only allowed for time ranges up to one year'
          )}
        </p>
      )}
    </Fragment>
  )
}

export default function Report() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const setTimeseries = useSetTimeseries()
  const { dispatchQueryParams } = useLocationConnect()
  const reportCategory = useSelector(selectReportCategory)
  const dataviews = useSelector(selectActiveTemporalgridDataviews)
  const reportStatus = useSelector(selectReportVesselsStatus)
  const dataviewCategories = uniq(dataviews.map((d) => getReportCategoryFromDataview(d)))
  const categoryTabs: Tab<ReportCategory>[] = [
    {
      id: ReportCategory.Fishing,
      title: t('common.fishing', 'Fishing'),
    },
    {
      id: ReportCategory.Presence,
      title: t('common.presence', 'Presence'),
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
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const { data: areaDetail } = useFetchReportArea()
  const { dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { dispatchTimebarSelectedEnvId } = useTimebarEnvironmentConnect()
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)

  const setTimebarVisualizationByCategory = useCallback(
    (category: ReportCategory) => {
      if (category === ReportCategory.Environment && dataviews?.length > 0) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportCategory])

  const handleTabClick = (option: Tab<ReportCategory>) => {
    if (option.id !== reportCategory) {
      setTimeseries([])
      dispatch(resetReportData())
      dispatchQueryParams({ reportCategory: option.id, reportVesselPage: 0 })
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

  return (
    <Fragment>
      <ReportTitle area={areaDetail} />
      {filteredCategoryTabs.length > 1 && (
        <Tabs tabs={filteredCategoryTabs} activeTab={reportCategory} onTabClick={handleTabClick} />
      )}
      {reportCategory === ReportCategory.Environment ? (
        <ReportEnvironment />
      ) : (
        <ActivityReport reportName={areaDetail?.name} />
      )}
    </Fragment>
  )
}
