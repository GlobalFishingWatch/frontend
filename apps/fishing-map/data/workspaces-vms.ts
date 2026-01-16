import type { UserGroupId } from '@globalfishingwatch/api-types'

export const VESSEL_DATAVIEW_SLUG_VMS_BRAZIL = 'private-bra-fishing-map-vessel-track-v-4' as const
export const VESSEL_DATAVIEW_SLUG_VMS_CHILE = 'private-chl-fishing-map-vessel-track-v-4' as const
export const VESSEL_DATAVIEW_SLUG_VMS_PANAMA =
  'private-panama-fishing-map-vessel-track-v-4' as const
export const VESSEL_DATAVIEW_SLUG_VMS_PERU = 'private-per-fishing-map-vessel-track-v-4' as const
export const VESSEL_DATAVIEW_SLUG_VMS_COSTARICA =
  'private-costa-rica-fishing-map-vessel-track-v-4' as const
export const VESSEL_DATAVIEW_SLUG_VMS_BELIZE =
  'private-belize-fishing-map-vessel-track-v-4' as const
export const VESSEL_DATAVIEW_SLUG_VMS_NORWAY =
  'private-norway-fishing-map-vessel-track-v-4' as const
export const VESSEL_DATAVIEW_SLUG_VMS_PALAU = 'private-palau-fishing-map-vessel-track-v-4' as const
export const VESSEL_DATAVIEW_SLUG_VMS_PAPUA_NEW_GUINEA =
  'private-png-fishing-map-vessel-track-v-4' as const
export const VESSEL_DATAVIEW_SLUG_VMS_ECUADOR =
  'private-ecuador-fishing-map-vessel-track-v-4' as const

export const VMS_VESSEL_DATAVIEW_SLUGS: Partial<Record<UserGroupId, string>> = {
  brazil: VESSEL_DATAVIEW_SLUG_VMS_BRAZIL,
  chile: VESSEL_DATAVIEW_SLUG_VMS_CHILE,
  panama: VESSEL_DATAVIEW_SLUG_VMS_PANAMA,
  peru: VESSEL_DATAVIEW_SLUG_VMS_PERU,
  costarica: VESSEL_DATAVIEW_SLUG_VMS_COSTARICA,
  belize: VESSEL_DATAVIEW_SLUG_VMS_BELIZE,
  ecuador: VESSEL_DATAVIEW_SLUG_VMS_ECUADOR,
  norway: VESSEL_DATAVIEW_SLUG_VMS_NORWAY,
  palau: VESSEL_DATAVIEW_SLUG_VMS_PALAU,
  'papua new guinea': VESSEL_DATAVIEW_SLUG_VMS_PAPUA_NEW_GUINEA,
}
