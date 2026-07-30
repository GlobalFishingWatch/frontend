import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import { PROFILE_DATAVIEW_SLUGS } from 'data/map/workspaces'
import { fetchDataviewsByIdsThunk } from 'features/_map/dataviews/dataviews.slice'
import type { AppRouterContext } from 'router/app-router-context'
import type { VesselHeadData } from 'router/router.meta'
import type { AppDispatch } from 'store'
import type { QueryParams } from 'types'

import { DEFAULT_VESSEL_STATE } from './vessel.config'
import type { IdentityVesselData } from './vessel.slice'
import { fetchVesselInfoThunk } from './vessel.slice'
import { getCurrentIdentityVessel, getSearchIdentityResolved } from './vessel.utils'

type VesselLoaderArgs = {
  context: AppRouterContext
  params: { vesselId?: string }
  location: { pathname: string; search: QueryParams }
}

// Resolve the same identity the page will render, so a shared url's metadata matches what the
// visitor sees. Mirrors selectVesselIdentitySource, which needs router state we don't have yet.
function getUrlIdentity(vessel: IdentityVesselData, search: QueryParams) {
  const sourceParam =
    (search?.vesselIdentitySource as VesselIdentitySourceEnum) ??
    DEFAULT_VESSEL_STATE.vesselIdentitySource
  const hasRegistryIdentity = vessel.identities?.some(
    (identity) => identity.identitySource === VesselIdentitySourceEnum.Registry
  )
  const identitySource =
    sourceParam === VesselIdentitySourceEnum.Registry && !hasRegistryIdentity
      ? VesselIdentitySourceEnum.SelfReported
      : sourceParam
  const identityId = (
    identitySource === VesselIdentitySourceEnum.SelfReported
      ? search?.vesselSelfReportedId
      : search?.vesselRegistryId
  ) as string | undefined
  const identity = getCurrentIdentityVessel(vessel, { identityId, identitySource })
  return identity?.shipname ? identity : getSearchIdentityResolved(vessel)
}

export async function ssrLoadVessel({
  context,
  params,
  location,
}: VesselLoaderArgs): Promise<VesselHeadData> {
  const vesselId = params.vesselId
  const datasetId =
    (location.search?.vesselDatasetId as string) || DEFAULT_VESSEL_STATE.vesselDatasetId
  const head = { vesselId, vesselDatasetId: datasetId }
  if (!import.meta.env.SSR || !vesselId || !datasetId) return head
  const store = context?.store
  if (!store) return head

  const includeRelatedIdentities =
    (location.search?.includeRelatedIdentities as boolean) ??
    DEFAULT_VESSEL_STATE.includeRelatedIdentities

  const dispatch = store.dispatch as AppDispatch
  await dispatch(fetchDataviewsByIdsThunk(PROFILE_DATAVIEW_SLUGS))
  await dispatch(fetchVesselInfoThunk({ vesselId, datasetId, includeRelatedIdentities }))

  // Read the slice by id: the vessel selectors key off the router state, which is only synced
  // into redux once the app component mounts, after this loader runs.
  const vessel = store.getState().vessel.data?.[vesselId]?.info as IdentityVesselData | undefined
  const identity = vessel?.identities?.length
    ? getUrlIdentity(vessel, location.search)
    : undefined
  return {
    ...head,
    shipname: identity?.shipname,
    flag: identity?.flag,
    ssvid: identity?.ssvid,
    imo: identity?.imo,
  }
}
