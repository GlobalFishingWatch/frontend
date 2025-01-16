import { createSelector } from '@reduxjs/toolkit'

import { selectMergedVesselId, selectVesselProfileId } from 'routes/routes.selectors'
import { RootState } from 'store'
import type { OfflineVessel } from 'types/vessel'

import { selectAllOfflineVessels } from './offline-vessels.slice'

export const selectCurrentOfflineVessel = createSelector(
  [selectAllOfflineVessels, selectMergedVesselId],
  (vessels, profileId) => {
    const currentVessel = vessels.find((vessel) => vessel.profileId === profileId)
    return currentVessel as OfflineVessel
  }
)
