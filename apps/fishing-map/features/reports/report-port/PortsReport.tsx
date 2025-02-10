import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'
import { DateTime } from 'luxon'
import { useGetReportEventsStatsQuery } from 'queries/report-events-stats-api'

import EventsEmptyState from 'assets/images/emptyState-events@2x.png'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { getDownloadReportSupported } from 'features/download/download.utils'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { usePortsReportAreaFootprintFitBounds } from 'features/reports/report-area/area-reports.hooks'
import {
  selectPortReportCountry,
  selectPortReportDatasetId,
  selectPortReportName,
} from 'features/reports/reports.config.selectors'
import { useMigrateWorkspaceToast } from 'features/workspace/workspace-migration.hooks'
import { selectReportPortId } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatInfoField } from 'utils/info'

import { getDateRangeHash } from '../tabs/activity/reports-activity.slice'
import EventsReport from '../tabs/events/EventsReport'

import { useFetchPortsReport } from './ports-report.hooks'
import { selectPortReportsDataview } from './ports-report.selectors'
import { selectPortsReportDateRangeHash, selectPortsReportStatus } from './ports-report.slice'

import styles from './PortsReport.module.css'

const MAX_VESSELS_REPORT = 500

function PortsReport() {
  useMigrateWorkspaceToast()
  usePortsReportAreaFootprintFitBounds()
  const dispatchFetchReport = useFetchPortsReport()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const dataview = useSelector(selectPortReportsDataview)
  const portId = useSelector(selectReportPortId)
  const reportName = useSelector(selectPortReportName)
  const reportCountry = useSelector(selectPortReportCountry)
  const datasetId = useSelector(selectPortReportDatasetId)
  const { start, end } = useSelector(selectTimeRange)
  const portsReportDataStatus = useSelector(selectPortsReportStatus)
  const {
    data,
    error,
    status: statsStatus,
  } = useGetReportEventsStatsQuery(
    {
      filters: { portId },
      dataset: datasetId || '',
      start,
      end,
    },
    {
      skip: !portId,
    }
  )

  const isPortsStatsLoading = statsStatus === 'pending'
  const isPortsReportDataLoading = portsReportDataStatus === AsyncReducerStatus.Loading
  const isPortsReportDataIdle = portsReportDataStatus === AsyncReducerStatus.Idle
  const color = dataview?.config?.color || '#9AEEFF'
  const reportDateRangeHash = useSelector(selectPortsReportDateRangeHash)
  const reportOutdated = reportDateRangeHash !== getDateRangeHash({ start, end })
  const timerangeSupported = getDownloadReportSupported(start, end)
  const isVesselSupported =
    statsStatus === 'fulfilled' ? data !== undefined && data.numVessels < MAX_VESSELS_REPORT : true
  const allowsVesselsReport = timerangeSupported && isVesselSupported

  if (error) {
    return (
      <Fragment>
        {error && !isPortsStatsLoading ? (
          <p className={styles.error}>{(error as any).message}</p>
        ) : null}
      </Fragment>
    )
  }

  if (statsStatus === 'fulfilled' && data?.numEvents === 0) {
    return (
      <div className={styles.emptyState}>
        <img
          src={EventsEmptyState.src}
          alt=""
          width={EventsEmptyState.width / 2}
          height={EventsEmptyState.height / 2}
        />
        {t('vessel.noEventsinTimeRange', 'There are no events fully contained in your timerange.')}
      </div>
    )
  }

  const title = data
    ? parse(
        t('portsReport.summaryEvents', {
          defaultValue:
            '<strong>{{vessels}} vessels</strong> from <strong>{{flags}} flags</strong> entered this port <strong>{{activityQuantity}}</strong> times between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
          vessels: formatI18nNumber(data.numVessels || 0),
          flags: data?.numFlags,
          activityQuantity: data.numEvents,
          start: formatI18nDate(start, {
            format: DateTime.DATE_MED,
          }),
          end: formatI18nDate(end, {
            format: DateTime.DATE_MED,
          }),
        })
      )
    : ''

  return (
    <Fragment>
      <div className={styles.titleContainer}>
        <label className={styles.portLabel}>{t('event.port', 'Port')}</label>
        <h1 className={styles.title}>
          {formatInfoField(reportName || portId, 'shipname')} (
          {formatInfoField(reportCountry, 'flag')})
        </h1>
      </div>
      <EventsReport title={title} />
    </Fragment>
  )
}

export default PortsReport
