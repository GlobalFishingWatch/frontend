import { useSelector } from 'react-redux'
import cx from 'classnames'
import { Fragment } from 'react'
import { useGetReportEventsStatsQuery } from 'queries/report-events-stats-api'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'
import { DateTime } from 'luxon'
import { useGetPortInfoQuery } from 'queries/port-info-api'
import { Button } from '@globalfishingwatch/ui-components'
import EventsReportGraph from 'features/reports/shared/events/EventsReportGraph'
import { selectReportPortId } from 'routes/routes.selectors'
import EventsReportVesselPropertySelector from 'features/reports/shared/events/EventsReportVesselPropertySelector'
import EventsReportVesselsTable from 'features/reports/shared/events/EventsReportVesselsTable'
import EventsEmptyState from 'assets/images/emptyState-events@2x.png'
import ReportEventsPlaceholder from 'features/reports/shared/placeholders/ReportEventsPlaceholder'
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
import EventsReportVesselsGraph from '../vessel-groups/vessels/VesselGroupReportVesselsGraph'
import styles from './PortsReport.module.css'
import { useFetchPortsReport } from './ports-report.hooks'
import {
  selectPortReportsDataview,
  selectPortReportVesselsGrouped,
  selectPortReportVesselsPaginated,
  selectPortReportVesselsPagination,
  selectPortsReportVesselsFlags,
} from './ports-report.selectors'
import {
  selectPortReportDatasetId,
  selectPortReportVesselsFilter,
  selectPortReportVesselsProperty,
} from './ports-report.config.selectors'
import { selectPortsReportData, selectPortsReportStatus } from './ports-report.slice'

function PortsReport() {
  const dispatchFetchReport = useFetchPortsReport()
  const { t } = useTranslation()
  const dataview = useSelector(selectPortReportsDataview)
  const portId = useSelector(selectReportPortId)
  const datasetId = useSelector(selectPortReportDatasetId)
  const portReportVesselsProperty = useSelector(selectPortReportVesselsProperty)
  const portReportVesselFilter = useSelector(selectPortReportVesselsFilter)
  const { start, end } = useSelector(selectTimeRange)
  const portsReportPagination = useSelector(selectPortReportVesselsPagination)
  const portsReportData = useSelector(selectPortsReportData)
  const vesselFlags = useSelector(selectPortsReportVesselsFlags)
  const portsReportDataStatus = useSelector(selectPortsReportStatus)
  const portsReportVesselsGrouped = useSelector(selectPortReportVesselsGrouped)
  const portsReportVesselsPaginated = useSelector(selectPortReportVesselsPaginated)
  const {
    data,
    error,
    status: statsStatus,
  } = useGetReportEventsStatsQuery(
    {
      includes: ['TIME_SERIES'],
      filters: { portId },
      dataset: datasetId,
      start,
      end,
    },
    {
      skip: !portId,
    }
  )
  const { data: portInfoData, status: infoStatus } = useGetPortInfoQuery({
    dataset: datasetId,
    start,
    end,
  })
  console.log('🚀 ~ PortsReport ~ portInfoData:', portInfoData)

  const isPortInfoLoading = infoStatus === 'pending'
  const isPortsStatsLoading = statsStatus === 'pending'
  const isPortsReportDataLoading = portsReportDataStatus === AsyncReducerStatus.Loading
  const isPortsReportDataIdle = portsReportDataStatus === AsyncReducerStatus.Idle
  const isLoading = isPortsStatsLoading && isPortsReportDataLoading && isPortInfoLoading
  const color = dataview?.config?.color || '#9AEEFF'

  if (error || !data || isLoading) {
    return (
      <Fragment>
        {isLoading && (
          <Fragment>
            <div className={styles.container}>
              <ReportTitlePlaceholder />
            </div>
            <ReportEventsPlaceholder />
          </Fragment>
        )}
        {error && !isLoading ? <p className={styles.error}>{(error as any).message}</p> : null}
      </Fragment>
    )
  }

  const totalEvents = data.timeseries.reduce((acc, group) => acc + group.value, 0)

  return (
    <Fragment>
      {totalEvents > 0 ? (
        <Fragment>
          <div className={styles.container}>
            {isPortInfoLoading ? (
              <ReportTitlePlaceholder />
            ) : (
              <Fragment>
                <h1 className={styles.title}>
                  {formatInfoField(portsReportData.portName || portId, 'shipname')}
                  {portsReportData.portCountry &&
                    ` (${formatInfoField(portsReportData.portCountry, 'flag')})`}
                </h1>
              </Fragment>
            )}
          </div>
          <div className={styles.container}>
            {isPortsStatsLoading ? (
              <ReportTitlePlaceholder />
            ) : portsReportData?.vessels?.length && vesselFlags?.size ? (
              <h2 className={styles.summary}>
                {parse(
                  t('portsReport.summaryEvents', {
                    defaultValue:
                      '<strong>{{vessels}} vessels</strong> from <strong>{{flags}} flags</strong> visited this port <strong>{{activityQuantity}}</strong> times between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
                    vessels: formatI18nNumber(portsReportData?.vessels?.length || 0),
                    flags: vesselFlags?.size,
                    activityQuantity: totalEvents,
                    start: formatI18nDate(start, {
                      format: DateTime.DATE_MED,
                    }),
                    end: formatI18nDate(end, {
                      format: DateTime.DATE_MED,
                    }),
                  })
                )}
              </h2>
            ) : (
              <h2 className={styles.summary}>
                {parse(
                  t('portsReport.summaryEventsShort', {
                    defaultValue:
                      '<strong>{{activityQuantity}}</strong> visits between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
                    activityQuantity: totalEvents,
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
            {isPortsStatsLoading ? (
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

          {isPortsReportDataIdle ? (
            <ReportVesselsPlaceholder>
              <div className={cx(styles.cover, styles.center, styles.top)}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: t('portsReport.newTimeRange', {
                      defaultValue:
                        'Click the button to see the vessels that visited this port <br/>between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
                      start: formatI18nDate(start),
                      end: formatI18nDate(end),
                    }),
                  }}
                />
                <Button
                  onClick={() => {
                    // TODO:PORTS save date range hash
                    // dispatch(setDateRangeHash(''))
                    dispatchFetchReport()
                  }}
                >
                  {t('analysis.seeVessels', 'See vessels')}
                </Button>
              </div>
            </ReportVesselsPlaceholder>
          ) : isPortsReportDataLoading ? (
            <ReportVesselsPlaceholder />
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
      ) : (
        <div className={styles.emptyState}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={EventsEmptyState.src}
            alt=""
            width={EventsEmptyState.width / 2}
            height={EventsEmptyState.height / 2}
          />
          {t(
            'vessel.noEventsinTimeRange',
            'There are no events fully contained in your timerange.'
          )}
        </div>
      )}
    </Fragment>
  )
}

export default PortsReport
