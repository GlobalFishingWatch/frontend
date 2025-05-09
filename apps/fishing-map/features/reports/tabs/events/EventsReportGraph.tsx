import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { EventType } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'

import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportEventsGraph } from 'features/reports/reports.config.selectors'
import {
  selectEventsStatsDataGrouped,
  selectEventsStatsValueKeys,
} from 'features/reports/tabs/events/events-report.selectors'
import EventsReportGraphEvolution from 'features/reports/tabs/events/EventsReportGraphEvolution'
import EventsReportGraphGrouped from 'features/reports/tabs/events/EventsReportGraphGrouped'

function EventsReportGraph() {
  const eventsDataviews = useSelector(selectActiveReportDataviews)
  const eventsDataview = useSelector(selectActiveReportDataviews)?.[0]
  const { start, end } = useSelector(selectTimeRange)
  const eventsStatsDataGrouped = useSelector(selectEventsStatsDataGrouped)
  const eventsStatsValueKeys = useSelector(selectEventsStatsValueKeys)
  const reportEventsGraph = useSelector(selectReportEventsGraph)

  const eventDataset = eventsDataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  const eventType = eventDataset?.subcategory as EventType

  const includes = useMemo(
    () => [
      'id',
      'start',
      'end',
      'vessel',
      'regions',
      ...(eventType === 'encounter' ? ['encounter.vessel'] : []),
    ],
    [eventType]
  )

  const color = eventsDataview?.config?.color || COLOR_PRIMARY_BLUE

  if (!eventDataset) {
    return null
  }

  if (reportEventsGraph === 'evolution') {
    return (
      <EventsReportGraphEvolution
        dataviews={eventsDataviews}
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
      dataviews={eventsDataviews}
      includes={includes}
      color={color}
      end={end}
      start={start}
      data={eventsStatsDataGrouped || []}
      valueKeys={eventsStatsValueKeys}
      graphType={reportEventsGraph}
      eventType={eventType}
    />
  )
}

export default EventsReportGraph
