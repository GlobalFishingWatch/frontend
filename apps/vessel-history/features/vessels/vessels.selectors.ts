import { createSelector } from '@reduxjs/toolkit'
import { getVesselDataviewInstanceId } from 'features/dataviews/dataviews.utils'
import { selectMergedVesselId, selectUrlAkaVesselQuery, selectVesselId } from 'routes/routes.selectors'
import { selectVesselDataview, selectVesselVoyages } from './vessels.slice'

export const selectVesselDataviewMatchesCurrentVessel = createSelector(
  [selectVesselDataview, selectVesselId, selectUrlAkaVesselQuery],
  (dataview, vesselId, akaVesselProfileIds) => {

    const gfwIds: string[] = (akaVesselProfileIds?.map(akaId => akaId.split('_')[1]) || [])
      .concat(vesselId)
      .filter(gfwId => gfwId && gfwId.toLocaleLowerCase() !== 'na')

    return gfwIds.some(gfwId => dataview?.id === getVesselDataviewInstanceId(gfwId))

  }
)

export const selectCurrentVesselVoyagesState = createSelector(
  [selectVesselVoyages, selectMergedVesselId],
  (voyages, mergedVesselId) => {
    return voyages[mergedVesselId]
  }
)
