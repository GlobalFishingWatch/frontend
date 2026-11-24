import type { AssistantContextToolOutput } from '@globalfishingwatch/skills/context-tools'

import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import { reportTools } from 'features/_reports/assistant/report-assistant-tools'
import { selectPortReportFootprintArea } from 'features/_reports/report-port/ports-report.selectors'
import {
  selectPortReportCountry,
  selectPortReportDatasetId,
  selectPortReportName,
} from 'features/_reports/reports.config.selectors'
import type {
  AssistantContextDeps,
  AssistantContextModule,
} from 'features/assistant/assistant-context'
import { selectReportPortId } from 'router/routes.selectors'
import type { RootState } from 'store'

/**
 * Port report (/ports/$portId and the workspace one): the port, plus the shared events tools for
 * its visits. The map tools of the map layout are added next to these.
 */
function getPortReport({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_port_report'> {
  const state = reduxStore.getState() as RootState
  const footprint = selectPortReportFootprintArea(state)?.data
  return {
    id: selectReportPortId(state),
    name: selectPortReportName(state),
    country: selectPortReportCountry(state),
    datasetId: selectPortReportDatasetId(state),
    timeRange: selectTimeRange(state),
    footprint: footprint ? { name: footprint.name, bounds: footprint.bounds } : undefined,
  }
}

export const tools: AssistantContextModule['tools'] = {
  get_port_report: getPortReport,
  get_report_events: reportTools.get_report_events,
}
