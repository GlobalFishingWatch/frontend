import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from 'store'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import { selectVesselSlice } from 'features/vessel/vessel.slice'
import { selectVesselId } from 'routes/routes.selectors'

export const selectVessel = createSelector(
  [selectVesselSlice, selectVesselId],
  (vessel, vesselId) => {
    return vessel.data?.[vesselId]
  }
)
export const selectVesselInfoData = createSelector(
  [selectVessel],
  (vessel) => vessel?.info as IdentityVesselData
)
export const selectVesselInfoDataId = createSelector([selectVessel], (vessel) => vessel?.info?.id)
export const selectVesselEventsData = createSelector([selectVessel], (vessel) => vessel?.events)
export const selectSelfReportedVesselIds = createSelector([selectVessel], (vessel) =>
  vessel?.info?.identities
    ?.filter((i: any) => i.identitySource === VesselIdentitySourceEnum.SelfReported)
    .map((i: any) => i.id)
)
export const selectVesselInfoStatus = createSelector([selectVessel], (vessel) => vessel?.status)
export const selectVesselInfoError = createSelector([selectVessel], (vessel) => vessel?.error)
export const selectVesselPrintMode = (state: RootState) => state.vessel.printMode as boolean
export const selectVesselFitBoundsOnLoad = (state: RootState) =>
  state.vessel.fitBoundsOnLoad as boolean
