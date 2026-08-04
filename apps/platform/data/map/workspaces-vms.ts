import type { UserGroupId } from '@globalfishingwatch/api-types'
import { PIPE_DATASET_VERSION } from '@globalfishingwatch/datasets-client'

export const VESSEL_DATAVIEW_SLUG_VMS_BRAZIL =
  `private-bra-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_DATAVIEW_SLUG_VMS_CHILE =
  `private-chl-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_DATAVIEW_SLUG_VMS_PANAMA =
  `private-pan-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_DATAVIEW_SLUG_VMS_PERU =
  `private-per-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_DATAVIEW_SLUG_VMS_COSTARICA =
  `private-cri-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_DATAVIEW_SLUG_VMS_BELIZE =
  `private-blz-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_DATAVIEW_SLUG_VMS_MONTENEGRO =
  `private-mne-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_DATAVIEW_SLUG_VMS_NORWAY =
  `private-nor-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_DATAVIEW_SLUG_VMS_PALAU =
  `private-plw-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_DATAVIEW_SLUG_VMS_PAPUA_NEW_GUINEA =
  `private-png-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_DATAVIEW_SLUG_VMS_ECUADOR =
  `private-ecu-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const

export const VMS_VESSEL_DATAVIEW_SLUGS: Partial<Record<UserGroupId, string>> = {
  'papua new guinea': VESSEL_DATAVIEW_SLUG_VMS_PAPUA_NEW_GUINEA,
  belize: VESSEL_DATAVIEW_SLUG_VMS_BELIZE,
  brazil: VESSEL_DATAVIEW_SLUG_VMS_BRAZIL,
  chile: VESSEL_DATAVIEW_SLUG_VMS_CHILE,
  costarica: VESSEL_DATAVIEW_SLUG_VMS_COSTARICA,
  ecuador: VESSEL_DATAVIEW_SLUG_VMS_ECUADOR,
  montenegro: VESSEL_DATAVIEW_SLUG_VMS_MONTENEGRO,
  norway: VESSEL_DATAVIEW_SLUG_VMS_NORWAY,
  palau: VESSEL_DATAVIEW_SLUG_VMS_PALAU,
  panama: VESSEL_DATAVIEW_SLUG_VMS_PANAMA,
  peru: VESSEL_DATAVIEW_SLUG_VMS_PERU,
}
