import type { UserGroupId } from '@globalfishingwatch/api-types'

export const GFW_GROUP_ID = 'GFW Staff'
export const JAC_GROUP_ID = 'Joint Analytical Cell (JAC)'
export const GFW_DEV_GROUP_ID = 'development-group'
export const GFW_TEST_GROUP_ID = 'testing-fishing-map'
export const ADMIN_GROUP_ID = 'admin-group'
export const DEFAULT_GROUP_ID = 'Default'
export const PRIVATE_BELIZE_GROUP_ID = 'Belize'
export const PRIVATE_BRAZIL_GROUP_ID = 'Brazil'
export const PRIVATE_CHILE_GROUP_ID = 'Chile'
export const PRIVATE_COSTA_RICA_GROUP_ID = 'Costa Rica'
export const PRIVATE_ECUADOR_GROUP_ID = 'Ecuador'
export const PRIVATE_INDONESIA_GROUP_ID = 'Indonesia'
export const PRIVATE_MEXICO_GROUP_ID = 'Mexico'
export const PRIVATE_MONTENEGRO_GROUP_ID = 'Montenegro'
export const PRIVATE_NORWAY_GROUP_ID = 'Norway'
export const PRIVATE_PALAU_GROUP_ID = 'Palau'
export const PRIVATE_PANAMA_GROUP_ID = 'Panama'
export const PRIVATE_PAPUA_NEW_GUINEA_GROUP_ID = 'Papua New Guinea'
export const PRIVATE_PERU_GROUP_ID = 'Peru'
export const PRIVATE_SUPPORTED_GROUPS = [
  PRIVATE_BELIZE_GROUP_ID,
  PRIVATE_BRAZIL_GROUP_ID,
  PRIVATE_CHILE_GROUP_ID,
  PRIVATE_COSTA_RICA_GROUP_ID,
  PRIVATE_ECUADOR_GROUP_ID,
  PRIVATE_INDONESIA_GROUP_ID,
  PRIVATE_MEXICO_GROUP_ID,
  PRIVATE_MONTENEGRO_GROUP_ID,
  PRIVATE_NORWAY_GROUP_ID,
  PRIVATE_PALAU_GROUP_ID,
  PRIVATE_PANAMA_GROUP_ID,
  PRIVATE_PAPUA_NEW_GUINEA_GROUP_ID,
  PRIVATE_PERU_GROUP_ID,
  'SSF-Aruna',
  'SSF-Ipnlf',
  'SSF-Rare',
]

export const PRIVATE_SEARCH_DATASET_BY_GROUP: Record<UserGroupId, string[]> = {
  'costa rica': ['private-vms-cri-vessel-identity:v4.0'],
  'papua new guinea': ['private-png-vessel-identity:v4.0'],
  belize: ['private-vms-blz-vessel-identity:v4.0'],
  brazil: ['private-vms-bra-vessel-identity:v4.0'],
  chile: ['private-vms-chl-vessel-identity:v4.0'],
  costarica: ['private-vms-cri-vessel-identity:v4.0'],
  ecuador: ['private-vms-ecu-vessel-identity:v4.0'],
  montenegro: ['private-mne-vessel-identity:v4.0'],
  norway: ['private-vms-nor-vessel-identity:v4.0'],
  palau: ['private-vms-plw-vessel-identity:v4.0'],
  panama: ['private-vms-pan-vessel-identity:v4.0'],
  peru: ['private-vms-per-vessel-identity:v4.0'],
  'ssf-aruna': [],
  'ssf-rare': [],
  'ssf-ipnlf': [],
}
