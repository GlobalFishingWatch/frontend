import type { AssistantContextToolOutput } from '@globalfishingwatch/skills/context-tools'

import { selectActiveReportDataviews } from 'features/_map/dataviews/selectors/dataviews.selectors'
import { selectReportUnit } from 'features/_reports/reports.selectors'
import {
  selectReportVesselsFiltered,
  selectReportVesselsOrdered,
  selectReportVesselsPagination,
} from 'features/_reports/shared/vessels/report-vessels.selectors'
import { selectReportVesselsStatus } from 'features/_reports/tabs/activity/reports-activity.slice'
import {
  selectEventsStatsData,
  selectEventsStatsStatus,
  selectEventsVessels,
  selectReportEventsPortsData,
} from 'features/_reports/tabs/events/events-report.selectors'
import type {
  AssistantContextDeps,
  AssistantContextModule,
} from 'features/assistant/assistant-context'
import type { RootState } from 'store'

/**
 * Context tools shared by the area, port and vessel group reports: the vessels table and the
 * events tabs. Not registered on a route: each report module adds them to its own `tools`.
 */

const MAX_ITEMS = 20

const EMPTY = new Set(['', '---', 'null', undefined])
const clean = <T>(value: T) => (EMPTY.has(value as string) ? undefined : value)

const countBy = (values: (string | undefined)[]) =>
  Object.entries(
    values.reduce<Record<string, number>>((acc, value) => {
      if (value) acc[value] = (acc[value] ?? 0) + 1
      return acc
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_ITEMS)
    .map(([value, vessels]) => ({ value, vessels }))

/** The vessels table as the user sees it: filtered and ordered, `value` in the report unit */
function getReportVessels({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_report_vessels'> {
  const state = reduxStore.getState() as RootState
  const vessels = selectReportVesselsFiltered(state) ?? []
  const pagination = selectReportVesselsPagination(state)
  return {
    status: selectReportVesselsStatus(state),
    unit: selectReportUnit(state),
    /** vessels in the table, after the user's table filter */
    total: pagination.totalFiltered,
    /** vessels in the report, before that filter */
    totalUnfiltered: pagination.total,
    totalValue: Math.round(vessels.reduce((acc, v) => acc + Math.max(v.value ?? 0, 0), 0)),
    flags: countBy(vessels.map((v) => clean(v.flag))),
    geartypes: countBy(vessels.map((v) => clean(v.geartype))),
    vesselTypes: countBy(vessels.map((v) => clean(v.vesselType))),
    top: selectReportVesselsOrdered(state)
      .slice(0, MAX_ITEMS)
      .map((v) => ({
        id: v.id,
        datasetId: v.datasetId,
        shipname: clean(v.shipName),
        flag: clean(v.flag),
        ssvid: clean(v.ssvid),
        imo: clean(v.imo),
        geartype: clean(v.geartype),
        vesselType: clean(v.vesselType),
        value: v.value,
      })),
    page: pagination.page,
  }
}

const peak = (timeseries: { date: string; value: number }[] = []) =>
  timeseries.reduce<{ date: string; value: number } | undefined>(
    (max, point) => (!max || point.value > max.value ? point : max),
    undefined
  )

/** The events tabs (encounters, loitering, port visits): one entry per events layer */
function getReportEvents({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_report_events'> {
  const state = reduxStore.getState() as RootState
  const stats = selectEventsStatsData(state)
  if (!stats) {
    return { status: selectEventsStatsStatus(state) ?? 'not loaded' }
  }
  const dataviews = selectActiveReportDataviews(state)
  const vessels = selectEventsVessels(state) ?? []
  return {
    status: selectEventsStatsStatus(state),
    layers: stats.map((layer, i) => ({
      dataviewId: dataviews[i]?.id,
      events: layer.numEvents,
      vessels: layer.numVessels,
      flags: layer.numFlags,
      /** the highest point of the events graph */
      peak: peak(layer.timeseries),
      groups: layer.groups?.slice(0, MAX_ITEMS),
    })),
    topVessels: vessels
      .toSorted((a, b) => (b.value as number) - (a.value as number))
      .slice(0, MAX_ITEMS)
      .map((v) => ({
        id: v.vesselId,
        datasetId: v.infoDataset?.id ?? v.dataset,
        shipname: v.shipName,
        flag: v.flag,
        events: v.value,
      })),
    topPorts: selectReportEventsPortsData(state)?.slice(0, MAX_ITEMS),
  }
}

export const reportTools: AssistantContextModule['tools'] = {
  get_report_vessels: getReportVessels,
  get_report_events: getReportEvents,
}
