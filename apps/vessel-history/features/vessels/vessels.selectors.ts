import { createSelector } from '@reduxjs/toolkit'

import { getVesselDataviewInstanceId } from 'features/dataviews/dataviews.utils'
import {
  selectMergedVesselId,
  selectUrlAkaVesselQuery,
  selectVesselId,
} from 'routes/routes.selectors'

import { selectVesselDataview, selectVesselVoyages } from './vessels.slice'
import { NOT_AVAILABLE } from './vessels.utils'

export const selectVesselDataviewMatchesCurrentVessel = createSelector(
  [selectVesselDataview, selectVesselId, selectUrlAkaVesselQuery],
  (dataview, vesselId, akaVesselProfileIds) => {
    const gfwIds: string[] = (akaVesselProfileIds?.map((akaId) => akaId.split('_')[1]) || [])
      .concat(vesselId)
      .filter((gfwId) => gfwId && gfwId.toLocaleLowerCase() !== NOT_AVAILABLE.toLocaleLowerCase())

    return gfwIds.some((gfwId) => dataview?.id === getVesselDataviewInstanceId(gfwId))
  }
)

export const selectCurrentVesselVoyagesState = createSelector(
  [selectVesselVoyages, selectMergedVesselId],
  (voyages, mergedVesselId) => {
    return voyages[mergedVesselId]
  }
)
