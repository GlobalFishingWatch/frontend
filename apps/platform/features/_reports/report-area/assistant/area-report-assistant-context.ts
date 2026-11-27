import type { AssistantContextToolOutput } from '@globalfishingwatch/skills/context-tools'

import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import { reportTools } from 'features/_reports/assistant/report-assistant-tools'
import {
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/_reports/report-area/area-reports.buffer.selectors'
import {
  selectIsGlobalReport,
  selectReportAreaName,
  selectReportAreaStatus,
} from 'features/_reports/report-area/area-reports.selectors'
import {
  selectReportActivityGraph,
  selectReportAreaBounds,
  selectReportTimeComparison,
} from 'features/_reports/reports.config.selectors'
import {
  selectCurrentReport,
  selectReportAreaIds,
} from 'features/_reports/reports.current.selectors'
import {
  selectReportCategory,
  selectReportSubCategory,
  selectReportUnit,
} from 'features/_reports/reports.selectors'
import type {
  AssistantContextDeps,
  AssistantContextModule,
} from 'features/assistant/assistant-context'
import type { RootState } from 'store'

/**
 * Area report (/report/$reportId and the workspace one): the area, the activity graph and the
 * vessels and events tabs. The map tools of the map layout are added next to these.
 */

function getReportArea({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_report_area'> {
  const state = reduxStore.getState() as RootState
  const report = selectCurrentReport(state)
  const bufferValue = selectReportBufferValue(state)
  return {
    ...selectReportAreaIds(state),
    name: selectReportAreaName(state),
    status: selectReportAreaStatus(state),
    global: selectIsGlobalReport(state),
    bounds: selectReportAreaBounds(state),
    ...(bufferValue && {
      buffer: {
        value: bufferValue,
        unit: selectReportBufferUnit(state),
        operation: selectReportBufferOperation(state),
      },
    }),
    savedReport: report && { id: report.id, name: report.name },
    category: selectReportCategory(state),
    subcategory: selectReportSubCategory(state),
    unit: selectReportUnit(state),
    timeRange: selectTimeRange(state),
    graph: selectReportActivityGraph(state),
    timeComparison: selectReportTimeComparison(state),
  }
}

export const tools: AssistantContextModule['tools'] = {
  get_report_area: getReportArea,
  ...reportTools,
}
