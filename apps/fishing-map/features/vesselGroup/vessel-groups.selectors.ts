import { RootState } from 'store'

export const selectVesselGroups = (state: RootState) => state.vesselGroups.data
export const selectVesselGroupModalOpen = (state: RootState) => state.vesselGroups.isModalOpen
