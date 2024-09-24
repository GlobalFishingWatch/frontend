import { Fragment, useEffect, useMemo, useRef } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import isEqual from 'lodash/isEqual'
import { Button } from '@globalfishingwatch/ui-components'
import {
  getIsConcurrentError,
  getIsTimeoutError,
  isAuthError,
} from '@globalfishingwatch/api-client'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import {
  isActivityReport,
  selectActiveReportDataviews,
} from 'features/dataviews/selectors/dataviews.selectors'
import { WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectReportDataviewsWithPermissions } from 'features/reports/areas/reports.selectors'
import { selectHasReportVessels } from 'features/reports/activity/vessels/report-activity-vessels.selectors'
import ReportVesselsPlaceholder from 'features/reports/areas/placeholders/ReportVesselsPlaceholder'
import { getDownloadReportSupported } from 'features/download/download.utils'
import { SUPPORT_EMAIL } from 'data/config'
import { parseReportUrl } from 'features/reports/areas/reports.utils'
import {
  getDateRangeHash,
  selectReportVesselsDateRangeHash,
  setDateRangeHash,
} from 'features/reports/areas/report.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectReportAreaId,
  selectReportCategory,
  selectReportDatasetId,
} from 'features/app/selectors/app.reports.selector'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { getDatasetsReportNotSupported } from 'features/datasets/datasets.utils'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { LAST_REPORTS_STORAGE_KEY, LastReportStorage } from 'features/reports/areas/reports.config'
// import { REPORT_BUFFER_GENERATOR_ID } from 'features/map/map.config'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import ReportActivityGraph from 'features/reports/activity/ReportActivityGraph'
import { useFetchReportVessel } from 'features/reports/areas/reports.hooks'
import ReportVessels from 'features/reports/activity/vessels/ReportVessels'
import ReportDownload from 'features/reports/activity/download/ReportDownload'
import styles from 'features/reports/areas/Report.module.css'

export type ReportActivityUnit = 'hour' | 'detection'

function ActivityReport({ reportName }: { reportName?: string }) {
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
  const concurrentReportError = getIsConcurrentError(statusError!)
  const isSameWorkspaceReport =
    concurrentReportError && window?.location.href === lastReport?.workspaceUrl

  const isTimeoutError = getIsTimeoutError(statusError!)
  useEffect(() => {
    if (isTimeoutError) {
      dispatchTimeoutRef.current = setTimeout(() => {
        dispatchFetchReport()
      }, 1000 * 30) // retrying each 30 secs
    }
    return () => {
      if (dispatchTimeoutRef.current) {
        clearTimeout(dispatchTimeoutRef.current)
      }
    }
  }, [dispatchFetchReport, isTimeoutError])

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
      if (isTimeoutError) {
        return (
          <ReportVesselsPlaceholder>
            <div className={styles.cover}>
              <p className={cx(styles.center, styles.top)}>
                {t('analysis.timeoutError', 'This is taking more than expected, please wait')}
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
    isTimeoutError,
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

    if (reportError || (!reportLoading && !reportDataviews?.length)) {
      return ReportVesselError
    }

    if (
      (reportOutdated || reportStatus === AsyncReducerStatus.Idle) &&
      !reportLoading &&
      !hasAuthError
    ) {
      return (
        <ReportVesselsPlaceholder>
          <div className={cx(styles.cover, styles.center, styles.top)}>
            <p
              dangerouslySetInnerHTML={{
                __html: t('analysis.newTimeRange', {
                  defaultValue:
                    'Click the button to see the vessels active in the area<br/>between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
                  start: formatI18nDate(timerange?.start),
                  end: formatI18nDate(timerange?.end),
                }),
              }}
            />
            <Button
              onClick={() => {
                dispatch(setDateRangeHash(''))
                dispatchFetchReport()
              }}
            >
              {t('analysis.seeVessels', 'See vessels')}
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

    return <ReportVesselsPlaceholder />
  }, [
    workspaceStatus,
    timerangeTooLong,
    reportError,
    reportLoading,
    reportDataviews?.length,
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
    activityUnit,
    reportName,
    datasetsDownloadNotSupported,
  ])

  return (
    <Fragment>
      <ReportActivityGraph />
      {ReportComponent}
    </Fragment>
  )
}

export default ActivityReport
