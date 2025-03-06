import { IS_PRODUCTION_WORKSPACE_ENV, PATH_BASENAME } from 'data/config'

import type workspaceTranslations from '../../public/locales/source/workspaces.json'

export type FishingMapWorkspaceId = keyof (typeof workspaceTranslations)['fishing-activity']
export type FishingMapWorkspace = {
  id: FishingMapWorkspaceId
  img: string
  visible?: boolean
  reportId?: string
}

export const FISHING_MAP_WORKSPACES: FishingMapWorkspace[] = [
  {
    id: 'default-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/fishing-activity.jpg`,
  },
  {
    id: 'carrier-portal-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/carrier-portal.jpg`,
  },
  {
    id: 'deep-sea-mining-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/deep-sea-mining.jpg`,
    reportId: 'deep_sea_mining-public',
    visible: !IS_PRODUCTION_WORKSPACE_ENV,
  },
]
