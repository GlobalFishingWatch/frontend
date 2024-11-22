import { useSelector } from 'react-redux'
import cx from 'classnames'
import { Fragment } from 'react'
import { useGetReportEventsStatsQuery } from 'queries/report-events-stats-api'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'
import { DateTime } from 'luxon'
import { Button } from '@globalfishingwatch/ui-components'
import EventsReportGraph from 'features/reports/shared/events/EventsReportGraph'
import { selectReportPortId } from 'routes/routes.selectors'
import EventsReportVesselPropertySelector from 'features/reports/shared/events/EventsReportVesselPropertySelector'
import EventsReportVesselsTable from 'features/reports/shared/events/EventsReportVesselsTable'
import EventsEmptyState from 'assets/images/emptyState-events@2x.png'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import ReportVesselsFilter from 'features/reports/shared/activity/vessels/ReportVesselsFilter'
import { AsyncReducerStatus } from 'utils/async-slice'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import EventsReportVesselsTableFooter from 'features/reports/shared/events/EventsReportVesselsTableFooter'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import ReportTitlePlaceholder from 'features/reports/shared/placeholders/ReportTitlePlaceholder'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatInfoField } from 'utils/info'
import { useAppDispatch } from 'features/app/app.hooks'
import { getDownloadReportSupported } from 'features/download/download.utils'
import EventsReportVesselsGraph from '../vessel-groups/vessels/VesselGroupReportVesselsGraph'
import { getDateRangeHash } from '../shared/activity/reports-activity.slice'
import styles from './PortsReport.module.css'
import { useFetchPortsReport } from './ports-report.hooks'
import {
  selectPortReportsDataview,
  selectPortReportVesselsGrouped,
  selectPortReportVesselsPaginated,
  selectPortReportVesselsPagination,
} from './ports-report.selectors'
import {
  selectPortReportCountry,
  selectPortsReportDatasetId,
  selectPortReportName,
  selectPortReportVesselsFilter,
  selectPortReportVesselsProperty,
} from './ports-report.config.selectors'
import {
  resetPortsReportData,
  selectPortsReportData,
  selectPortsReportStatus,
  selectPortsReportDateRangeHash,
} from './ports-report.slice'

const MAX_VESSELS_REPORT = 500

function PortsReport() {
  const dispatchFetchReport = useFetchPortsReport()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const dataview = useSelector(selectPortReportsDataview)
  const portId = useSelector(selectReportPortId)
  const reportName = useSelector(selectPortReportName)
  const reportCountry = useSelector(selectPortReportCountry)
  const datasetId = useSelector(selectPortsReportDatasetId)
  const portReportVesselsProperty = useSelector(selectPortReportVesselsProperty)
  const portReportVesselFilter = useSelector(selectPortReportVesselsFilter)
  const { start, end } = useSelector(selectTimeRange)
  const portsReportPagination = useSelector(selectPortReportVesselsPagination)
  const portsReportData = useSelector(selectPortsReportData)
  const portsReportDataStatus = useSelector(selectPortsReportStatus)
  const portsReportVesselsGrouped = useSelector(selectPortReportVesselsGrouped)
  const portsReportVesselsPaginated = useSelector(selectPortReportVesselsPaginated)
  const {
    data,
    error,
    status: statsStatus,
  } = useGetReportEventsStatsQuery(
    {
      filters: { portId },
      dataset: datasetId,
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
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

  return (
    <Fragment>
      <div className={styles.titleContainer}>
        <label className={styles.portLabel}>{t('event.port', 'Port')}</label>
        <h1 className={styles.title}>
          {formatInfoField(reportName || portId, 'shipname')} (
          {formatInfoField(reportCountry, 'flag')})
        </h1>
      </div>
      <div className={styles.container}>
        {isPortsStatsLoading || !data ? (
          <ReportTitlePlaceholder />
        ) : (
          <h2 className={styles.summary}>
            {parse(
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
            )}
          </h2>
        )}
        {isPortsStatsLoading || !data ? (
          <ReportActivityPlaceholder showHeader={false} />
        ) : (
          <EventsReportGraph
            color={color}
            start={start}
            end={end}
            timeseries={data.timeseries || []}
          />
        )}
      </div>

      {!allowsVesselsReport ? (
        <ReportVesselsPlaceholder>
          <div className={cx(styles.cover, styles.error)}>
            <p>
              {!isVesselSupported &&
                t('portsReport.maxVessels', {
                  defaultValue: 'Vessels report is available for up to {{vessels}} vessels',
                  vessels: MAX_VESSELS_REPORT,
                })}
              {!timerangeSupported &&
                t(
                  'analysis.timeRangeTooLong',
                  'The selected time range is too long, please select a shorter time range'
                )}
            </p>
          </div>
        </ReportVesselsPlaceholder>
      ) : isPortsReportDataLoading ? (
        <ReportVesselsPlaceholder />
      ) : isPortsReportDataIdle || reportOutdated ? (
        <ReportVesselsPlaceholder>
          {!isPortsStatsLoading && (
            <div className={cx(styles.cover, styles.center, styles.top)}>
              <p
                dangerouslySetInnerHTML={{
                  __html: t('portsReport.newTimeRange', {
                    defaultValue:
                      'Click the button to see the vessels that entered this port <br/>between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
                    start: formatI18nDate(start),
                    end: formatI18nDate(end),
                  }),
                }}
              />
              <Button
                onClick={() => {
                  dispatch(resetPortsReportData())
                  dispatchFetchReport()
                }}
              >
                {t('analysis.seeVessels', 'See vessels')}
              </Button>
            </div>
          )}
        </ReportVesselsPlaceholder>
      ) : (
        <div className={styles.container}>
          <div className={styles.flex}>
            <label>{t('common.vessels', 'Vessels')}</label>
            <EventsReportVesselPropertySelector
              property={portReportVesselsProperty}
              propertyQueryParam="portsReportVesselsProperty"
            />
          </div>
          <EventsReportVesselsGraph
            data={portsReportVesselsGrouped}
            color={color}
            property={portReportVesselsProperty}
            filterQueryParam="portsReportVesselsFilter"
            pageQueryParam="portsReportVesselsPage"
          />
          <ReportVesselsFilter
            filter={portReportVesselFilter}
            filterQueryParam="portsReportVesselsFilter"
            pageQueryParam="portsReportVesselsPage"
          />
          <EventsReportVesselsTable vessels={portsReportVesselsPaginated} />
          {portsReportData?.vessels && portsReportData?.vessels?.length > 0 && (
            <EventsReportVesselsTableFooter
              pageQueryParam="portsReportVesselsPage"
              resultsPerPageQueryParam="portsReportVesselsResultsPerPage"
              vessels={portsReportData.vessels}
              filter={portReportVesselFilter}
              pagination={portsReportPagination}
            />
          )}
        </div>
      )}
    </Fragment>
  )
}

export default PortsReport