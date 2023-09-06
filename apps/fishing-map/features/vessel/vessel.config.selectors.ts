import { createSelector } from '@reduxjs/toolkit'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import {
  VesselAreaSubsection,
  VesselProfileActivityMode,
  VesselProfileStateProperty,
  VesselRelatedSubsection,
  VesselSection,
} from 'types'
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

export const selectVesselIdentityId = createSelector(
  [selectVesselProfileStateProperty('vesselIdentityId')],
  (vesselIdentityId): string => {
    return vesselIdentityId
  }
)

export const selectVesselIdentitySource = createSelector(
  [selectVesselProfileStateProperty('vesselIdentitySource')],
  (vesselIdentitySource): VesselIdentitySourceEnum => {
    return vesselIdentitySource
  }
)

export const selectVesselSection = createSelector(
  [selectVesselProfileStateProperty('vesselSection')],
  (vesselSection): VesselSection => {
    return vesselSection
  }
)

export const selectVesselAreaSubsection = createSelector(
  [selectVesselProfileStateProperty('vesselArea')],
  (vesselArea): VesselAreaSubsection => {
    return vesselArea
  }
)

export const selectVesselRelatedSubsection = createSelector(
  [selectVesselProfileStateProperty('vesselRelated')],
  (vesselRelated): VesselRelatedSubsection => {
    return vesselRelated
  }
)

export const selectViewOnlyVessel = createSelector(
  [selectVesselProfileStateProperty('viewOnlyVessel')],
  (viewOnlyVessel): boolean => {
    return viewOnlyVessel
  }
)
