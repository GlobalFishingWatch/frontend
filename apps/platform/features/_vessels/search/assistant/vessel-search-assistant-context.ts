import type { AssistantContextToolOutput } from '@globalfishingwatch/skills/context-tools'

import {
  selectSearchPagination,
  selectSearchResults,
  selectSearchSelectedVesselsIds,
  selectSearchStatus,
} from 'features/_vessels/search/search.slice'
import { getSearchVesselId } from 'features/_vessels/search/search.utils'
import { getSearchIdentityResolved, getVesselProperty } from 'features/_vessels/vessel/vessel.utils'
import type {
  AssistantContextDeps,
  AssistantContextModule,
} from 'features/assistant/assistant-context'

// ponytail: first results only, so the context stays far below gfw-agent's 60k chars cap
const MAX_RESULTS = 50

/**
 * /vessel-search (assistant-context.config): the results the user sees.
 * The query and filters are in the url.
 */
function getVesselSearchResults({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_vessel_search_results'> {
  const state = reduxStore.getState()
  const results = selectSearchResults(state)
  const selectedIds = selectSearchSelectedVesselsIds(state)
  return {
    status: selectSearchStatus(state),
    /** all matches; `results` holds the loaded ones */
    total: selectSearchPagination(state).total,
    results: results.slice(0, MAX_RESULTS).map((vessel) => {
      const { id, shipname, flag, ssvid, imo, callsign, transmissionDateFrom, transmissionDateTo } =
        getSearchIdentityResolved(vessel)
      return {
        id,
        datasetId: vessel.dataset.id,
        shipname,
        flag,
        ssvid,
        imo,
        callsign,
        shiptypes: getVesselProperty(vessel, 'shiptypes'),
        geartypes: getVesselProperty(vessel, 'geartypes'),
        transmissionDateFrom,
        transmissionDateTo,
        selected: selectedIds.includes(getSearchVesselId(vessel)),
      }
    }),
  }
}

export const tools: AssistantContextModule['tools'] = {
  get_vessel_search_results: getVesselSearchResults,
}
