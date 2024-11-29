import type { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

export type VesselSection = 'activity' | 'related_vessels' | 'areas' | 'insights'
export type VesselAreaSubsection = 'fao' | 'eez' | 'mpa' | 'rfmo'
export type VesselRelatedSubsection = 'encounters' | 'owners'
export type VesselProfileActivityMode = 'voyage' | 'type'
export type VesselProfileState = {
  vesselDatasetId: string
  vesselRegistryId?: string
  vesselSelfReportedId?: string
  vesselSection: VesselSection
  vesselArea: VesselAreaSubsection
  vesselRelated: VesselRelatedSubsection
  vesselIdentitySource: VesselIdentitySourceEnum
  vesselActivityMode: VesselProfileActivityMode
  viewOnlyVessel: boolean
  includeRelatedIdentities?: boolean
}

export type VesselProfileStateProperty = keyof VesselProfileState
