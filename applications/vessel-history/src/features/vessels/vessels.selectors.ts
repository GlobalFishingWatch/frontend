import { createSelector } from '@reduxjs/toolkit'
import { getVesselDataviewInstanceId } from 'features/dataviews/dataviews.utils'
import { selectVesselId } from 'routes/routes.selectors'
import { selectVesselDataview } from './vessels.slice'

export const selectVesselDataviewMatchesCurrentVessel = createSelector(
  [selectVesselDataview, selectVesselId],
  (dataview, vesselId) => dataview?.id === getVesselDataviewInstanceId(vesselId)
)
