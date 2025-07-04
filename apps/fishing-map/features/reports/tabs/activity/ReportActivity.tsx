import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import isEqual from 'lodash/isEqual'

import {
  getIsConcurrentError,
  getIsTimeoutError,
  isAuthError,
} from '@globalfishingwatch/api-client'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { Button } from '@globalfishingwatch/ui-components'

import { SUPPORT_EMAIL } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReportLoadVessels } from 'features/app/selectors/app.selectors'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { getDatasetsReportNotSupported } from 'features/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { getDownloadReportSupported } from 'features/download/download.utils'
import { formatI18nDate } from 'features/i18n/i18nDate'
import type { LastReportStorage } from 'features/reports/report-area/area-reports.config'
import { LAST_REPORTS_STORAGE_KEY } from 'features/reports/report-area/area-reports.config'
import { useFetchReportVessel } from 'features/reports/report-area/area-reports.hooks'
import {
  selectReportDataviewsWithPermissions,
  selectTimeComparisonValues,
} from 'features/reports/report-area/area-reports.selectors'
import { parseReportUrl } from 'features/reports/report-area/area-reports.utils'
import {
  selectActiveReportSubCategories,
  selectReportAreaId,
  selectReportCategory,
  selectReportDatasetId,
} from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import ReportSummary from 'features/reports/shared/summary/ReportSummary'
import ReportVessels from 'features/reports/shared/vessels/ReportVessels'
import ReportDownload from 'features/reports/tabs/activity/download/ReportDownload'
import ReportActivityGraph from 'features/reports/tabs/activity/ReportActivityGraph'
import {
  getReportRequestHash,
  selectReportRequestHash,
  setReportRequestHash,
} from 'features/reports/tabs/activity/reports-activity.slice'
import { selectHasReportVessels } from 'features/reports/tabs/activity/vessels/report-activity-vessels.selectors'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
// import { REPORT_BUFFER_GENERATOR_ID } from 'features/map/map.config'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import WorkspaceLoginError from 'features/workspace/WorkspaceLoginError'
import { useLocationConnect } from 'routes/routes.hook'
import { selectIsVesselGroupReportLocation } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import ReportActivitySubsectionSelector from './ReportActivitySubsectionSelector'

import styles from 'features/reports/report-area/AreaReport.module.css'

function ActivityReport() {
  useFetchDataviewResources()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [lastReports] = useLocalStorage<LastReportStorage[]>(LAST_REPORTS_STORAGE_KEY, [])
  const timerange = useSelector(selectTimeRange)
  const reportDataviews = useSelector(selectReportDataviewsWithPermissions)
  const guestUser = useSelector(selectIsGuestUser)
  const datasetId = useSelector(selectReportDatasetId)
  const areaId = useSelector(selectReportAreaId)
  const reportRequestHash = useSelector(selectReportRequestHash)
  const reportCategory = useSelector(selectReportCategory)
  const userData = useSelector(selectUserData)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const dataviews = useSelector(selectActiveReportDataviews)
  const activeReportSubCategories = useSelector(selectActiveReportSubCategories)
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )
  const timerangeTooLong = !getDownloadReportSupported(timerange.start, timerange.end)
  const { status: reportStatus, error: statusError, dispatchFetchReport } = useFetchReportVessel()
  const dispatchTimeoutRef = useRef<NodeJS.Timeout>(undefined)
  const hasVessels = useSelector(selectHasReportVessels)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)
  const reportLoadVessels = useSelector(selectReportLoadVessels)
  const { dispatchQueryParams } = useLocationConnect()

  // TODO get this from datasets config
  const activityUnit = reportCategory === ReportCategory.Activity ? 'hour' : 'detection'

  const reportLoading = reportStatus === AsyncReducerStatus.Loading
  const reportError = reportStatus === AsyncReducerStatus.Error
  const reportLoaded = reportStatus === AsyncReducerStatus.Finished
  const reportOutdated =
    reportRequestHash !== '' &&
    reportRequestHash !==
      getReportRequestHash({
        datasets: reportDataviews.flatMap(({ datasets }) => datasets?.map((d) => d.id) || []),
        filters: (reportDataviews as any[]).map((d) => d.filter),
        dateRange: timerange,
      })
  const hasAuthError = reportError && isAuthError(statusError)

  const { currentReportUrl } = statusError?.metadata || ({} as { currentReportUrl: string })
  const lastReport = currentReportUrl
    ? lastReports.find((report) => {
        const currentReportParams = parseReportUrl(currentReportUrl)
        const reportParams = parseReportUrl(report.reportUrl)
        return isEqual(currentReportParams, reportParams)
      })
    : undefined
  const concurrentReportError = getIsConcurrentError(statusError!)
  const isSameWorkspaceReport =
    concurrentReportError && window?.location.href === lastReport?.workspaceUrl

  const isTimeoutError = getIsTimeoutError(statusError!)
  useEffect(() => {
    if (isTimeoutError || isSameWorkspaceReport) {
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

  useEffect(() => {
    if (reportLoadVessels && reportDataviews?.length) {
      dispatch(setReportRequestHash(''))
      dispatchFetchReport()
      dispatchQueryParams({ reportLoadVessels: false })
    }
  }, [dispatch, dispatchFetchReport, reportLoadVessels, reportDataviews, dispatchQueryParams])

  const ReportVesselError = useMemo(() => {
    if (hasAuthError || guestUser) {
      const errorMsg = guestUser
        ? isVesselGroupReportLocation
          ? t('errors.vesselGroupReportLogin')
          : t('errors.reportLogin')
        : t(
            'errors.privateReport',
            "Your account doesn't have permissions to see the vessels active in this area"
          )
      return (
        <ReportVesselsPlaceholder animate={false}>
          <div className={styles.cover}>
            <WorkspaceLoginError
              title={errorMsg}
              emailSubject={`Requesting access for ${datasetId}-${areaId} report`}
            />
          </div>
        </ReportVesselsPlaceholder>
      )
    }
    if (statusError) {
      if (concurrentReportError) {
        if (isSameWorkspaceReport) {
          return <ReportVesselsPlaceholder animate={false} />
        }
        return (
          <ReportVesselsPlaceholder animate={false}>
            <div className={styles.cover}>
              <p className={styles.error}>
                {t('analysis.errorConcurrentReport')}
                <p className={styles.link}>
                  {lastReport && (
                    <a href={lastReport.workspaceUrl}>{t('analysis.errorConcurrentReportLink')}</a>
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
          <ReportVesselsPlaceholder animate={false}>
            <div className={styles.cover}>
              <p className={styles.error}>{t('analysis.errorTooComplex')}</p>
            </div>
          </ReportVesselsPlaceholder>
        )
      }
      if (isTimeoutError) {
        return (
          <ReportVesselsPlaceholder animate={false}>
            <div className={styles.cover}>
              <p className={cx(styles.center, styles.top)}>{t('analysis.timeoutError')}</p>
            </div>
          </ReportVesselsPlaceholder>
        )
      }
      return (
        <ReportVesselsPlaceholder animate={false}>
          <div className={styles.cover}>
            <p className={styles.error}>{statusError.message}</p>
          </div>
        </ReportVesselsPlaceholder>
      )
    }

    if (!reportDataviews?.length) {
      return <p className={styles.error}>{t('analysis.datasetsNotAllowedAll')} </p>
    }
    return (
      <p className={styles.error}>
        <span>
          {t('errors.generic')} <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
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
    isTimeoutError,
    isVesselGroupReportLocation,
    lastReport,
    reportDataviews?.length,
    statusError,
    t,
  ])

  const ReportComponent = useMemo(() => {
    if (workspaceStatus === AsyncReducerStatus.Loading) {
      return <ReportVesselsPlaceholder className="print-hidden" />
    }
    if (timerangeTooLong) {
      return (
        <ReportVesselsPlaceholder animate={false} className="print-hidden">
          <div className={cx(styles.cover, styles.error)}>
            <p>{t('analysis.timeRangeTooLong')}</p>
          </div>
        </ReportVesselsPlaceholder>
      )
    }

    if (reportError || (!reportLoading && !reportDataviews?.length)) {
      return ReportVesselError
    }

    if (timeComparisonValues) {
      return (
        <ReportVesselsPlaceholder animate={false} className="print-hidden">
          <div className={cx(styles.cover, styles.center, styles.top)}>
            <p
              dangerouslySetInnerHTML={{
                __html: t('analysis.onlyEvolutionSupported'),
              }}
            />
          </div>
        </ReportVesselsPlaceholder>
      )
    }

    if (
      (reportOutdated || reportStatus === AsyncReducerStatus.Idle) &&
      !reportLoading &&
      !hasAuthError
    ) {
      return (
        <ReportVesselsPlaceholder animate={false} className="print-hidden">
          <div className={cx(styles.cover, styles.center, styles.top)}>
            <p
              dangerouslySetInnerHTML={{
                __html: t('analysis.newTimeRange', {
                  start: formatI18nDate(timerange?.start),
                  end: formatI18nDate(timerange?.end),
                }),
              }}
            />
            <Button
              testId="see-vessel-table-activity-report"
              onClick={() => {
                dispatch(setReportRequestHash(''))
                dispatchFetchReport()
                trackEvent({
                  category: TrackCategory.Analysis,
                  action: 'Click on see vessels button in report activity',
                })
              }}
            >
              {t('analysis.seeVessels')}
            </Button>
          </div>
        </ReportVesselsPlaceholder>
      )
    }
    if (reportLoaded) {
      return hasVessels ? (
        <Fragment>
          <ReportVessels
            title={
              isVesselGroupReportLocation
                ? undefined
                : reportCategory === ReportCategory.Detections
                  ? t('common.matchedVessels')
                  : t('common.vessel_other')
            }
            activityUnit={
              isVesselGroupReportLocation
                ? undefined
                : reportCategory === ReportCategory.Activity
                  ? 'hour'
                  : 'detection'
            }
          />
          <ReportDownload />
        </Fragment>
      ) : (
        <div className={styles.error}>
          {datasetsDownloadNotSupported.length > 0 ? (
            <p className={styles.secondary}>
              {t('analysis.datasetsNotAllowed')}{' '}
              {datasetsDownloadNotSupported.map((dataset, index) => (
                <Fragment>
                  <DatasetLabel key={dataset} dataset={{ id: dataset }} />
                  {index < datasetsDownloadNotSupported.length - 1 && ', '}
                </Fragment>
              ))}
            </p>
          ) : (
            <p>{t('analysis.noDataByArea')}</p>
          )}
        </div>
      )
    }

    return <ReportVesselsPlaceholder animate={false} className="print-hidden" />
  }, [
    workspaceStatus,
    timerangeTooLong,
    reportError,
    reportLoading,
    reportDataviews?.length,
    timeComparisonValues,
    reportOutdated,
    reportStatus,
    hasAuthError,
    reportLoaded,
    t,
    ReportVesselError,
    timerange?.start,
    timerange?.end,
    dispatch,
    dispatchFetchReport,
    hasVessels,
    isVesselGroupReportLocation,
    reportCategory,
    datasetsDownloadNotSupported,
  ])

  return (
    <Fragment>
      {activeReportSubCategories && activeReportSubCategories.length > 1 && (
        <div className={styles.subsectionSelectorContainer}>
          <ReportActivitySubsectionSelector />
        </div>
      )}
      <ReportSummary activityUnit={activityUnit} reportStatus={reportStatus} />
      <ReportActivityGraph />
      {ReportComponent}
    </Fragment>
  )
}

export default ActivityReport
