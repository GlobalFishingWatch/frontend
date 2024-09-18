import { useSelector } from 'react-redux'
import { Fragment, useEffect } from 'react'
import parse from 'html-react-parser'
import { DateTime } from 'luxon'
import { useGetVesselGroupEventsStatsQuery } from 'queries/vessel-group-events-stats-api'
import { useTranslation } from 'react-i18next'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import VesselGroupReportEventsSubsectionSelector from 'features/vessel-group-report/events/VesselGroupReportEventsSubsectionSelector'
import VesselGroupReportEventsGraph from 'features/vessel-group-report/events/VesselGroupReportEventsGraph'
import {
  selectVesselGroupReportEventsSubsection,
  selectVesselGroupReportEventsVesselsProperty,
} from 'features/vessel-group-report/vessel-group.config.selectors'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import VesselGroupReportVesselsGraph from 'features/vessel-group-report/vessels/VesselGroupReportVesselsGraph'
import { ENCOUNTER_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'
import { formatI18nDate } from 'features/i18n/i18nDate'
import VesselGroupReportEventsVesselPropertySelector from 'features/vessel-group-report/events/VesselGroupReportEventsVesselPropertySelector'
import VesselGroupReportEventsVesselsTable from 'features/vessel-group-report/events/VesselGroupReportEventsVesselsTable'
import styles from './VesselGroupReportEvents.module.css'

function VesselGroupReportEvents() {
  const { t } = useTranslation()
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const eventsSubsection = useSelector(selectVesselGroupReportEventsSubsection)
  const eventsDataviews = useSelector(selectEventsDataviews)
  const eventsDataview = eventsDataviews.find(({ id }) => id === eventsSubsection)
  const vesselsGroupByProperty = useSelector(selectVesselGroupReportEventsVesselsProperty)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  useEffect(() => {
    if (eventsDataview) {
      upsertDataviewInstance({
        id: eventsDataview.id,
        config: {
          ...eventsDataview.config,
          visible: true,
          'vessel-groups': [vesselGroupId],
        },
      })
    }
  }, [eventsDataview, upsertDataviewInstance, vesselGroupId])

  const { start, end } = useTimerangeConnect()
  const startMillis = DateTime.fromISO(start).toMillis()
  const endMillis = DateTime.fromISO(end).toMillis()
  const interval = getFourwingsInterval(startMillis, endMillis)

  const { data, error, isLoading } = useGetVesselGroupEventsStatsQuery(
    {
      includes: ['TIME_SERIES', 'EVENTS_GROUPED'],
      datasetId: eventsDataview?.datasets?.[0]?.id as string,
      groupBy: vesselsGroupByProperty.toUpperCase(),
      vesselGroupId,
      interval,
      start,
      end,
    },
    {
      skip: !vesselGroupId || !eventsDataview,
    }
  )

  let color = eventsDataview?.config?.color || 'rgb(22, 63, 137)'
  if (eventsDataview?.id === ENCOUNTER_EVENTS_SOURCE_ID) {
    color = 'rgb(247 222 110)'
  }

  if (error) return <p className={styles.error}>{(error as any).message}</p>
  if (!data) return null

  return (
    <Fragment>
      <div className={styles.container}>
        <VesselGroupReportEventsSubsectionSelector />
        <h2 className={styles.summary}>
          {parse(
            t('vesselGroup.summaryEvents', {
              defaultValue:
                '<strong>{{vessels}} vessels</strong> from <strong>{{flags}} flags</strong> had <strong>{{activityQuantity}} {{activityUnit}}</strong> globally between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
              vessels: data.groups.reduce((acc, group) => acc + group.value, 0),
              flags: data.groups.length,
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
        <VesselGroupReportEventsGraph
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
          <VesselGroupReportEventsVesselPropertySelector />
        </div>
        <VesselGroupReportVesselsGraph
          data={data.groups}
          color={eventsDataview?.config?.color}
          property={vesselsGroupByProperty}
        />
        <VesselGroupReportEventsVesselsTable />
      </div>
    </Fragment>
  )
}

export default VesselGroupReportEvents
