import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import { useGetReportEventsStatsQuery } from 'queries/report-events-stats-api'
import { useTranslation } from 'react-i18next'
import VGREventsGraph from 'features/reports/events/VGREventsGraph'
import { selectReportPortId } from 'routes/routes.selectors'
import VGREventsVesselPropertySelector from 'features/reports/events/VGREventsVesselPropertySelector'
import VGREventsVesselsTable from 'features/reports/events/VGREventsVesselsTable'
import EventsEmptyState from 'assets/images/emptyState-events@2x.png'
import ReportEventsPlaceholder from 'features/reports/placeholders/ReportEventsPlaceholder'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import VesselGroupReportVesselsGraph from '../vessel-groups/vessels/VesselGroupReportVesselsGraph'
import ReportVesselsFilter from '../activity/vessels/ReportVesselsFilter'
import VGREventsVesselsTableFooter from '../events/VGREventsVesselsTableFooter'
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
import { selectPortsReportData } from './ports-report.slice'

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
  const isLoading = statsStatus === 'pending'

  // if (!vesselDatasets.length) {
  //   return (
  //     <Fragment>
  //       <div className={styles.selector}>
  //         <VGREventsSubsectionSelector />
  //       </div>
  //       <ReportEventsPlaceholder />
  //     </Fragment>
  //   )
  // }

  // if (datasetsWithoutRelatedEvents.length >= 1) {
  //   return (
  //     <div className={styles.disclaimer}>
  //       <Icon icon="warning" type="warning" />
  //       {t('vesselGroup.disclaimerFeaturesNotAvailable', {
  //         defaultValue:
  //           '{{features}} are only available for AIS vessels and your group contains vessels from {{datasets}}.',
  //         features: t('common.Events', 'Events'),
  //         datasets: Array.from(datasetsWithoutRelatedEvents)
  //           .map((d) => getDatasetLabel(d))
  //           .join(', '),
  //       })}
  //     </div>
  //   )
  // }

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
            <h2 className={styles.summary}>{portsReportData.portName}</h2>
            <VGREventsGraph
              color={color}
              start={start}
              end={end}
              timeseries={data.timeseries || []}
            />
          </div>
          <div className={styles.container}>
            <div className={styles.flex}>
              <label>{t('common.vessels', 'Vessels')}</label>
              <VGREventsVesselPropertySelector
                property={portReportVesselsProperty}
                propertyQueryParam="portsReportVesselsProperty"
              />
            </div>
            <VesselGroupReportVesselsGraph
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
            <VGREventsVesselsTable vessels={portsReportVesselsPaginated} />
            {portsReportData?.vessels && portsReportData?.vessels?.length > 0 && (
              <VGREventsVesselsTableFooter
                pageQueryParam="portsReportVesselsPage"
                resultsPerPageQueryParam="portsReportVesselsResultsPerPage"
                vessels={portsReportData.vessels}
                filter={portReportVesselFilter}
                pagination={portsReportPagination}
              />
            )}
          </div>
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
