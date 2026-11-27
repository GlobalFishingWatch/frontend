import { DateTime } from 'luxon'
import { selectVesselGroupInsightApiSlice, vesselInsightApi } from 'queries/map/vessel-insight-api'

import type {
  InsightResponse,
  InsightType,
  RegionType,
  VesselRegistryInfo,
} from '@globalfishingwatch/api-types'
import { EventTypes, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type {
  AssistantContextToolOutput,
  AssistantContextToolResult,
  AssistantVesselIdentity,
  AssistantVesselInsight,
} from '@globalfishingwatch/skills/context-tools'

import { getSingleEventSummary } from 'features/_map/assistant/map-assistant-context'
import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import {
  selectActivitySummary,
  selectEventsGroupedByArea,
  selectEventsGroupedByEncounteredVessel,
  selectEventsGroupedByType,
  selectVoyagesNumber,
} from 'features/_vessels/vessel/activity/vessels-activity.selectors'
import {
  INSIGHTS_FISHING,
  INSIGHTS_NON_FISHING,
  MIN_INSIGHTS_YEAR,
} from 'features/_vessels/vessel/insights/insights.config'
import { selectVesselEventsFilteredByTimerange } from 'features/_vessels/vessel/selectors/vessel.resources.selectors'
import {
  selectVesselInfoData,
  selectVesselInfoStatus,
} from 'features/_vessels/vessel/selectors/vessel.selectors'
import {
  selectVesselAreaSubsection,
  selectVesselIdentityId,
  selectVesselIdentitySource,
  selectVesselSection,
  selectVesselSelfReportedId,
} from 'features/_vessels/vessel/vessel.config.selectors'
import type { VesselDataIdentity } from 'features/_vessels/vessel/vessel.slice'
import {
  getCurrentIdentityVessel,
  getVesselIdentities,
  getVesselProperty,
} from 'features/_vessels/vessel/vessel.utils'
import type {
  AssistantContextDeps,
  AssistantContextModule,
} from 'features/assistant/assistant-context'
import {
  selectEEZs,
  selectFAOs,
  selectMPAs,
  selectRFMOs,
} from 'features/data/regions/regions.slice'
import type { RootState } from 'store'

/**
 * Vessel profile (/vessel/$vesselId and the workspace one): what each tab shows, read from the
 * store. The map tools of the map layout are added next to these (assistant-context.ts).
 */

// ponytail: top N per list keeps each output small; add arguments if the agent needs the tail.
const MAX_ITEMS = 20

type State = RootState

const pickIdentity = (identity: VesselDataIdentity): AssistantVesselIdentity => {
  const i = identity as VesselDataIdentity & Record<string, unknown>
  return {
    id: i.id,
    source: i.identitySource,
    shipname: i.shipname,
    flag: i.flag,
    ssvid: i.ssvid,
    imo: i.imo,
    callsign: i.callsign,
    shiptypes: i.shiptypes,
    geartypes: i.geartypes,
    sourceCode: i.sourceCode,
    // registry only: not on the self-reported member of the union
    lengthM: i.lengthM as VesselRegistryInfo['lengthM'] | undefined,
    tonnageGt: i.tonnageGt as VesselRegistryInfo['tonnageGt'] | undefined,
    from: i.transmissionDateFrom,
    to: i.transmissionDateTo,
  }
}

function getVesselIdentity({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_vessel_identity'> {
  const state = reduxStore.getState() as State
  const vessel = selectVesselInfoData(state)
  const status = selectVesselInfoStatus(state)
  if (!vessel) return { status }
  const identitySource = selectVesselIdentitySource(state)
  const current = getCurrentIdentityVessel(vessel, {
    identityId: selectVesselIdentityId(state),
    identitySource,
  })
  return {
    status,
    /** the identity the profile header shows */
    shown: { ...pickIdentity(current as unknown as VesselDataIdentity), source: identitySource },
    identities: getVesselIdentities(vessel).map(pickIdentity),
    authorizations: current.registryPublicAuthorizations?.map(
      ({ sourceCode, dateFrom, dateTo, ssvid }) => ({ sourceCode, dateFrom, dateTo, ssvid })
    ),
    owners: current.registryOwners?.map(({ name, flag, dateFrom, dateTo }) => ({
      name,
      flag,
      dateFrom,
      dateTo,
    })),
  }
}

/** Region ids as the names the profile shows */
function getRegionLabels(state: State) {
  const byType: Partial<Record<RegionType | string, { id: string | number; label: string }[]>> = {
    eez: selectEEZs(state),
    mpa: selectMPAs(state),
    rfmo: selectRFMOs(state),
    fao: selectFAOs(state),
  }
  return (type: string, id: string) =>
    byType[type]?.find((region) => String(region.id) === id)?.label ?? id
}

function getVesselActivity({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_vessel_activity'> {
  const state = reduxStore.getState() as State
  const label = getRegionLabels(state)
  const { activityRegions, mostVisitedPortCountries, fishingHours } = selectActivitySummary(state)
  return {
    timeRange: selectTimeRange(state),
    section: selectVesselSection(state),
    eventsByType: Object.fromEntries(
      Object.entries(selectEventsGroupedByType(state)).map(([type, events]) => [
        type,
        events.length,
      ])
    ),
    voyages: selectVoyagesNumber(state),
    fishingHours: Math.round(fishingHours),
    regions: Object.fromEntries(
      Object.entries(activityRegions).map(([type, regions]) => [
        type,
        regions
          .toSorted((a, b) => b.count - a.count)
          .slice(0, MAX_ITEMS)
          .map(({ id, count }) => ({ id, name: label(type, id), events: count })),
      ])
    ),
    mostVisitedPortCountries: mostVisitedPortCountries.slice(0, MAX_ITEMS),
    ...getLatestEvents(state),
  }
}

const MAX_LATEST_EVENTS = 10

/** Encounters, loitering, port visits and gaps of the time range, most recent first */
function getLatestEvents(state: State) {
  const newestFirst = selectVesselEventsFilteredByTimerange(state).toReversed()
  return {
    latestEvents: newestFirst
      .filter((event) => event.type !== EventTypes.Fishing)
      .slice(0, MAX_LATEST_EVENTS)
      .map(getSingleEventSummary),
    lastEvent: newestFirst[0] && getSingleEventSummary(newestFirst[0]),
  }
}

function getVesselAreas({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_vessel_areas'> {
  const state = reduxStore.getState() as State
  const areaType = selectVesselAreaSubsection(state)
  const label = getRegionLabels(state)
  return {
    areaType,
    areas: selectEventsGroupedByArea(state)
      .slice(0, MAX_ITEMS)
      .map((area) => ({ ...area, name: label(areaType, area.region) })),
  }
}

function getVesselRelated({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_vessel_related'> {
  const encountered = selectEventsGroupedByEncounteredVessel(reduxStore.getState() as State)
  return {
    totalEncounteredVessels: encountered.length,
    encountered: encountered
      .slice(0, MAX_ITEMS)
      .map(({ id, shipname, flag, ssvid, type, encounters }) => ({
        id,
        shipname,
        flag,
        ssvid,
        type,
        encounters,
      })),
  }
}

/** Counters only: the event id lists can be thousands long */
function summarizeInsight(
  insight: InsightType,
  data: InsightResponse
): AssistantVesselInsight | undefined {
  switch (insight) {
    case 'COVERAGE':
      return data.coverage && { percentage: data.coverage.percentage }
    case 'GAP':
      return data.gap?.periodSelectedCounters
    case 'FISHING':
      return data.apparentFishing?.periodSelectedCounters
    case 'VESSEL-IDENTITY-IUU-VESSEL-LIST':
      return data.vesselIdentity?.iuuVesselList
    case 'VESSEL-IDENTITY-FLAG-CHANGES':
      return data.vesselIdentity?.flagsChanges
    case 'VESSEL-IDENTITY-MOU-LIST':
      return data.vesselIdentity?.mouList
  }
}

/**
 * The insights the tab loaded, from the RTK Query cache with the same args InsightWrapper uses.
 * Not loaded yet (tab never opened, or another time range) → `loading`: this never fetches.
 */
function getVesselInsights({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolResult<'get_vessel_insights'> {
  const state = reduxStore.getState() as State
  const vessel = selectVesselInfoData(state)
  const { start, end } = selectTimeRange(state)
  if (!vessel) return { available: false }
  if (DateTime.fromISO(start).year < MIN_INSIGHTS_YEAR) {
    return { available: false, reason: `Insights start in ${MIN_INSIGHTS_YEAR}` }
  }
  const shiptypes = getVesselProperty(vessel, 'shiptypes', {
    identityId: selectVesselSelfReportedId(state),
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })
  const insights = shiptypes?.includes('FISHING') ? INSIGHTS_FISHING : INSIGHTS_NON_FISHING
  const vessels = getVesselIdentities(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  }).map((identity) => ({ vesselId: identity.id, datasetId: vessel.dataset.id }))
  // the injected slice selector also covers the api not being injected yet
  const insightApi = selectVesselGroupInsightApiSlice(state)
  return {
    timeRange: { start, end },
    insights: Object.fromEntries(
      insights
        .filter((insight) => insight !== 'LONGLINE')
        .map((insight) => {
          const type = insight as InsightType
          const query = vesselInsightApi.endpoints.getVesselInsight.select({
            vessels,
            insight: type,
            start,
            end,
          })({ vesselInsightApi: insightApi })
          if (!query?.data) {
            return [insight, { status: query?.isError ? 'error' : 'loading' }]
          }
          return [insight, summarizeInsight(type, query.data) ?? null]
        })
    ),
  }
}

export const tools: AssistantContextModule['tools'] = {
  get_vessel_identity: getVesselIdentity,
  get_vessel_activity: getVesselActivity,
  get_vessel_areas: getVesselAreas,
  get_vessel_related: getVesselRelated,
  get_vessel_insights: getVesselInsights,
}
