import { createSelector } from '@reduxjs/toolkit'
import { VesselProfileActivityMode, VesselProfileStateProperty } from 'types'
import { selectQueryParam } from 'routes/routes.selectors'
import { DEFAULT_VESSEL_STATE } from 'features/vessel/vessel.config'

export const selectVesselProfileStateProperty = (property: VesselProfileStateProperty) =>
  createSelector([selectQueryParam(property)], (urlProperty) => {
    if (urlProperty !== undefined) return urlProperty
    return DEFAULT_VESSEL_STATE[property]
  })

export const selectVesselDatasetId = createSelector(
  [selectVesselProfileStateProperty('vesselDatasetId')],
  (vesselDatasetId): string => {
    return vesselDatasetId
  }
)

export const selectVesselActivityMode = createSelector(
  [selectVesselProfileStateProperty('vesselActivityMode')],
  (vesselActivityMode): VesselProfileActivityMode => {
    return vesselActivityMode
  }
)

export const selectVesselRegistryIndex = createSelector(
  [selectVesselProfileStateProperty('vesselRegistryIndex')],
  (vesselRegistryIndex): number => {
    return vesselRegistryIndex
  }
)

export const selectViewOnlyVessel = createSelector(
  [selectVesselProfileStateProperty('viewOnlyVessel')],
  (viewOnlyVessel): boolean => {
    return viewOnlyVessel
  }
)
