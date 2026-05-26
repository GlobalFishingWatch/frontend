import { EventTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import {
  PORTS_FOOTPRINT_AIS_DATAVIEW_SLUG,
  PORTS_FOOTPRINT_VMS_DATAVIEW_SLUG,
} from 'data/workspaces'
import { PORT_VISITS_REPORT_DATAVIEW_ID } from 'features/dataviews/dataviews.utils'
import {
  getVesselGroupEventsDataviewInstance,
} from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import type { ReportEventsSubCategory } from 'features/reports/reports.types'

const REPORT_EVENTS_GRAPH_AREA_DATAVIEW_ID = `report-event-graph-area`
const COMPARISON_INJECTED_DATAVIEW_ORIGIN = 'comparison'
const EVENTS_REPORT_SUBCATEGORIES: ReportEventsSubCategory[] = [
  EventTypes.Encounter,
  EventTypes.Loitering,
  EventTypes.Gap,
  EventTypes.Port,
]

export function getIsInjectedDataview(dataview?: UrlDataviewInstance) {
  if (!dataview) {
    return false
  }
  if (dataview.injected) {
    return true
  }
  const isVesselGroupEventsInjectedDataview = EVENTS_REPORT_SUBCATEGORIES.some((category) => {
    return dataview.id === getVesselGroupEventsDataviewInstance('test-is-injected', category)?.id
  })
  const isPortReportDataview =
    dataview.id === PORT_VISITS_REPORT_DATAVIEW_ID ||
    dataview.id === PORTS_FOOTPRINT_AIS_DATAVIEW_SLUG ||
    dataview.id === PORTS_FOOTPRINT_VMS_DATAVIEW_SLUG
  const isAreaReportDataview = dataview.id === REPORT_EVENTS_GRAPH_AREA_DATAVIEW_ID
  const isComparisonDataview = dataview.origin === COMPARISON_INJECTED_DATAVIEW_ORIGIN

  return (
    isVesselGroupEventsInjectedDataview ||
    isPortReportDataview ||
    isAreaReportDataview ||
    isComparisonDataview
  )
}
