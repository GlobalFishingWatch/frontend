import { createSelector } from '@reduxjs/toolkit'
import { selectVesselProfileId } from 'routes/routes.selectors'
import { RootState } from 'store'
import { OfflineVessel } from 'types/vessel'
import { selectAllOfflineVessels } from './offline-vessels.slice'

export const selectCurrentOfflineVessel = createSelector(
  [selectAllOfflineVessels, (state: RootState) => selectVesselProfileId(state)],
  (vessels, profileId) => {
    const currentVessel = vessels.find((vessel) => vessel.profileId === profileId)
    return currentVessel as OfflineVessel
  }
)
