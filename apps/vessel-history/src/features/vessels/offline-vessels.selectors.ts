import { createSelector } from '@reduxjs/toolkit'
import { selectVesselProfileId } from 'routes/routes.selectors'
import { OfflineVessel } from 'types/vessel'
import { selectAll } from './offline-vessels.slice'

export const selectCurrentOfflineVessel = createSelector(
  [selectAll, selectVesselProfileId],
  (vessels, profileId) => {
    const currentVessel = vessels.find((vessel) => vessel.profileId === profileId)
    return currentVessel as OfflineVessel
  }
)
