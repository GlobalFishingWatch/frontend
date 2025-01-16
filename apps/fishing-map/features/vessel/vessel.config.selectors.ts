import { createSelector } from '@reduxjs/toolkit'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import { DEFAULT_VESSEL_STATE } from 'features/vessel/vessel.config'
import { selectLocationQuery } from 'routes/routes.selectors'

import type { VesselProfileState,VesselProfileStateProperty } from './vessel.types'

type VesselProfileProperty<P extends VesselProfileStateProperty> = Required<VesselProfileState>[P]
export function selectVesselProfileStateProperty<P extends VesselProfileStateProperty>(
  property: P
) {
  return createSelector([selectLocationQuery], (locationQuery): VesselProfileProperty<P> => {
    const urlProperty = locationQuery?.[property]
    if (urlProperty !== undefined) return urlProperty
    return DEFAULT_VESSEL_STATE[property] as VesselProfileProperty<P>
  })
}
export const selectVesselDatasetId = selectVesselProfileStateProperty('vesselDatasetId')
export const selectVesselActivityMode = selectVesselProfileStateProperty('vesselActivityMode')
export const selectVesselIdentitySource = selectVesselProfileStateProperty('vesselIdentitySource')
export const selectVesselSection = selectVesselProfileStateProperty('vesselSection')
export const selectVesselAreaSubsection = selectVesselProfileStateProperty('vesselArea')
export const selectVesselRelatedSubsection = selectVesselProfileStateProperty('vesselRelated')
export const selectViewOnlyVessel = selectVesselProfileStateProperty('viewOnlyVessel')
export const selectVesselRegistryId = selectVesselProfileStateProperty('vesselRegistryId')
export const selectVesselSelfReportedId = selectVesselProfileStateProperty('vesselSelfReportedId')

export const selectVesselIdentityId = createSelector(
  [selectVesselIdentitySource, selectVesselRegistryId, selectVesselSelfReportedId],
  (identitySource, registryId, selfReportedId): string => {
    return identitySource === VesselIdentitySourceEnum.SelfReported ? selfReportedId : registryId
  }
)
