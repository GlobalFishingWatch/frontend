import type { WorkspaceViewport } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { WorkspaceCategory } from '@platform/config/map/workspaces'

import type { MarineManagerWorkspace } from 'data/map/highlighted-workspaces/marine-manager'
import { MARINE_MANAGER_WORKSPACES } from 'data/map/highlighted-workspaces/marine-manager'
import type { ReportWorkspace, WorkspaceReportLink } from 'data/map/highlighted-workspaces/reports'
import { REPORTS_INDEX } from 'data/map/highlighted-workspaces/reports'
import type { ReportCategory } from 'features/_reports/reports.types'

import type workspaceTranslations from '../../../public/locales/source/workspaces.json'

/**
 * Static highlighted-workspace data and types.
 *
 * Split out of workspaces-list.selectors so consumers that only need the constants don't pay for the
 * selector graph: that module statically reaches 109 modules (user permissions, reports, router
 * selectors), and `MainNav` — the platform's global navigation — imported it purely for
 * AVAILABLE_WORKSPACES_CATEGORIES. Measure with `node scripts/reachable-features.mjs`.
 */
export type HighlightedWorkspaceCategory = keyof typeof workspaceTranslations

export type HighlightedWorkspace = {
  id: string
  name: string
  description: string
  cta?: string
  img?: string
  reportUrl?: string
  visible?: boolean
  reports?: WorkspaceReportLink[]
  dataviewInstances?: UrlDataviewInstance[]
  viewport?: WorkspaceViewport
  category?: WorkspaceCategory
  reportCategory?: ReportCategory
  viewAccess?: 'public' | 'private' | 'password'
}

export type HighlightedWorkspaces = {
  category: HighlightedWorkspaceCategory
  workspaces: HighlightedWorkspace[]
}

export const WORKSPACES_BY_CATEGORY: Record<
  HighlightedWorkspaceCategory,
  (MarineManagerWorkspace | ReportWorkspace)[]
> = {
  'marine-manager': MARINE_MANAGER_WORKSPACES,
  reports: REPORTS_INDEX,
}

export const AVAILABLE_WORKSPACES_CATEGORIES: HighlightedWorkspaceCategory[] = (
  Object.keys(WORKSPACES_BY_CATEGORY) as HighlightedWorkspaceCategory[]
).filter((category) => WORKSPACES_BY_CATEGORY[category].length > 0)
