import { useSelector } from 'react-redux'
import { Fragment, useMemo } from 'react'
import parse from 'html-react-parser'
import { DateTime } from 'luxon'
import {
  useGetVesselGroupEventsStatsQuery,
  VesselGroupEventsStatsResponseGroups,
} from 'queries/vessel-group-events-stats-api'
import { useTranslation } from 'react-i18next'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import VGREventsSubsectionSelector from 'features/reports/events/VGREventsSubsectionSelector'
import VGREventsGraph from 'features/reports/events/VGREventsGraph'
import {
  selectVGREventsVesselFilter,
  selectVGREventsVesselsProperty,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import VesselGroupReportVesselsGraph from 'features/reports/vessel-groups/vessels/VesselGroupReportVesselsGraph'
import { selectVGREventsSubsectionDataview } from 'features/reports/vessel-groups/vessel-group-report.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import VGREventsVesselPropertySelector from 'features/reports/events/VGREventsVesselPropertySelector'
import VGREventsVesselsTable from 'features/reports/events/VGREventsVesselsTable'
import ReportVesselsFilter from 'features/reports/activity/vessels/ReportVesselsFilter'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { VESSEL_GROUP_ENCOUNTER_EVENTS_ID } from 'features/reports/vessel-groups/vessel-group-report.dataviews'
import {
  selectVGREventsVessels,
  selectVGREventsVesselsFlags,
  selectVGREventsVesselsGrouped,
} from 'features/reports/events/vgr-events.selectors'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import styles from './VGREvents.module.css'

function VGREvents() {
  const { t } = useTranslation()
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const filter = useSelector(selectVGREventsVesselFilter)
  const eventsDataview = useSelector(selectVGREventsSubsectionDataview)
  const vesselsGroupByProperty = useSelector(selectVGREventsVesselsProperty)
  const vessels = useSelector(selectVGREventsVessels)
  const vesselFlags = useSelector(selectVGREventsVesselsFlags)
  const vesselGroups = useSelector(selectVGREventsVesselsGrouped)

  const { start, end } = useTimerangeConnect()
  const startMillis = DateTime.fromISO(start).toMillis()
  const endMillis = DateTime.fromISO(end).toMillis()
  const interval = getFourwingsInterval(startMillis, endMillis)

  const response = useGetVesselGroupEventsStatsQuery(
    {
      includes: ['TIME_SERIES'],
      dataview: eventsDataview!,
      vesselGroupId,
      interval,
      start,
      end,
    },
    {
      skip: !vesselGroupId || !eventsDataview,
    }
  )
  const { data, error, status } = response
  const isLoading = status === 'pending'

  let color = eventsDataview?.config?.color || COLOR_PRIMARY_BLUE

  if (eventsDataview?.id === VESSEL_GROUP_ENCOUNTER_EVENTS_ID) {
    color = 'rgb(247 222 110)' // Needed to make the graph lines more visible
  }

  if (error || !data || isLoading) {
    return (
      <div className={styles.container}>
        <VGREventsSubsectionSelector />
        {isLoading && <p>{t('common.loading', 'Loading...')}</p>}
        {error && !isLoading ? <p className={styles.error}>{(error as any).message}</p> : null}
      </div>
    )
  }

  return (
    <Fragment>
      <div className={styles.container}>
        <VGREventsSubsectionSelector />
        <h2 className={styles.summary}>
          {parse(
            t('vesselGroup.summaryEvents', {
              defaultValue:
                '<strong>{{vessels}} vessels</strong> from <strong>{{flags}} flags</strong> had <strong>{{activityQuantity}} {{activityUnit}}</strong> globally between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
              vessels: formatI18nNumber(vessels?.length || 0),
              flags: vesselFlags?.size,
              activityQuantity: data.timeseries.reduce((acc, group) => acc + group.value, 0),
              activityUnit: `${eventsDataview?.datasets?.[0]?.subcategory?.toLowerCase()} ${t(
                'common.events',
                'events'
              ).toLowerCase()}`,
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
          interval={interval}
          timeseries={data.timeseries || []}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.flex}>
          <label>{t('common.vessels', 'Vessels')}</label>
          <VGREventsVesselPropertySelector />
        </div>
        <VesselGroupReportVesselsGraph
          data={vesselGroups as VesselGroupEventsStatsResponseGroups}
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
        <VGREventsVesselsTable />
      </div>
    </Fragment>
  )
}

export default VGREvents
