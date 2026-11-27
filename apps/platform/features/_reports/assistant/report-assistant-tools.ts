import type {
  AssistantContextToolOutput,
  AssistantContextToolResult,
  AssistantReportStats,
} from '@globalfishingwatch/skills/context-tools'

import { selectActiveReportDataviews } from 'features/_map/dataviews/selectors/dataviews.selectors'
import { selectLatestAvailableDataDate } from 'features/_map/workspace/selectors/app.data-date.selectors'
import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import {
  selectReportActivityGraph,
  selectReportTimeComparison,
} from 'features/_reports/reports.config.selectors'
import { selectReportUnit } from 'features/_reports/reports.selectors'
import type { ReportGraphProps, ReportGraphStats } from 'features/_reports/reports-timeseries.hooks'
import { reportStateAtom } from 'features/_reports/reports-timeseries.hooks'
import {
  bucketAvg,
  filterTimeseriesByTimerange,
  getTimeComparisonTotals,
} from 'features/_reports/reports-timeseries.utils'
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
 * Context tools shared by the area, port and vessel group reports: the activity graph, the
 * vessels table and the events tabs. Not registered on a route: each report module adds them to
 * its own `tools`.
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

const round = (n: number) => Number(n.toPrecision(4))

/** Past this many points the series goes by month, to keep the output small */
const MAX_SERIES_POINTS = 62

function getActivityLayers(timeseries: ReportGraphProps[]) {
  return timeseries.flatMap((layer) =>
    layer.sublayers.map((sublayer, i) => {
      // same value the graphs plot: the middle of the estimate bounds
      const points = layer.timeseries
        .map((point) => ({
          date: point.date,
          value: bucketAvg(point.min[i], point.max[i]),
          min: point.min[i],
          max: point.max[i],
        }))
        .filter((point) => Number.isFinite(point.value))
      const total = points.reduce((acc, point) => acc + point.value, 0)
      const byMax = points.toSorted((a, b) => b.max - a.max)
      const byMin = points.toSorted((a, b) => a.min - b.min)
      const months = Object.entries(
        points.reduce<Record<string, number[]>>((acc, { date, value }) => {
          ;(acc[date.slice(0, 7)] ??= []).push(value)
          return acc
        }, {})
      )
      return {
        id: sublayer.id,
        unit: sublayer.legend.unit,
        interval: layer.interval,
        points: points.length,
        total: round(total),
        mean: points.length ? round(total / points.length) : undefined,
        max: byMax[0] && { date: byMax[0].date, value: round(byMax[0].max) },
        min: byMin[0] && { date: byMin[0].date, value: round(byMin[0].min) },
        ...(points.length <= MAX_SERIES_POINTS
          ? {
              series: points.map(
                ({ date, value }) => [date.slice(0, 10), round(value)] as [string, number]
              ),
            }
          : {
              monthly: months.map(([month, values]) => {
                const sum = values.reduce((acc, v) => acc + v, 0)
                return { month, total: round(sum), mean: round(sum / values.length) }
              }),
            }),
      }
    })
  )
}

/** Whole area stats without the per cell value lists */
function getReportStats(stats: ReportGraphStats = {}): AssistantReportStats {
  return Object.fromEntries(
    Object.entries(stats).map(([id, stat]) => {
      if (stat.type === 'points') {
        return [id, { type: stat.type, total: stat.total, count: stat.count }]
      }
      if (stat.type === 'polygons') {
        return [
          id,
          {
            type: stat.type,
            contained: stat.contained,
            overlapping: stat.overlapping,
            areaCoverageRatio: stat.areaCoverageRatio,
            areaCoverageKm2: stat.areaCoverageKm2,
            topAreas: stat.topAreas
              ?.slice(0, MAX_ITEMS)
              .map(({ id, label, km2, ratio }) => ({ id, label, km2, ratio })),
          },
        ]
      }
      return [id, stat]
    })
  )
}

/** The activity tab: graph and stats the report computed for the current time range */
function getReportActivity({
  reduxStore,
  jotaiStore,
}: AssistantContextDeps): AssistantContextToolResult<'get_report_activity'> {
  const state = reduxStore.getState() as RootState
  const { isLoading, timeseries, stats } = jotaiStore.get(reportStateAtom)
  if (!timeseries?.length) {
    return isLoading ? { isLoading } : { available: false }
  }
  const { start, end } = selectTimeRange(state)
  const graph = selectReportActivityGraph(state)
  const timeComparison = selectReportTimeComparison(state)
  const isComparison =
    (graph === 'periodComparison' || graph === 'beforeAfter') && !!timeComparison?.compareStart
  if (isComparison) {
    // both periods live in the timeseries: never cut it to the timebar range
    const latestDataDate = selectLatestAvailableDataDate(state)
    return {
      isLoading,
      unit: selectReportUnit(state),
      timeRange: { start, end },
      graph,
      layers: [],
      comparison: timeseries.flatMap((layer) => {
        const totals = getTimeComparisonTotals(
          layer.timeseries,
          graph,
          timeComparison.compareStart,
          latestDataDate
        )
        if (!totals) return []
        const change = totals.comparison - totals.baseline
        return {
          id: layer.sublayers[0]?.id ?? layer.id ?? '',
          unit: layer.sublayers[0]?.legend.unit,
          baseline: round(totals.baseline),
          comparison: round(totals.comparison),
          change: round(change),
          changePercentage: totals.baseline ? round((change / totals.baseline) * 100) : undefined,
        }
      }),
      stats: getReportStats(stats),
    }
  }
  return {
    isLoading,
    unit: selectReportUnit(state),
    timeRange: { start, end },
    graph,
    layers: getActivityLayers(filterTimeseriesByTimerange(timeseries, start, end)),
    stats: getReportStats(stats),
  }
}

export const reportTools: AssistantContextModule['tools'] = {
  get_report_activity: getReportActivity,
  get_report_vessels: getReportVessels,
  get_report_events: getReportEvents,
}
