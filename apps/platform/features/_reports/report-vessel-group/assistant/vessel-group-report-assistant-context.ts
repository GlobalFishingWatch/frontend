import { createSelector } from '@reduxjs/toolkit'

import type {
  InsightFishing,
  InsightGaps,
  InsightIdentity,
  InsightIdentityFlagsChanges,
  InsightIdentityIUU,
  InsightIdentityMOU,
} from '@globalfishingwatch/api-types'
import type {
  AssistantContextToolOutput,
  AssistantInsightValue,
  AssistantLoadStatus,
} from '@globalfishingwatch/skills/context-tools'

import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import { reportTools } from 'features/_reports/assistant/report-assistant-tools'
import {
  COVERAGE_INSIGHT_ID,
  FISHING_INSIGHT_ID,
  FLAG_CHANGE_INSIGHT_ID,
  GAP_INSIGHT_ID,
  IUU_INSIGHT_ID,
  MOU_INSIGHT_ID,
  selectFetchVGRParamsByInsight,
  selectVGRInsightById,
} from 'features/_reports/report-vessel-group/vessel-group-report.selectors'
import {
  selectVGRData,
  selectVGRStatus,
} from 'features/_reports/report-vessel-group/vessel-group-report.slice'
import { selectReportCategory, selectReportSubCategory } from 'features/_reports/reports.selectors'
import type { VesselGroupReportInsightVessel } from 'features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors'
import { selectVGRVesselsByInsight } from 'features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors'
import { getVesselsWithoutDuplicates } from 'features/_user/vessel-groups/vessel-groups.utils'
import { getSearchIdentityResolved } from 'features/_vessels/vessel/vessel.utils'
import type {
  AssistantContextDeps,
  AssistantContextModule,
} from 'features/assistant/assistant-context'
import type { RootState } from 'store'

/**
 * Vessel group report: the group, its insights, and the shared vessels and events tools. The
 * map tools of the map layout are added next to these.
 */

// ponytail: top N per list keeps each output small; add arguments if the agent needs the tail.
const MAX_ITEMS = 20

/**
 * One RTK cache entry per insight, read with the params the insights tab fetched with. Built here,
 * not from vessel-group-report.selectors' `selectVGR*InsightData`: its IUU and MOU selectors read
 * the FISHING and FLAG-CHANGES entries.
 */
const insightQuery = (id: Parameters<typeof selectFetchVGRParamsByInsight>[0]) =>
  selectVGRInsightById(selectFetchVGRParamsByInsight(id))

const QUERIES = {
  coverage: insightQuery(COVERAGE_INSIGHT_ID),
  gap: insightQuery(GAP_INSIGHT_ID),
  fishing: insightQuery(FISHING_INSIGHT_ID),
  iuu: insightQuery(IUU_INSIGHT_ID),
  flagChanges: insightQuery(FLAG_CHANGE_INSIGHT_ID),
  mou: insightQuery(MOU_INSIGHT_ID),
}
const data = (query: (typeof QUERIES)[keyof typeof QUERIES]) =>
  createSelector([query], (result) => result?.data)

const VESSELS = {
  gap: selectVGRVesselsByInsight<InsightGaps>(
    data(QUERIES.gap),
    'gap',
    'periodSelectedCounters.eventsGapOff'
  ),
  noTakeMpas: selectVGRVesselsByInsight<InsightFishing>(
    data(QUERIES.fishing),
    'apparentFishing',
    'periodSelectedCounters.eventsInNoTakeMPAs'
  ),
  rfmoWithoutAuthorization: selectVGRVesselsByInsight<InsightFishing>(
    data(QUERIES.fishing),
    'apparentFishing',
    'periodSelectedCounters.eventsInRFMOWithoutKnownAuthorization'
  ),
  iuu: selectVGRVesselsByInsight<InsightIdentity<InsightIdentityIUU>>(
    data(QUERIES.iuu),
    'vesselIdentity',
    'iuuVesselList.totalTimesListedInThePeriod'
  ),
  flagChanges: selectVGRVesselsByInsight<InsightIdentity<InsightIdentityFlagsChanges>>(
    data(QUERIES.flagChanges),
    'vesselIdentity',
    'flagsChanges.totalTimesListedInThePeriod'
  ),
  mou: selectVGRVesselsByInsight<InsightIdentity<InsightIdentityMOU>>(
    data(QUERIES.mou),
    'vesselIdentity'
  ),
}

const pickVessel = ({ vesselId, identity }: VesselGroupReportInsightVessel) => ({
  id: vesselId,
  shipname: identity?.shipname,
  flag: identity?.flag,
  ssvid: identity?.ssvid,
})

function getVesselGroup({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_vessel_group'> {
  const state = reduxStore.getState() as RootState
  const group = selectVGRData(state)
  if (!group) return { status: selectVGRStatus(state) }
  const vessels = getVesselsWithoutDuplicates(group.vessels).map((vessel) =>
    vessel.identity ? getSearchIdentityResolved(vessel.identity) : undefined
  )
  const flags = vessels.reduce<Record<string, number>>((acc, vessel) => {
    if (vessel?.flag) acc[vessel.flag] = (acc[vessel.flag] ?? 0) + 1
    return acc
  }, {})
  return {
    status: selectVGRStatus(state),
    id: group.id,
    name: group.name,
    vessels: vessels.length,
    flags: Object.entries(flags)
      .sort((a, b) => b[1] - a[1])
      .map(([flag, count]) => ({ flag, vessels: count })),
    timeRange: selectTimeRange(state),
    category: selectReportCategory(state),
    subcategory: selectReportSubCategory(state),
  }
}

function getVesselGroupInsights({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_vessel_group_insights'> {
  const state = reduxStore.getState() as RootState
  const status = (key: keyof typeof QUERIES): AssistantLoadStatus | undefined => {
    const query = QUERIES[key](state)
    if (query?.data) return undefined
    return query?.isError ? 'error' : 'loading'
  }
  const list = <V extends VesselGroupReportInsightVessel>(
    vessels: V[],
    value: (vessel: V) => AssistantInsightValue
  ) => ({
    vessels: vessels.length,
    top: vessels
      .slice(0, MAX_ITEMS)
      .map((vessel) => ({ ...pickVessel(vessel), value: value(vessel) })),
  })
  const coverage = QUERIES.coverage(state)?.data?.coverage ?? []
  return {
    timeRange: selectTimeRange(state),
    coverage: status('coverage') ?? {
      vessels: coverage.length,
      meanPercentage: coverage.length
        ? Math.round(coverage.reduce((acc, v) => acc + (v.percentage ?? 0), 0) / coverage.length)
        : undefined,
    },
    aisOff: status('gap') ?? list(VESSELS.gap(state), (v) => v.periodSelectedCounters.eventsGapOff),
    fishingInNoTakeMpas:
      status('fishing') ??
      list(VESSELS.noTakeMpas(state), (v) => v.periodSelectedCounters.eventsInNoTakeMPAs),
    fishingInRfmoWithoutKnownAuthorization:
      status('fishing') ??
      list(
        VESSELS.rfmoWithoutAuthorization(state),
        (v) => v.periodSelectedCounters.eventsInRFMOWithoutKnownAuthorization
      ),
    iuuLists:
      status('iuu') ??
      list(VESSELS.iuu(state), (v) => v.iuuVesselList?.totalTimesListedInThePeriod),
    flagChanges:
      status('flagChanges') ??
      list(VESSELS.flagChanges(state), (v) => v.flagsChanges?.valuesInThePeriod),
    mouLists:
      status('mou') ??
      list(
        VESSELS.mou(state).filter(
          (v) =>
            v.mouList?.tokyo?.totalTimesListedInThePeriod ||
            v.mouList?.paris?.totalTimesListedInThePeriod
        ),
        (v) => ({
          tokyo: v.mouList?.tokyo?.valuesInThePeriod,
          paris: v.mouList?.paris?.valuesInThePeriod,
        })
      ),
  }
}

export const tools: AssistantContextModule['tools'] = {
  get_vessel_group: getVesselGroup,
  get_vessel_group_insights: getVesselGroupInsights,
  ...reportTools,
}
