import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { GetReportEventParams } from 'queries/report-events-stats-api'
import {
  useGetReportEventsStatsQuery,
  useGetReportEventsVesselsQuery,
} from 'queries/report-events-stats-api'

import { Button, Icon } from '@globalfishingwatch/ui-components'

import EventsEmptyState from 'assets/images/emptyState-events@2x.png'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { useFetchContextDatasetAreas } from 'features/areas/areas.hooks'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { getDownloadReportSupported } from 'features/download/download.utils'
import { formatI18nDate } from 'features/i18n/i18nDate'
import {
  selectActiveReportSubCategories,
  selectReportSubCategory,
} from 'features/reports/reports.selectors'
import type { AnyReportSubCategory } from 'features/reports/reports.types'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import ReportEventsPlaceholder from 'features/reports/shared/placeholders/ReportEventsPlaceholder'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import ReportSummary from 'features/reports/shared/summary/ReportSummary'
import { selectVGRVesselDatasetsWithoutEventsRelated } from 'features/reports/shared/vessels/report-vessels.selectors'
import ReportVessels from 'features/reports/shared/vessels/ReportVessels'
import EventReportPorts from 'features/reports/tabs/events/EventReportPorts'
import {
  selectEventsGraphDatasetAreaId,
  selectFetchEventsStatsParams,
  selectFetchEventsVesselsParams,
  selectTotalStatsEvents,
} from 'features/reports/tabs/events/events-report.selectors'
import EventsReportGraph from 'features/reports/tabs/events/EventsReportGraph'
import EventsReportGraphSelector from 'features/reports/tabs/events/EventsReportGraphSelector'
import EventsReportSubsectionSelector from 'features/reports/tabs/events/EventsReportSubsectionSelector'
import { useLocationConnect } from 'routes/routes.hook'
import { selectUrlReportLoadVesselsQuery } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './EventsReport.module.css'

function getReportHash(
  subsection: AnyReportSubCategory | undefined,
  { start, end }: { start: string; end: string }
) {
  return `${subsection || ''}-(${start}-${end})`
}

function EventsReport() {
  const { t } = useTranslation()
  const activeReportSubCategories = useSelector(selectActiveReportSubCategories)
  const eventsDataview = useSelector(selectActiveReportDataviews)?.[0]
  const { start, end } = useSelector(selectTimeRange)
  const vesselDatasets = useSelector(selectVesselsDatasets)
  const subsection = useSelector(selectReportSubCategory)
  const datasetsWithoutRelatedEvents = useSelector(selectVGRVesselDatasetsWithoutEventsRelated)
  const params = useSelector(selectFetchEventsVesselsParams)
  const statsParams = useSelector(selectFetchEventsStatsParams)
  const totalEvents = useSelector(selectTotalStatsEvents)
  const reportLoadVessels = useSelector(selectUrlReportLoadVesselsQuery)
  const showSubsectionSelector = activeReportSubCategories && activeReportSubCategories.length > 1
  const timerangeSupported = getDownloadReportSupported(start, end)
  const datasetAreasId = useSelector(selectEventsGraphDatasetAreaId)
  const datasetAreas = useFetchContextDatasetAreas(datasetAreasId)
  const { dispatchQueryParams } = useLocationConnect()

  const [reportHash, setReportHash] = useState('idle')
  const reportOutdated = reportHash !== getReportHash(subsection, { start, end })

  const { status: vessselStatus } = useGetReportEventsVesselsQuery(params as GetReportEventParams, {
    skip: !params || !timerangeSupported || reportOutdated,
  })

  const { error: statsError, status: statsStatus } = useGetReportEventsStatsQuery(statsParams, {
    skip: !eventsDataview,
  })

  useEffect(() => {
    if (reportLoadVessels && eventsDataview) {
      setReportHash(getReportHash(subsection, { start, end }))
      dispatchQueryParams({ reportLoadVessels: false })
    }
  }, [reportLoadVessels, eventsDataview, subsection, start, end, dispatchQueryParams])

  const isLoadingStats = statsStatus === 'pending'
  const isLoadingVessels = vessselStatus === 'pending'
  const noEvents = !isLoadingStats && totalEvents !== undefined && totalEvents === 0

  const graph = useMemo(() => {
    if (statsError) {
      return <p className={styles.error}>{(statsError as any).message}</p>
    }
    if (
      (datasetAreasId && datasetAreas?.status !== AsyncReducerStatus.Finished) ||
      isLoadingStats
    ) {
      return <ReportActivityPlaceholder showHeader={false} />
    }
    if (noEvents) {
      return (
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
      )
    }
    return <EventsReportGraph />
  }, [datasetAreas?.status, datasetAreasId, isLoadingStats, noEvents, statsError, t])

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

  return (
    <Fragment>
      {showSubsectionSelector && (
        <div className={styles.selector}>
          <EventsReportSubsectionSelector />
        </div>
      )}

      <Fragment>
        <ReportSummary />
        <div className={styles.container}>
          <div className={styles.headerContainer}>
            <label>{t('common.events', 'Events')}</label>
            <EventsReportGraphSelector disabled={isLoadingVessels || noEvents} />
          </div>
          {graph}
        </div>
        {noEvents ? null : !timerangeSupported ? (
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
        <div className={styles.container}>
          <EventReportPorts />
        </div>
      </Fragment>
    </Fragment>
  )
}

export default EventsReport
