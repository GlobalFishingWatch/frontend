import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type {
  ReportEventsStatsParams,
  ReportEventsVesselsParams,
} from 'queries/report-events-stats-api'
import {
  useGetReportEventsStatsQuery,
  useGetReportEventsVesselsQuery,
} from 'queries/report-events-stats-api'

import type { EventType } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'
import { Icon } from '@globalfishingwatch/ui-components'

import EventsEmptyState from 'assets/images/emptyState-events@2x.png'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { getDownloadReportSupported } from 'features/download/download.utils'
import { VESSEL_GROUP_ENCOUNTER_EVENTS_ID } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import { selectActiveReportSubCategories } from 'features/reports/reports.selectors'
import ReportEventsPlaceholder from 'features/reports/shared/placeholders/ReportEventsPlaceholder'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import {
  selectReportVesselsFlags,
  selectVGRVesselDatasetsWithoutEventsRelated,
} from 'features/reports/shared/vessels/report-vessels.selectors'
import ReportVessels from 'features/reports/shared/vessels/ReportVessels'
import {
  selectEventsVessels,
  selectFetchEventsVesselsParams,
} from 'features/reports/tabs/events/events-report.selectors'
import EventsReportGraph from 'features/reports/tabs/events/EventsReportGraph'
import VGREventsSubsectionSelector from 'features/reports/tabs/events/EventsReportSubsectionSelector'
import { selectReportPortId, selectReportVesselGroupId } from 'routes/routes.selectors'

import styles from './EventsReport.module.css'

function EventsReport({ title }: { title: string }) {
  const { t } = useTranslation()
  const portId = useSelector(selectReportPortId)
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const activeReportSubCategories = useSelector(selectActiveReportSubCategories)
  const eventsDataview = useSelector(selectActiveReportDataviews)?.[0]
  // TODO:CVP decide if we
  // const vesselsWithEvents = useSelector(selectEventsVessels)
  // const vesselFlags = useSelector(selectReportVesselsFlags)
  const { start, end } = useSelector(selectTimeRange)
  const vesselDatasets = useSelector(selectVesselsDatasets)
  const datasetsWithoutRelatedEvents = useSelector(selectVGRVesselDatasetsWithoutEventsRelated)
  const params = useSelector(selectFetchEventsVesselsParams)
  const showSubsectionSelector = activeReportSubCategories && activeReportSubCategories.length > 1
  const timerangeSupported = getDownloadReportSupported(start, end)

  const { status: vessselStatus } = useGetReportEventsVesselsQuery(
    params as ReportEventsVesselsParams,
    {
      skip: !params || !timerangeSupported,
    }
  )

  const {
    data,
    error,
    status: statsStatus,
  } = useGetReportEventsStatsQuery(
    {
      ...params,
      includes: ['TIME_SERIES'],
    } as ReportEventsStatsParams,
    {
      skip: !eventsDataview,
    }
  )
  const isLoading = statsStatus === 'pending' || vessselStatus === 'pending'

  if (!vesselDatasets.length) {
    return (
      <Fragment>
        {showSubsectionSelector && (
          <div className={styles.selector}>
            <VGREventsSubsectionSelector />
          </div>
        )}
        <ReportEventsPlaceholder />
      </Fragment>
    )
  }

  if (datasetsWithoutRelatedEvents.length >= 1) {
    return (
      <div className={styles.disclaimer}>
        <Icon icon="warning" type="warning" />
        {t('vesselGroup.disclaimerFeaturesNotAvailable', {
          defaultValue:
            '{{features}} are only available for AIS vessels and your group contains vessels from {{datasets}}.',
          features: t('common.Events', 'Events'),
          datasets: Array.from(datasetsWithoutRelatedEvents)
            .map((d) => getDatasetLabel(d))
            .join(', '),
        })}
      </div>
    )
  }

  let color = eventsDataview?.config?.color || COLOR_PRIMARY_BLUE

  if (eventsDataview?.id === VESSEL_GROUP_ENCOUNTER_EVENTS_ID) {
    color = 'rgb(247 222 110)' // Needed to make the graph lines more visible
  }

  if (error || !data || isLoading) {
    return (
      <Fragment>
        {showSubsectionSelector && (
          <div className={styles.selector}>
            <VGREventsSubsectionSelector />
          </div>
        )}
        {isLoading && <ReportEventsPlaceholder />}
        {error && !isLoading ? <p className={styles.error}>{(error as any).message}</p> : null}
      </Fragment>
    )
  }
  const eventDataset = eventsDataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  const eventType = eventDataset?.subcategory as EventType
  const totalEvents = data.timeseries.reduce((acc, group) => acc + group.value, 0)
  return (
    <Fragment>
      {showSubsectionSelector && (
        <div className={styles.selector}>
          <VGREventsSubsectionSelector />
        </div>
      )}
      {totalEvents > 0 ? (
        <Fragment>
          <div className={styles.container}>
            <h2 className={styles.summary}>{title}</h2>
            {eventDataset?.id && (
              <EventsReportGraph
                datasetId={eventDataset?.id}
                filters={{
                  portId,
                  vesselGroupId,
                  ...(eventsDataview && { ...getDataviewFilters(eventsDataview) }),
                }}
                includes={[
                  'id',
                  'start',
                  'end',
                  'vessel',
                  ...(eventType === 'encounter' ? ['encounter.vessel'] : []),
                ]}
                color={color}
                start={start}
                end={end}
                timeseries={data.timeseries || []}
                eventType={eventType}
              />
            )}
          </div>
          {!timerangeSupported ? (
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
          ) : (
            <ReportVessels title={t('common.vessels', 'Vessels')} loading={isLoading} />
          )}
        </Fragment>
      ) : (
        <div className={styles.emptyState}>
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

export default EventsReport
