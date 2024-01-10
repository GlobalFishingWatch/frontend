import { createSelector } from '@reduxjs/toolkit'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import {
  VesselAreaSubsection,
  VesselProfileActivityMode,
  VesselProfileState,
  VesselProfileStateProperty,
  VesselRelatedSubsection,
  VesselSection,
} from 'types'
import { selectQueryParam } from 'routes/routes.selectors'
import { DEFAULT_VESSEL_STATE } from 'features/vessel/vessel.config'

type VesselProfileProperty<P extends VesselProfileStateProperty> = Required<VesselProfileState>[P]
export function selectVesselProfileStateProperty<P extends VesselProfileStateProperty>(
  property: P
) {
  return createSelector([selectQueryParam(property)], (urlProperty): VesselProfileProperty<P> => {
    if (urlProperty !== undefined) return urlProperty
    return DEFAULT_VESSEL_STATE[property] as VesselProfileProperty<P>
  })
}

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

export const selectVesselIdentitySource = createSelector(
  [selectVesselProfileStateProperty('vesselIdentitySource')],
  (vesselIdentitySource): VesselIdentitySourceEnum => {
    return vesselIdentitySource
  }
)

export const selectVesselIdentityId = createSelector(
  [
    selectVesselIdentitySource,
    selectVesselProfileStateProperty('vesselRegistryId'),
    selectVesselProfileStateProperty('vesselSelfReportedId'),
  ],
  (identitySource, registryId, selfReportedId): string => {
    return identitySource === VesselIdentitySourceEnum.SelfReported ? selfReportedId : registryId
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
