import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { isEqual, uniq } from 'lodash'
import { Button, Tab, Tabs } from '@globalfishingwatch/ui-components'
import { crossBrowserTypeErrorMessages, isAuthError } from '@globalfishingwatch/api-client'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { ContextFeature } from '@globalfishingwatch/deck-layers'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useLocationConnect } from 'routes/routes.hook'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import WorkspaceError, { WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import {
  selectHasReportBuffer,
  selectHasReportVessels,
  selectReportArea,
  selectReportDataviewsWithPermissions,
} from 'features/reports/reports.selectors'
import ReportVesselsPlaceholder from 'features/reports/placeholders/ReportVesselsPlaceholder'
import { ReportCategory, TimebarVisualisations } from 'types'
import { getDownloadReportSupported } from 'features/download/download.utils'
import { SUPPORT_EMAIL } from 'data/config'
import {
  useTimebarEnvironmentConnect,
  useTimebarVisualisationConnect,
} from 'features/timebar/timebar.hooks'
import { getReportCategoryFromDataview, parseReportUrl } from 'features/reports/reports.utils'
import {
  getDateRangeHash,
  resetReportData,
  selectReportVesselsDateRangeHash,
  selectReportVesselsStatus,
  setDateRangeHash,
} from 'features/reports/report.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  isActivityReport,
  selectActiveReportDataviews,
  selectReportAreaId,
  selectReportCategory,
  selectReportDatasetId,
} from 'features/app/selectors/app.reports.selector'
import { formatI18nDate } from 'features/i18n/i18nDate'
import {
  useComputeReportTimeSeries,
  useSetTimeseries,
} from 'features/reports/reports-timeseries.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getDatasetsReportNotSupported } from 'features/datasets/datasets.utils'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { LAST_REPORTS_STORAGE_KEY, LastReportStorage } from 'features/reports/reports.config'
// import { REPORT_BUFFER_GENERATOR_ID } from 'features/map/map.config'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import {
  useFetchReportArea,
  useFetchReportVessel,
  useFitAreaInViewport,
  useHighlightReportArea,
} from './reports.hooks'
import ReportSummary from './summary/ReportSummary'
import ReportTitle from './title/ReportTitle'
import ReportActivity from './activity/ReportActivity'
import ReportVessels from './vessels/ReportVessels'
import ReportDownload from './download/ReportDownload'
import ReportEnvironment from './environment/ReportEnvironment'
import styles from './Report.module.css'

export type ReportActivityUnit = 'hour' | 'detection'

function ActivityReport({ reportName }: { reportName: string }) {
  useFetchDataviewResources()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [lastReports] = useLocalStorage<LastReportStorage[]>(LAST_REPORTS_STORAGE_KEY, [])
  const reportCategory = useSelector(selectReportCategory)
  const timerange = useSelector(selectTimeRange)
  const reportDataviews = useSelector(selectReportDataviewsWithPermissions)
  const guestUser = useSelector(selectIsGuestUser)
  const datasetId = useSelector(selectReportDatasetId)
  const areaId = useSelector(selectReportAreaId)
  const reportDateRangeHash = useSelector(selectReportVesselsDateRangeHash)
  const userData = useSelector(selectUserData)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const dataviews = useSelector(selectActiveReportDataviews)
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )
  const timerangeTooLong = !getDownloadReportSupported(timerange.start, timerange.end)
  const { status: reportStatus, error: statusError, dispatchFetchReport } = useFetchReportVessel()
  const dispatchTimeoutRef = useRef<NodeJS.Timeout>()
  const hasVessels = useSelector(selectHasReportVessels)

  // TODO get this from datasets config
  const activityUnit = isActivityReport(reportCategory) ? 'hour' : 'detection'

  const reportLoading = reportStatus === AsyncReducerStatus.Loading
  const reportError = reportStatus === AsyncReducerStatus.Error
  const reportLoaded = reportStatus === AsyncReducerStatus.Finished
  const reportOutdated =
    reportDateRangeHash !== '' && reportDateRangeHash !== getDateRangeHash(timerange)
  const hasAuthError = reportError && isAuthError(statusError)

  const { currentReportUrl } = statusError?.metadata || ({} as { currentReportUrl: string })
  const lastReport = currentReportUrl
    ? lastReports.find((report) => {
        const currentReportParams = parseReportUrl(currentReportUrl)
        const reportParams = parseReportUrl(report.reportUrl)
        return isEqual(currentReportParams, reportParams)
      })
    : undefined
  const concurrentReportError = statusError?.status === 429
  const isSameWorkspaceReport =
    concurrentReportError && window?.location.href === lastReport?.workspaceUrl

  const isTimeoutError =
    statusError?.message &&
    crossBrowserTypeErrorMessages.some((error) => error.includes(statusError.message as string))
  useEffect(() => {
    if (isSameWorkspaceReport || isTimeoutError) {
      dispatchTimeoutRef.current = setTimeout(() => {
        dispatchFetchReport()
      }, 1000 * 30) // retrying each 30 secs
    }
    return () => {
      if (dispatchTimeoutRef.current) {
        clearTimeout(dispatchTimeoutRef.current)
      }
    }
  }, [dispatchFetchReport, isSameWorkspaceReport, isTimeoutError])

  const ReportVesselError = useMemo(() => {
    if (hasAuthError || guestUser) {
      return (
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
      )
    }
    if (statusError) {
      if (concurrentReportError) {
        if (isSameWorkspaceReport) {
          return <ReportVesselsPlaceholder />
        }
        return (
          <ReportVesselsPlaceholder>
            <div className={styles.cover}>
              <p className={styles.error}>
                {t('analysis.errorConcurrentReport', 'There is already a report running')}
                <p className={styles.link}>
                  {lastReport && (
                    <a href={lastReport.workspaceUrl}>
                      {t('analysis.errorConcurrentReportLink', 'See it')}
                    </a>
                  )}
                </p>
              </p>
            </div>
          </ReportVesselsPlaceholder>
        )
      }

      if (
        statusError.status === 413 ||
        (statusError.status === 422 && statusError.message === 'Geometry too large')
      ) {
        return (
          <ReportVesselsPlaceholder>
            <div className={styles.cover}>
              <p className={styles.error}>
                {t(
                  'analysis.errorTooComplex',
                  'The geometry of the area is too complex to perform a report, try to simplify and upload again.'
                )}
              </p>
            </div>
          </ReportVesselsPlaceholder>
        )
      }
      return (
        <ReportVesselsPlaceholder>
          <div className={styles.cover}>
            <p className={styles.error}>{statusError.message}</p>
          </div>
        </ReportVesselsPlaceholder>
      )
    }
    if (!reportDataviews?.length) {
      return (
        <p className={styles.error}>
          {t(
            'analysis.datasetsNotAllowedAll',
            'None of your datasets are allowed to be used in reports'
          )}{' '}
        </p>
      )
    }
    return (
      <p className={styles.error}>
        <span>
          {t('errors.generic', 'Something went wrong, try again or contact:')}{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </span>
      </p>
    )
  }, [
    areaId,
    concurrentReportError,
    datasetId,
    guestUser,
    hasAuthError,
    isSameWorkspaceReport,
    lastReport,
    reportDataviews?.length,
    statusError,
    t,
  ])

  const ReportComponent = useMemo(() => {
    if (workspaceStatus === AsyncReducerStatus.Loading) {
      return <ReportVesselsPlaceholder />
    }
    if (timerangeTooLong) {
      return (
        <ReportVesselsPlaceholder>
          <div className={cx(styles.cover, styles.error)}>
            <p>
              {t(
                'analysis.timeRangeTooLong',
                'The selected time range is too long, please select a shorter time range'
              )}
            </p>
          </div>
        </ReportVesselsPlaceholder>
      )
    }
    if (reportOutdated && !reportLoading && !hasAuthError) {
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
    if (reportLoaded) {
      return hasVessels ? (
        <Fragment>
          <ReportVessels activityUnit={activityUnit} reportName={reportName} />
          <ReportDownload />
        </Fragment>
      ) : (
        <div className={styles.error}>
          {datasetsDownloadNotSupported.length > 0 && (
            <p className={styles.secondary}>
              {t(
                'analysis.datasetsNotAllowed',
                'Vessels are not included from the following sources:'
              )}{' '}
              {datasetsDownloadNotSupported.map((dataset, index) => (
                <Fragment>
                  <DatasetLabel key={dataset} dataset={{ id: dataset }} />
                  {index < datasetsDownloadNotSupported.length - 1 && ', '}
                </Fragment>
              ))}
            </p>
          )}
          <p>{t('analysis.noDataByArea', 'No data available for the selected area')}</p>
        </div>
      )
    }
    if (reportError || (!reportLoading && !reportDataviews?.length)) {
      return ReportVesselError
    }

    return <ReportVesselsPlaceholder />
  }, [
    workspaceStatus,
    timerangeTooLong,
    reportOutdated,
    reportLoading,
    hasAuthError,
    reportLoaded,
    reportError,
    reportDataviews?.length,
    t,
    timerange?.start,
    timerange?.end,
    dispatch,
    hasVessels,
    activityUnit,
    reportName,
    datasetsDownloadNotSupported,
    ReportVesselError,
  ])

  return (
    <Fragment>
      <ReportSummary activityUnit={activityUnit} reportStatus={reportStatus} />
      <ReportActivity />
      {ReportComponent}
    </Fragment>
  )
}

export default function Report() {
  useComputeReportTimeSeries()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const setTimeseries = useSetTimeseries()
  const highlightArea = useHighlightReportArea()
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
  const { status } = useFetchReportArea()
  const { dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { dispatchTimebarSelectedEnvId } = useTimebarEnvironmentConnect()
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)
  const reportArea = useSelector(selectReportArea)
  const hasReportBuffer = useSelector(selectHasReportBuffer)

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
        <ActivityReport reportName={reportArea!?.name} />
      )}
    </Fragment>
  )
}
