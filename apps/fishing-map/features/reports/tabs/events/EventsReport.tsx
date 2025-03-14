import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { GetReportEventParams } from 'queries/report-events-stats-api'
import {
  useGetReportEventsStatsQuery,
  useGetReportEventsVesselsQuery,
} from 'queries/report-events-stats-api'

import type { EventType } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'
import { Button, Icon } from '@globalfishingwatch/ui-components'

import EventsEmptyState from 'assets/images/emptyState-events@2x.png'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { getDownloadReportSupported } from 'features/download/download.utils'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { VESSEL_GROUP_ENCOUNTER_EVENTS_ID } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import {
  selectActiveReportSubCategories,
  selectReportSubCategory,
} from 'features/reports/reports.selectors'
import type { AnyReportSubCategory } from 'features/reports/reports.types'
import ReportEventsPlaceholder from 'features/reports/shared/placeholders/ReportEventsPlaceholder'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import ReportSummary from 'features/reports/shared/summary/ReportSummary'
import { selectVGRVesselDatasetsWithoutEventsRelated } from 'features/reports/shared/vessels/report-vessels.selectors'
import ReportVessels from 'features/reports/shared/vessels/ReportVessels'
import {
  selectEventsStatsValueKeys,
  selectEventsTimeseries,
  selectFetchEventsStatsParams,
  selectFetchEventsVesselsParams,
  selectTotalStatsEvents,
} from 'features/reports/tabs/events/events-report.selectors'
import EventsReportGraph from 'features/reports/tabs/events/EventsReportGraph'
import EventsReportSubsectionSelector from 'features/reports/tabs/events/EventsReportSubsectionSelector'
import { selectReportPortId, selectReportVesselGroupId } from 'routes/routes.selectors'

import styles from './EventsReport.module.css'

function getReportHash(
  subsection: AnyReportSubCategory | undefined,
  { start, end }: { start: string; end: string }
) {
  return `${subsection || ''}-(${start}-${end})`
}

function EventsReport() {
  const { t } = useTranslation()
  const portId = useSelector(selectReportPortId)
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const activeReportSubCategories = useSelector(selectActiveReportSubCategories)
  const eventsDataview = useSelector(selectActiveReportDataviews)?.[0]
  const { start, end } = useSelector(selectTimeRange)
  const vesselDatasets = useSelector(selectVesselsDatasets)
  const subsection = useSelector(selectReportSubCategory)
  const datasetsWithoutRelatedEvents = useSelector(selectVGRVesselDatasetsWithoutEventsRelated)
  const params = useSelector(selectFetchEventsVesselsParams)
  const statsParams = useSelector(selectFetchEventsStatsParams)
  const eventsTimeseries = useSelector(selectEventsTimeseries)
  const totalEvents = useSelector(selectTotalStatsEvents)
  const eventsStatsValueKeys = useSelector(selectEventsStatsValueKeys)
  const showSubsectionSelector = activeReportSubCategories && activeReportSubCategories.length > 1
  const timerangeSupported = getDownloadReportSupported(start, end)

  const [reportHash, setReportHash] = useState('idle')
  const reportOutdated = reportHash !== getReportHash(subsection, { start, end })

  const { status: vessselStatus } = useGetReportEventsVesselsQuery(params as GetReportEventParams, {
    skip: !params || !timerangeSupported || reportOutdated,
  })

  const { error, status: statsStatus } = useGetReportEventsStatsQuery(statsParams, {
    skip: !eventsDataview,
  })

  const isLoadingStats = statsStatus === 'pending'
  const isLoadingVessels = vessselStatus === 'pending'
  const eventDataset = eventsDataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  const eventType = eventDataset?.subcategory as EventType

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

  if (error || !eventsTimeseries || isLoadingStats) {
    return (
      <Fragment>
        {showSubsectionSelector && (
          <div className={styles.selector}>
            <EventsReportSubsectionSelector />
          </div>
        )}
        {isLoadingStats && <ReportEventsPlaceholder />}
        {error && !isLoadingStats ? <p className={styles.error}>{(error as any).message}</p> : null}
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
          <ReportSummary />
          <div className={styles.container}>
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
                valueKeys={eventsStatsValueKeys}
                color={color}
                start={start}
                end={end}
                data={eventsTimeseries || []}
                eventType={eventType}
              />
            )}
          </div>
          {!timerangeSupported ? (
            <ReportVesselsPlaceholder animate={false}>
              <div className={cx(styles.cover, styles.error)}>
                <p>
                  {t(
                    'analysis.timeRangeTooLong',
                    'The selected time range is too long, please select a shorter time range'
                  )}
                </p>
              </div>
            </ReportVesselsPlaceholder>
          ) : reportOutdated ? (
            <ReportVesselsPlaceholder animate={false}>
              <div className={cx(styles.cover, styles.center, styles.top)}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: t('analysis.newTimeRange', {
                      defaultValue:
                        'Click the button to see the vessels active in the area<br/>between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
                      start: formatI18nDate(start),
                      end: formatI18nDate(end),
                    }),
                  }}
                />
                <Button
                  testId="see-vessel-table-events-report"
                  onClick={() => {
                    setReportHash(getReportHash(subsection, { start, end }))
                    trackEvent({
                      category: TrackCategory.Analysis,
                      action: 'Click on see vessels button in events activity',
                    })
                  }}
                >
                  {t('analysis.seeVessels', 'See vessels')}
                </Button>
              </div>
            </ReportVesselsPlaceholder>
          ) : (
            <ReportVessels
              color={eventsDataview?.config?.color}
              activityUnit="numEvents"
              title={t('common.vessels', 'Vessels')}
              loading={isLoadingVessels}
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
