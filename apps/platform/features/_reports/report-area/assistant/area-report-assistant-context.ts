import type {
  AssistantContextToolOutput,
  AssistantContextToolResult,
} from '@globalfishingwatch/skills/context-tools'

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
import { reportStateAtom } from 'features/_reports/reports-timeseries.hooks'
import { filterTimeseriesByTimerange } from 'features/_reports/reports-timeseries.utils'
import type {
  AssistantContextDeps,
  AssistantContextModule,
} from 'features/assistant/assistant-context'
import type { RootState } from 'store'

/**
 * Area report (/report/$reportId and the workspace one): the area, the activity graph and the
 * vessels and events tabs. The map tools of the map layout are added next to these.
 */

const round = (n: number) => Number(n.toPrecision(4))

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

// ponytail: the graph line max only. Range layers (environment) draw a min/max band; add `min`
// per point if the agent needs the band.
function getReportActivity({
  reduxStore,
  jotaiStore,
}: AssistantContextDeps): AssistantContextToolResult<'get_report_activity'> {
  const state = reduxStore.getState() as RootState
  const { isLoading, timeseries } = jotaiStore.get(reportStateAtom)
  if (!timeseries?.length) {
    return isLoading ? { isLoading } : { available: false }
  }
  const { start, end } = selectTimeRange(state)
  return {
    isLoading,
    unit: selectReportUnit(state),
    timeRange: { start, end },
    layers: filterTimeseriesByTimerange(timeseries, start, end).flatMap((layer) =>
      layer.sublayers.map((sublayer, i) => {
        const points = layer.timeseries
          .map((point) => ({ date: point.date, value: point.max[i] }))
          .filter((point) => Number.isFinite(point.value))
        const total = points.reduce((acc, point) => acc + point.value, 0)
        const byValue = points.toSorted((a, b) => b.value - a.value)
        return {
          id: sublayer.id,
          unit: sublayer.legend.unit,
          interval: layer.interval,
          points: points.length,
          total: round(total),
          mean: points.length ? round(total / points.length) : undefined,
          max: byValue[0] && { date: byValue[0].date, value: round(byValue[0].value) },
          min: byValue.at(-1) && {
            date: byValue.at(-1)!.date,
            value: round(byValue.at(-1)!.value),
          },
        }
      })
    ),
  }
}

export const tools: AssistantContextModule['tools'] = {
  get_report_area: getReportArea,
  get_report_activity: getReportActivity,
  ...reportTools,
}
