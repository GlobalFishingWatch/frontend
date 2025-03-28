import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { IS_PRODUCTION_WORKSPACE_ENV, PATH_BASENAME } from 'data/config'
import { REPORT_EVENTS_DATAVIEW_INSTANCES } from 'data/highlighted-workspaces/report.dataviews'
import { DEEP_SEA_MINING_WORKSPACE_ID } from 'data/workspaces'

import type workspaceTranslations from '../../public/locales/source/workspaces.json'

export type FishingMapWorkspaceId = keyof (typeof workspaceTranslations)['fishing-activity']
export type FishingMapWorkspace = {
  id: FishingMapWorkspaceId
  workspaceId?: string
  img: string
  href?: string
  visible?: boolean
  reportId?: string
  dataviewInstances?: UrlDataviewInstance[]
}

export const FISHING_MAP_WORKSPACES: FishingMapWorkspace[] = [
  {
    id: 'default-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/fishing-activity.jpg`,
  },
  {
    id: 'carrier-portal-public',
    workspaceId: 'default-public',
    href: 'https://globalfishingwatch.org/carrier-portal',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/carrier-portal.jpg`,
    dataviewInstances: REPORT_EVENTS_DATAVIEW_INSTANCES,
  },
  {
    id: DEEP_SEA_MINING_WORKSPACE_ID,
    img: `${PATH_BASENAME}/images/highlighted-workspaces/deep-sea-mining.jpg`,
    reportId: 'deep_sea_mining_watch-public',
    visible: !IS_PRODUCTION_WORKSPACE_ENV,
  },
]
