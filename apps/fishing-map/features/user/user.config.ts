import { UserGroup } from './user.slice'

export const GFW_GROUP_ID = 'GFW Staff'
export const JAC_GROUP_ID = 'Joint Analytical Cell (JAC)'
export const GFW_DEV_GROUP_ID = 'development-group'
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

export const PRIVATE_SEARCH_DATASET_BY_GROUP: Record<UserGroup, string[]> = {
  belize: [
    'private-belize-vessel-identity-fishing:latest',
    'private-belize-vessel-identity-non-fishing:latest',
  ],
  brazil: [
    'private-brazil-opentuna-vessel-identity-fishing:latest',
    'private-bra-onyxsat-vessel-identity-fishing:latest',
    'private-bra-onyxsat-vessel-identity-non-fishing:latest',
  ],
  'costa rica': [
    'private-costa-rica-vessel-identity-vessels:latest',
    'private-ecuador-vessel-identity-fishing:latest',
  ],
  ecuador: ['private-ecuador-vessel-identity-non-fishing:latest'],
  panama: [
    'private-panama-vessel-identity-non-fishing:latest',
    'private-panama-vessel-identity-fishing:latest',
  ],
  peru: ['private-peru-vessel-identity-fishing:latest'],
  'papua new guinea': ['private-png-fishing-identity-vessels:latest'],
  'ssf-aruna': [],
  'ssf-rare': [],
  'ssf-ipnlf': [],
}
