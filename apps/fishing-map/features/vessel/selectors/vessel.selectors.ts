import { createSelector } from '@reduxjs/toolkit'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { selectVesselId } from 'routes/routes.selectors'
import { RootState } from 'store'
import { IdentityVesselData } from 'features/vessel/vessel.slice'

const selectVessel = (state: RootState) => {
  const vesselId = selectVesselId(state)
  // TODO:deck review why the vessel info is no longer saved in state.vessel.data
  //   return state.vessel.data?.[vesselId]
  return (state.vessel as any)[vesselId]
}
export const selectVesselInfoData = createSelector(
  [selectVessel],
  (vessel) => vessel?.data as IdentityVesselData
)
export const selectVesselInfoDataId = createSelector([selectVessel], (vessel) => vessel?.data?.id)
export const selectSelfReportedVesselIds = createSelector([selectVessel], (vessel) =>
  vessel?.data?.identities
    ?.filter((i: any) => i.identitySource === VesselIdentitySourceEnum.SelfReported)
    .map((i: any) => i.id)
)
export const selectVesselInfoStatus = createSelector([selectVessel], (vessel) => vessel?.status)
export const selectVesselInfoError = createSelector([selectVessel], (vessel) => vessel?.error)
export const selectVesselPrintMode = (state: RootState) => state.vessel.printMode as boolean
export const selectVesselEventsData = (state: RootState) => state.vessel.events
export const selectVesselFitBoundsOnLoad = (state: RootState) =>
  state.vessel.fitBoundsOnLoad as boolean
