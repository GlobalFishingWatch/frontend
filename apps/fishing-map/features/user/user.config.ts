import type { UserGroupId } from '@globalfishingwatch/api-types'

export const GFW_GROUP_ID = 'GFW Staff'
export const JAC_GROUP_ID = 'Joint Analytical Cell (JAC)'
export const GFW_DEV_GROUP_ID = 'development-group'
export const GFW_TEST_GROUP_ID = 'testing-fishing-map'
export const ADMIN_GROUP_ID = 'admin-group'
export const DEFAULT_GROUP_ID = 'Default'
export const PRIVATE_SUPPORTED_GROUPS = [
  'Belize',
  'Brazil',
  'Chile',
  'Costa Rica',
  'Ecuador',
  'Indonesia',
  'Mexico',
  'Panama',
  'Papua New Guinea',
  'Peru',
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
  norway: ['private-vms-nor-vessel-identity:v4.0'],
  palau: ['private-vms-plw-vessel-identity:v4.0'],
  panama: ['private-vms-pan-vessel-identity:v4.0'],
  peru: ['private-vms-per-vessel-identity:v4.0'],
  'ssf-aruna': [],
  'ssf-rare': [],
  'ssf-ipnlf': [],
}
