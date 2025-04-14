import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import {
  REPORT_EVENTS_GRAPH_GROUP_BY_EEZ,
  REPORT_EVENTS_GRAPH_GROUP_BY_FAO,
  REPORT_EVENTS_GRAPH_GROUP_BY_FLAG,
  REPORT_EVENTS_GRAPH_GROUP_BY_RFMO,
} from 'features/reports/reports.config'
import { selectReportEventsGraph } from 'features/reports/reports.config.selectors'
import { selectEventsGraphDatasetAreas } from 'features/reports/tabs/events/events-report.selectors'
import { formatInfoField } from 'utils/info'

export function useGetEventReportGraphLabel() {
  const reportEventsGraph = useSelector(selectReportEventsGraph)
  const eventsGraphDatasetAreas = useSelector(selectEventsGraphDatasetAreas)
  return useCallback(
    (areaId: string) => {
      switch (reportEventsGraph) {
        case REPORT_EVENTS_GRAPH_GROUP_BY_FLAG:
          return formatInfoField(areaId, 'flag') as string
        case REPORT_EVENTS_GRAPH_GROUP_BY_RFMO:
        case REPORT_EVENTS_GRAPH_GROUP_BY_FAO:
        case REPORT_EVENTS_GRAPH_GROUP_BY_EEZ:
          return eventsGraphDatasetAreas?.find(
            (f) => f.id?.toString().toUpperCase() === areaId?.toUpperCase()
          )?.label
        default:
          return areaId
      }
    },
    [eventsGraphDatasetAreas, reportEventsGraph]
  )
}
