import { createSelector } from '@reduxjs/toolkit'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { DEFAULT_VESSEL_STATE } from 'features/vessel/vessel.config'
import { selectLocationQuery } from 'router/routes.selectors'

import type { VesselProfileState, VesselProfileStateProperty } from './vessel.types'

type VesselProfileProperty<P extends VesselProfileStateProperty> = Required<VesselProfileState>[P]
export function selectVesselProfileStateProperty<P extends VesselProfileStateProperty>(
  property: P
) {
  return createSelector([selectLocationQuery], (locationQuery): VesselProfileProperty<P> => {
    const urlProperty = locationQuery?.[property as keyof typeof locationQuery]
    if (urlProperty !== undefined) return urlProperty as VesselProfileProperty<P>
    return DEFAULT_VESSEL_STATE[property] as VesselProfileProperty<P>
  })
}
export const selectVesselDatasetId = selectVesselProfileStateProperty('vesselDatasetId')
export const selectVesselActivityMode = selectVesselProfileStateProperty('vesselActivityMode')
const selectVesselIdentitySourceParam = selectVesselProfileStateProperty('vesselIdentitySource')

// Registry is the default but many vessels are AIS-only. Falling back here, not in an effect,
// keeps the SSR on the tab that has data.
export const selectVesselIdentitySource = createSelector(
  [selectVesselIdentitySourceParam, selectVesselInfoData],
  (identitySource, vessel) => {
    if (identitySource !== VesselIdentitySourceEnum.Registry) return identitySource
    const hasRegistryIdentity = vessel?.identities?.some(
      (identity) => identity.identitySource === VesselIdentitySourceEnum.Registry
    )
    return hasRegistryIdentity ? identitySource : VesselIdentitySourceEnum.SelfReported
  }
)
export const selectVesselSection = selectVesselProfileStateProperty('vesselSection')
export const selectVesselAreaSubsection = selectVesselProfileStateProperty('vesselArea')
export const selectVesselRelatedSubsection = selectVesselProfileStateProperty('vesselRelated')
export const selectVesselRegistryId = selectVesselProfileStateProperty('vesselRegistryId')
export const selectVesselSelfReportedId = selectVesselProfileStateProperty('vesselSelfReportedId')
export const selectIncludeRelatedIdentities = selectVesselProfileStateProperty(
  'includeRelatedIdentities'
)

export const selectVesselIdentityId = createSelector(
  [selectVesselIdentitySource, selectVesselRegistryId, selectVesselSelfReportedId],
  (identitySource, registryId, selfReportedId): string => {
    return identitySource === VesselIdentitySourceEnum.SelfReported ? selfReportedId : registryId
  }
)
