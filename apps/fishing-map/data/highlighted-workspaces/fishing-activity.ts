import { IS_PRODUCTION_WORKSPACE_ENV, PATH_BASENAME } from 'data/config'
import { DEEP_SEA_MINING_WORKSPACE_ID } from 'data/workspaces'

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
    id: DEEP_SEA_MINING_WORKSPACE_ID,
    img: `${PATH_BASENAME}/images/highlighted-workspaces/deep-sea-mining.jpg`,
    reportId: 'deep_sea_mining_watch-public',
    visible: !IS_PRODUCTION_WORKSPACE_ENV,
  },
]
