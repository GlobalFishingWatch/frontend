import type { ApiEvent, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

export enum ActivityEventSubType {
  Entry = 'port_entry',
  Exit = 'port_exit',
}
export interface ActivityEvent extends ApiEvent {
  voyage: number
  subType?: ActivityEventSubType
}

export type VesselEvent = (ActivityEvent | ApiEvent) & { vesselDatasetId?: string }

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
  includeRelatedIdentities?: boolean
}

export type VesselProfileStateProperty = keyof VesselProfileState
