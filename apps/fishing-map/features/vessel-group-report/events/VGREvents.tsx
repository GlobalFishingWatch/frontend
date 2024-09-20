import { useSelector } from 'react-redux'
import { Fragment, useEffect, useMemo } from 'react'
import parse from 'html-react-parser'
import { DateTime } from 'luxon'
import {
  useGetVesselGroupEventsStatsQuery,
  VesselGroupEventsStatsResponseGroups,
} from 'queries/vessel-group-events-stats-api'
import { useTranslation } from 'react-i18next'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import VGREventsSubsectionSelector from 'features/vessel-group-report/events/VGREventsSubsectionSelector'
import VGREventsGraph from 'features/vessel-group-report/events/VGREventsGraph'
import {
  selectVGREventsSubsection,
  selectVGREventsVesselFilter,
  selectVGREventsVesselsProperty,
} from 'features/vessel-group-report/vessel-group.config.selectors'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import VesselGroupReportVesselsGraph from 'features/vessel-group-report/vessels/VesselGroupReportVesselsGraph'
import { formatI18nDate } from 'features/i18n/i18nDate'
import VGREventsVesselPropertySelector from 'features/vessel-group-report/events/VGREventsVesselPropertySelector'
import VGREventsVesselsTable from 'features/vessel-group-report/events/VGREventsVesselsTable'
import ReportVesselsFilter from 'features/area-report/vessels/ReportVesselsFilter'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import styles from './VGREvents.module.css'

function VGREvents() {
  const { t } = useTranslation()
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const filter = useSelector(selectVGREventsVesselFilter)
  const eventsSubsection = useSelector(selectVGREventsSubsection)
  const eventsDataviews = useSelector(selectEventsDataviews)
  const eventsDataview = eventsDataviews.find(({ id }) => id.includes(eventsSubsection))
  const vesselsGroupByProperty = useSelector(selectVGREventsVesselsProperty)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  useEffect(() => {
    if (eventsDataview) {
      upsertDataviewInstance({
        id: eventsDataview.id,
        config: {
          ...eventsDataview.config,
          visible: true,
          filters: {
            ...eventsDataview.config?.filters,
            'vessel-groups': [vesselGroupId],
          },
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
      dataview: eventsDataview!,
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

  const color = eventsDataview?.config?.color || COLOR_PRIMARY_BLUE
  const filteredGroups = useMemo(() => {
    if (!data) return null
    if (!filter) return data.groups
    const [filterProperty, filterValue] = filter.split(':')
    if (vesselsGroupByProperty !== filterProperty) return data.groups
    return data.groups.filter(({ name }) => name === filterValue)
  }, [data, filter, vesselsGroupByProperty])

  if (error) return <p className={styles.error}>{(error as any).message}</p>
  if (!data) return null

  return (
    <Fragment>
      <div className={styles.container}>
        <VGREventsSubsectionSelector />
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
          data={filteredGroups as VesselGroupEventsStatsResponseGroups}
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
