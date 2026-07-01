import { PROFILE_DATAVIEW_SLUGS } from 'data/workspaces'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import type { AppRouterContext } from 'router/app-router-context'
import type { VesselHeadData } from 'router/router.meta'
import type { AppDispatch } from 'store'
import type { QueryParams } from 'types'

import { DEFAULT_VESSEL_STATE } from './vessel.config'
import { fetchVesselInfoThunk } from './vessel.slice'
import { getSearchIdentityResolved } from './vessel.utils'

type VesselLoaderArgs = {
  context: AppRouterContext
  params: { vesselId?: string }
  location: { pathname: string; search: QueryParams }
}

export async function ssrLoadVessel({
  context,
  params,
  location,
}: VesselLoaderArgs): Promise<VesselHeadData> {
  const canonicalPath = location.pathname
  if (!import.meta.env.SSR) return { canonicalPath }
  const store = context?.store
  if (!store) return { canonicalPath }

  const vesselId = params.vesselId
  const datasetId =
    (location.search?.vesselDatasetId as string) || DEFAULT_VESSEL_STATE.vesselDatasetId
  const includeRelatedIdentities =
    (location.search?.includeRelatedIdentities as boolean) ??
    DEFAULT_VESSEL_STATE.includeRelatedIdentities
  if (!vesselId || !datasetId) return { canonicalPath }

  const dispatch = store.dispatch as AppDispatch
  await dispatch(fetchDataviewsByIdsThunk(PROFILE_DATAVIEW_SLUGS))
  await dispatch(fetchVesselInfoThunk({ vesselId, datasetId, includeRelatedIdentities }))

  const vessel = selectVesselInfoData(store.getState())
  const identity = vessel?.identities?.length ? getSearchIdentityResolved(vessel) : undefined
  return {
    canonicalPath,
    shipname: identity?.shipname,
    flag: identity?.flag,
    ssvid: identity?.ssvid,
    imo: identity?.imo,
  }
}
