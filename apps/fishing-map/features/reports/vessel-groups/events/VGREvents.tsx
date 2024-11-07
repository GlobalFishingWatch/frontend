/* eslint-disable @next/next/no-img-element */
import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import parse from 'html-react-parser'
import { DateTime } from 'luxon'
import {
  ReportEventsStatsResponseGroups,
  ReportEventsVesselsParams,
  ReportEventsStatsParams,
  useGetReportEventsStatsQuery,
  useGetReportEventsVesselsQuery,
} from 'queries/report-events-stats-api'
import { useTranslation } from 'react-i18next'
import { lowerCase } from 'es-toolkit'
import { Icon } from '@globalfishingwatch/ui-components'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import VGREventsSubsectionSelector from 'features/reports/vessel-groups/events/VGREventsSubsectionSelector'
import VGREventsGraph from 'features/reports/events/EventsReportGraph'
import {
  selectVGREventsVesselFilter,
  selectVGREventsVesselsProperty,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import VesselGroupReportVesselsGraph from 'features/reports/vessel-groups/vessels/VesselGroupReportVesselsGraph'
import { selectVGREventsSubsectionDataview } from 'features/reports/vessel-groups/vessel-group-report.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import VGREventsVesselPropertySelector from 'features/reports/events/EventsReportVesselPropertySelector'
import VGREventsVesselsTable from 'features/reports/events/EventsReportVesselsTable'
import ReportVesselsFilter from 'features/reports/activity/vessels/ReportVesselsFilter'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { VESSEL_GROUP_ENCOUNTER_EVENTS_ID } from 'features/reports/vessel-groups/vessel-group-report.dataviews'
import {
  selectFetchVGREventsVesselsParams,
  selectVGREventsVessels,
  selectVGREventsVesselsFlags,
  selectVGREventsVesselsGrouped,
  selectVGREventsVesselsPagination,
} from 'features/reports/vessel-groups/events/vgr-events.selectors'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { selectVGRVesselDatasetsWithoutEventsRelated } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import EventsEmptyState from 'assets/images/emptyState-events@2x.png'
import ReportEventsPlaceholder from 'features/reports/placeholders/ReportEventsPlaceholder'
import { selectVGREventsVesselsPaginated } from 'features/reports/vessel-groups/events/vgr-events.selectors'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import VGREventsVesselsTableFooter from '../../events/EventsReportVesselsTableFooter'
import styles from './VGREvents.module.css'

function VGREvents() {
  const { t } = useTranslation()
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const filter = useSelector(selectVGREventsVesselFilter)
  const eventsDataview = useSelector(selectVGREventsSubsectionDataview)
  const vesselsGroupByProperty = useSelector(selectVGREventsVesselsProperty)
  const vesselsWithEvents = useSelector(selectVGREventsVessels)
  const vesselFlags = useSelector(selectVGREventsVesselsFlags)
  const vesselGroups = useSelector(selectVGREventsVesselsGrouped)
  const vesselsPaginated = useSelector(selectVGREventsVesselsPaginated)
  const { start, end } = useSelector(selectTimeRange)
  const vesselDatasets = useSelector(selectVesselsDatasets)
  const datasetsWithoutRelatedEvents = useSelector(selectVGRVesselDatasetsWithoutEventsRelated)
  const reportVesselFilter = useSelector(selectVGREventsVesselFilter)
  const pagination = useSelector(selectVGREventsVesselsPagination)
  const params = useSelector(selectFetchVGREventsVesselsParams)
  const { status: vessselStatus } = useGetReportEventsVesselsQuery(
    params as ReportEventsVesselsParams,
    {
      skip: !params,
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
      skip: !vesselGroupId || !eventsDataview,
    }
  )
  const isLoading = statsStatus === 'pending' || vessselStatus === 'pending'

  if (!vesselDatasets.length) {
    return (
      <Fragment>
        <div className={styles.selector}>
          <VGREventsSubsectionSelector />
        </div>
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
        <div className={styles.selector}>
          <VGREventsSubsectionSelector />
        </div>
        {isLoading && <ReportEventsPlaceholder />}
        {error && !isLoading ? <p className={styles.error}>{(error as any).message}</p> : null}
      </Fragment>
    )
  }
  const subCategoryDataset = eventsDataview?.datasets?.find(
    (d) => d.type === DatasetTypes.Events
  )?.subcategory
  const totalEvents = data.timeseries.reduce((acc, group) => acc + group.value, 0)
  return (
    <Fragment>
      <div className={styles.selector}>
        <VGREventsSubsectionSelector />
      </div>
      {totalEvents > 0 ? (
        <Fragment>
          <div className={styles.container}>
            <h2 className={styles.summary}>
              {parse(
                t('vesselGroup.summaryEvents', {
                  defaultValue:
                    '<strong>{{vessels}} vessels</strong> from <strong>{{flags}} flags</strong> had <strong>{{activityQuantity}} {{activityUnit}}</strong> globally between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
                  vessels: formatI18nNumber(vesselsWithEvents?.length || 0),
                  flags: vesselFlags?.size,
                  activityQuantity: totalEvents,
                  activityUnit: `${
                    subCategoryDataset !== undefined
                      ? t(
                          `common.eventLabels.${subCategoryDataset.toLowerCase()}`,
                          lowerCase(subCategoryDataset)
                        )
                      : ''
                  } ${t('common.event', 'events').toLowerCase()}`,
                  start: formatI18nDate(start, {
                    format: DateTime.DATE_MED,
                  }),
                  end: formatI18nDate(end, {
                    format: DateTime.DATE_MED,
                  }),
                })
              )}
            </h2>
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
                property={vesselsGroupByProperty}
                propertyQueryParam="vGREventsVesselsProperty"
              />
            </div>
            <VesselGroupReportVesselsGraph
              data={vesselGroups as ReportEventsStatsResponseGroups}
              color={eventsDataview?.config?.color}
              property={vesselsGroupByProperty}
              filterQueryParam="vGREventsVesselFilter"
              pageQueryParam="vGREventsVesselPage"
            />
            <ReportVesselsFilter
              filter={filter}
              filterQueryParam="vGREventsVesselFilter"
              pageQueryParam="vGREventsVesselPage"
            />
            <VGREventsVesselsTable vessels={vesselsPaginated} />
            {vesselsWithEvents && vesselsWithEvents.length > 0 && (
              <VGREventsVesselsTableFooter
                vessels={vesselsWithEvents}
                filter={reportVesselFilter}
                pagination={pagination}
              />
            )}
          </div>
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

export default VGREvents
