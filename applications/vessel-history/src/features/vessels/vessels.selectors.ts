import { createSelector } from '@reduxjs/toolkit'
import { getVesselDataviewInstanceId } from 'features/dataviews/dataviews.utils'
import { selectMergedVesselId, selectVesselId } from 'routes/routes.selectors'
import { selectVesselDataview, selectVesselVoyages } from './vessels.slice'

export const selectVesselDataviewMatchesCurrentVessel = createSelector(
  [selectVesselDataview, selectVesselId],
  (dataview, vesselId) => dataview?.id === getVesselDataviewInstanceId(vesselId)
)

export const selectCurrentVesselVoyagesState = createSelector(
  [selectVesselVoyages, selectMergedVesselId],
  (voyages, mergedVesselId) => {
    return voyages[mergedVesselId]
  }
)
