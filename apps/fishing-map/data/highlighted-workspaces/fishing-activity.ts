import { IS_PRODUCTION_WORKSPACE_ENV, PATH_BASENAME } from 'data/config'
import { DEEP_SEA_MINING_WORKSPACE_ID, DEFAULT_WORKSPACE_ID } from 'data/workspaces'

import type workspaceTranslations from '../../public/locales/source/workspaces.json'

export type FishingMapWorkspaceId = keyof (typeof workspaceTranslations)['fishing-activity']
export type WorkspaceReportLink = {
  id: string
  key?: string // Using analysis.see as default
}
export type FishingMapWorkspace = {
  id: FishingMapWorkspaceId
  img: string
  visible?: boolean
  reports?: WorkspaceReportLink[]
}

export const LEGACY_CVP_WORKSPACE_ID = 'carrier-portal-public'

export const FISHING_MAP_WORKSPACES: FishingMapWorkspace[] = [
  {
    id: DEFAULT_WORKSPACE_ID,
    img: `${PATH_BASENAME}/images/highlighted-workspaces/fishing-activity.jpg`,
  },
  {
    id: LEGACY_CVP_WORKSPACE_ID,
    img: `${PATH_BASENAME}/images/highlighted-workspaces/carrier-portal.jpg`,
  },
  {
    id: DEEP_SEA_MINING_WORKSPACE_ID,
    img: `${PATH_BASENAME}/images/highlighted-workspaces/deep-sea-mining.jpg`,
    reports: [
      {
        id: 'deep_sea_mining_watch-public',
      },
    ],
    visible: !IS_PRODUCTION_WORKSPACE_ENV,
  },
]
