import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import { useGetReportEventsStatsQuery } from 'queries/report-events-stats-api'
import { useTranslation } from 'react-i18next'
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
import EventsReportVesselsGraph from '../vessel-groups/vessels/VesselGroupReportVesselsGraph'
import styles from './PortsReport.module.css'
import { useFetchPortsReport } from './ports-report.hooks'
import {
  selectPortReportVesselsGrouped,
  selectPortReportVesselsPaginated,
  selectPortReportVesselsPagination,
} from './ports-report.selectors'
import {
  selectPortReportDatasetId,
  selectPortReportVesselsFilter,
  selectPortReportVesselsProperty,
} from './ports-report.config.selectors'
import { selectPortsReportData, selectPortsReportStatus } from './ports-report.slice'

function PortsReport() {
  useFetchPortsReport()
  const { t } = useTranslation()
  const portId = useSelector(selectReportPortId)
  const datasetId = useSelector(selectPortReportDatasetId)
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
  const isPortsStatsLoading = statsStatus === 'pending'
  const isPortsReportDataLoading = portsReportDataStatus === AsyncReducerStatus.Loading
  const isLoading = isPortsStatsLoading && isPortsReportDataLoading

  // TODO:PORTS
  const color = '#9AEEFF'
  // let color = eventsDataview?.config?.color || COLOR_PRIMARY_BLUE

  // if (eventsDataview?.id === VESSEL_GROUP_ENCOUNTER_EVENTS_ID) {
  //   color = 'rgb(247 222 110)' // Needed to make the graph lines more visible
  // }

  if (error || !data || isLoading) {
    return (
      <Fragment>
        {isLoading && <ReportEventsPlaceholder />}
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
            {isPortsReportDataLoading ? (
              <ReportTitlePlaceholder />
            ) : (
              <h1 className={styles.title}>{portsReportData.portName}</h1>
            )}
          </div>
          <div className={styles.container}>
            {isPortsStatsLoading ? (
              <div className={styles.container}>
                <ReportActivityPlaceholder showHeader={false} />
              </div>
            ) : (
              <EventsReportGraph
                color={color}
                start={start}
                end={end}
                timeseries={data.timeseries || []}
              />
            )}
          </div>
          {isPortsReportDataLoading ? (
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
