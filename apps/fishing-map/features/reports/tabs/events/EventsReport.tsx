import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { lowerCase } from 'es-toolkit'
import htmlParser from 'html-react-parser'
import { DateTime } from 'luxon'
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
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { VESSEL_GROUP_ENCOUNTER_EVENTS_ID } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import { selectActiveReportSubCategories } from 'features/reports/reports.selectors'
import ReportEventsPlaceholder from 'features/reports/shared/placeholders/ReportEventsPlaceholder'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import {
  selectReportVesselsFlags,
  selectVGRVesselDatasetsWithoutEventsRelated,
} from 'features/reports/shared/vessels/report-vessels.selectors'
import ReportVessels from 'features/reports/shared/vessels/ReportVessels'
import { selectFetchEventsVesselsParams } from 'features/reports/tabs/events/events-report.selectors'
import EventsReportGraph from 'features/reports/tabs/events/EventsReportGraph'
import EventsReportSubsectionSelector from 'features/reports/tabs/events/EventsReportSubsectionSelector'
import {
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
  selectReportPortId,
  selectReportVesselGroupId,
} from 'routes/routes.selectors'

import styles from './EventsReport.module.css'

function EventsReport() {
  const { t } = useTranslation()
  const portId = useSelector(selectReportPortId)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const activeReportSubCategories = useSelector(selectActiveReportSubCategories)
  const eventsDataview = useSelector(selectActiveReportDataviews)?.[0]
  const { start, end } = useSelector(selectTimeRange)
  const vesselDatasets = useSelector(selectVesselsDatasets)
  const reportVesselsFlags = useSelector(selectReportVesselsFlags)
  const datasetsWithoutRelatedEvents = useSelector(selectVGRVesselDatasetsWithoutEventsRelated)
  const params = useSelector(selectFetchEventsVesselsParams)
  const showSubsectionSelector = activeReportSubCategories && activeReportSubCategories.length > 1
  const timerangeSupported = getDownloadReportSupported(start, end)

  const { data: vesselsData, status: vessselStatus } = useGetReportEventsVesselsQuery(
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

  const totalEvents = data?.timeseries.reduce((acc, group) => acc + group.value, 0)
  const isLoading = statsStatus === 'pending' || vessselStatus === 'pending'
  const eventDataset = eventsDataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  const eventType = eventDataset?.subcategory as EventType

  const title = useMemo(() => {
    if (!vesselsData) {
      return ''
    }
    const vessels = formatI18nNumber(vesselsData?.length || 0)
    const startDate = formatI18nDate(start, {
      format: DateTime.DATE_MED,
    })
    const endDate = formatI18nDate(end, {
      format: DateTime.DATE_MED,
    })
    if (isPortReportLocation) {
      return htmlParser(
        t('portsReport.summaryEvents', {
          defaultValue:
            '<strong>{{vessels}} vessels</strong> from <strong>{{flags}} flags</strong> entered this port <strong>{{activityQuantity}}</strong> times between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
          vessels,
          flags: reportVesselsFlags?.size || 0,
          activityQuantity: totalEvents,
          start: startDate,
          end: endDate,
        })
      )
    } else if (isVesselGroupReportLocation) {
      return htmlParser(
        t('vesselGroup.summaryEvents', {
          defaultValue:
            '<strong>{{vessels}} vessels</strong> from <strong>{{flags}} flags</strong> entered this port <strong>{{activityQuantity}}</strong> times between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
          vessels,
          flags: reportVesselsFlags?.size || 0,
          activityQuantity: totalEvents,
          activityUnit: `${
            eventType !== undefined
              ? t(`common.eventLabels.${eventType.toLowerCase()}`, lowerCase(eventType))
              : ''
          }`,
          start: startDate,
          end: endDate,
        })
      )
    }
    return ''
  }, [
    vesselsData,
    start,
    end,
    isPortReportLocation,
    isVesselGroupReportLocation,
    t,
    reportVesselsFlags?.size,
    totalEvents,
    eventType,
  ])

  if (!vesselDatasets.length) {
    return (
      <Fragment>
        {showSubsectionSelector && (
          <div className={styles.selector}>
            <EventsReportSubsectionSelector />
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
            <EventsReportSubsectionSelector />
          </div>
        )}
        {isLoading && <ReportEventsPlaceholder />}
        {error && !isLoading ? <p className={styles.error}>{(error as any).message}</p> : null}
      </Fragment>
    )
  }
  return (
    <Fragment>
      {showSubsectionSelector && (
        <div className={styles.selector}>
          <EventsReportSubsectionSelector />
        </div>
      )}
      {totalEvents && totalEvents > 0 ? (
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
            <ReportVessels
              color={eventsDataview?.config?.color}
              activityUnit="numEvents"
              title={t('common.vessels', 'Vessels')}
              loading={isLoading}
            />
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

export default EventsReport
