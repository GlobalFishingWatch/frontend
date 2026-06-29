import { PROFILE_DATAVIEW_SLUGS } from 'data/workspaces'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import type { AppRouterContext } from 'router/app-router-context'
import type { AppDispatch } from 'store'
import type { QueryParams } from 'types'

import { DEFAULT_VESSEL_STATE } from './vessel.config'
import { fetchVesselInfoThunk } from './vessel.slice'

type VesselLoaderArgs = {
  context: AppRouterContext
  params: { vesselId?: string }
  location: { search: QueryParams }
}

export async function ssrLoadVessel({ context, params, location }: VesselLoaderArgs) {
  if (!import.meta.env.SSR) return
  const store = context?.store
  if (!store) return

  const vesselId = params.vesselId
  const datasetId =
    (location.search?.vesselDatasetId as string) || DEFAULT_VESSEL_STATE.vesselDatasetId
  const includeRelatedIdentities =
    (location.search?.includeRelatedIdentities as boolean) ??
    DEFAULT_VESSEL_STATE.includeRelatedIdentities
  if (!vesselId || !datasetId) return

  const dispatch = store.dispatch as AppDispatch
  await dispatch(fetchDataviewsByIdsThunk(PROFILE_DATAVIEW_SLUGS))
  await dispatch(fetchVesselInfoThunk({ vesselId, datasetId, includeRelatedIdentities }))
}
