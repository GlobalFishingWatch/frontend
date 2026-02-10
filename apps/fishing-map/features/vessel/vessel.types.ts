import type { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

export const VESSEL_SECTIONS = ['activity', 'related_vessels', 'areas', 'insights'] as const
export type VesselSection = (typeof VESSEL_SECTIONS)[number]
export const VESSEL_AREA_SUBSECTIONS = ['fao', 'eez', 'mpa', 'rfmo'] as const
export type VesselAreaSubsection = (typeof VESSEL_AREA_SUBSECTIONS)[number]
export const VESSEL_RELATED_SUBSECTIONS = ['encounters', 'owners'] as const
export type VesselRelatedSubsection = (typeof VESSEL_RELATED_SUBSECTIONS)[number]
export const VESSEL_PROFILE_ACTIVITY_MODES = ['voyage', 'type'] as const
export type VesselProfileActivityMode = (typeof VESSEL_PROFILE_ACTIVITY_MODES)[number]
export type VesselProfileState = {
  vesselDatasetId: string
  vesselRegistryId?: string
  vesselSelfReportedId?: string
  vesselSection: VesselSection
  vesselArea: VesselAreaSubsection
  vesselRelated: VesselRelatedSubsection
  vesselIdentitySource: VesselIdentitySourceEnum
  vesselActivityMode: VesselProfileActivityMode
  includeRelatedIdentities?: boolean
}

export type VesselProfileStateProperty = keyof VesselProfileState
