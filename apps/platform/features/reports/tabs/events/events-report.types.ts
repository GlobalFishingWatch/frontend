import type { EventType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ResponsiveVisualizationData } from '@globalfishingwatch/responsive-visualizations'

import type { ReportEventsGraph } from 'features/reports/reports.types'

export type EventsReportGraphProps = {
  dataviews: UrlDataviewInstance[]
  includes?: string[]
  color?: string
  end: string
  start: string
  data: ResponsiveVisualizationData<'aggregated'>
  valueKeys: string[]
  eventType?: EventType
  graphType?: ReportEventsGraph
}
