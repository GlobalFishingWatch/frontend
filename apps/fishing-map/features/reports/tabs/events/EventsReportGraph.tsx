import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { EventType } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'

import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { useFetchContextDatasetAreas } from 'features/areas/areas.hooks'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { VESSEL_GROUP_ENCOUNTER_EVENTS_ID } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import { selectReportEventsGraph } from 'features/reports/reports.config.selectors'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import {
  selectEventsGraphDatasetAreaId,
  selectEventsStatsDataGrouped,
  selectEventsStatsValueKeys,
} from 'features/reports/tabs/events/events-report.selectors'
import EventsReportGraphEvolution from 'features/reports/tabs/events/EventsReportGraphEvolution'
import EventsReportGraphGrouped from 'features/reports/tabs/events/EventsReportGraphGrouped'
import { selectReportPortId, selectReportVesselGroupId } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

function EventsReportGraph() {
  const portId = useSelector(selectReportPortId)
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const eventsDataview = useSelector(selectActiveReportDataviews)?.[0]
  const { start, end } = useSelector(selectTimeRange)
  const eventsStatsDataGrouped = useSelector(selectEventsStatsDataGrouped)
  const eventsStatsValueKeys = useSelector(selectEventsStatsValueKeys)
  const reportEventsGraph = useSelector(selectReportEventsGraph)
  const datasetAreasId = useSelector(selectEventsGraphDatasetAreaId)
  const datasetAreas = useFetchContextDatasetAreas(datasetAreasId)

  const eventDataset = eventsDataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  const eventType = eventDataset?.subcategory as EventType

  const includes = useMemo(
    () => [
      'id',
      'start',
      'end',
      'vessel',
      ...(eventType === 'encounter' ? ['encounter.vessel'] : []),
    ],
    [eventType]
  )

  const filters = useMemo(
    () => ({
      portId,
      vesselGroupId,
      ...(eventsDataview && { ...getDataviewFilters(eventsDataview) }),
    }),
    [portId, vesselGroupId, eventsDataview]
  )

  let color = eventsDataview?.config?.color || COLOR_PRIMARY_BLUE

  if (eventsDataview?.id === VESSEL_GROUP_ENCOUNTER_EVENTS_ID) {
    color = 'rgb(247 222 110)' // Needed to make the graph lines more visible
  }

  if (!eventDataset) {
    return null
  }

  if (datasetAreasId && datasetAreas?.status !== AsyncReducerStatus.Finished) {
    return <ReportVesselsPlaceholder animate={false} />
  }

  if (reportEventsGraph === 'evolution') {
    return (
      <EventsReportGraphEvolution
        datasetId={eventDataset?.id}
        filters={filters}
        includes={includes}
        valueKeys={eventsStatsValueKeys}
        color={color}
        start={start}
        end={end}
        data={eventsStatsDataGrouped || []}
        eventType={eventType}
      />
    )
  }

  return (
    <EventsReportGraphGrouped
      datasetId={eventDataset?.id}
      filters={filters}
      includes={includes}
      color={color}
      end={end}
      start={start}
      data={eventsStatsDataGrouped || []}
      valueKeys={eventsStatsValueKeys}
      eventType={eventType}
    />
  )
}

export default EventsReportGraph
