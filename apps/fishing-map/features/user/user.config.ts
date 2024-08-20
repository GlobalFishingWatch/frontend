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
    'private-belize-vessel-identity-fishing:v20220304',
    'private-belize-vessel-identity-non-fishing:v20220304',
  ],
  brazil: [
    // 'private-brazil-opentuna-vessel-identity-fishing:v20210311',
    'private-bra-onyxsat-vessel-identity-fishing:v20211126',
    'private-bra-onyxsat-vessel-identity-non-fishing:v20211126',
  ],
  'costa rica': [
    'private-costa-rica-vessel-identity-vessels:v20211126',
    'private-ecuador-vessel-identity-fishing:v20211126',
  ],
  ecuador: ['private-ecuador-vessel-identity-non-fishing:v20211126'],
  panama: [
    'private-panama-vessel-identity-non-fishing:v20211126',
    'private-panama-vessel-identity-fishing:v20211126',
  ],
  peru: ['private-peru-vessel-identity-fishing:v20211126'],
  'papua new guinea': ['private-png-fishing-identity-vessels:v20230210'],
  'ssf-aruna': [],
  'ssf-rare': [],
  'ssf-ipnlf': [],
}
