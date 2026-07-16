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

export const VESSEL_SECTIONS = ['activity', 'related_vessels', 'areas', 'insights'] as const
export type VesselSection = (typeof VESSEL_SECTIONS)[number]
export const VESSEL_AREA_SUBSECTIONS = ['fao', 'eez', 'mpa', 'rfmo'] as const
export type VesselAreaSubsection = (typeof VESSEL_AREA_SUBSECTIONS)[number]
export const VESSEL_RELATED_SUBSECTIONS = ['encounters', 'owners'] as const
export type VesselRelatedSubsection = (typeof VESSEL_RELATED_SUBSECTIONS)[number]
export const VESSEL_PROFILE_ACTIVITY_MODES = ['voyage', 'type'] as const
export type VesselProfileActivityMode = (typeof VESSEL_PROFILE_ACTIVITY_MODES)[number]

/** URL query params used in the vessel profile UI (identity, tabs, sections).
 * See default values in DEFAULT_VESSEL_STATE (features/vessel/vessel.config.ts)
 */
export type VesselProfileState = {
  /** Identity DatasetId for the vessel profile info */
  vesselDatasetId: string
  /** Identity identifier when vesselIdentitySource is registryInfo */
  vesselRegistryId?: string
  /** Identity identifier when vesselIdentitySource is selfReportedInfo */
  vesselSelfReportedId?: string
  /** Vessel profile tab
   * - activity: events timeline of vessel activity (grouped by type of event or by voyage)
   * - related_vessels: vessels that are related to the current vessel (by encounters or by owners)
   * - areas: areas where the vessel has had events (FAO, EEZ, MPA, RFMO)
   * - insights: insights about the vessel (see InsightType from @globalfishingwatch/api-types)
   */
  vesselSection: VesselSection
  /** Area subsection open when vesselSection is "areas" */
  vesselArea: VesselAreaSubsection
  /** Subsection open when vesselSection is "related_vessels" */
  vesselRelated: VesselRelatedSubsection
  /** Vessel identity source used to render the vessel info */
  vesselIdentitySource: VesselIdentitySourceEnum
  /** Grouping mode for the activity tab timeline */
  vesselActivityMode: VesselProfileActivityMode
  /** A vessel profile could have other potential related identities, this is used to exclude when only want to show the current one
   * internal only, don't expose to users externally
   * @default true
   */
  includeRelatedIdentities?: boolean
}

export type VesselProfileStateProperty = keyof VesselProfileState
