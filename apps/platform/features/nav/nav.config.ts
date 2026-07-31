import type { useTranslation } from 'react-i18next'

import type { IconType } from '@globalfishingwatch/ui-components/icon'
import { ROUTE_PATHS } from '@platform/config/routes'

import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/map/workspaces'
import { AVAILABLE_WORKSPACES_CATEGORIES } from 'features/_map/workspaces-list/workspaces-list.config'

export const PLATFORM_MODE = import.meta.env.VITE_PLATFORM_MODE === 'true'

/**
 * The component's own `t`, not the global one: SSR builds a fresh i18next instance per request
 * (see features/i18n/i18n.server.ts), so a module-scope `t` would resolve against the wrong one.
 */
type TFunc = ReturnType<typeof useTranslation>['t']

export type NavItem = {
  /** Also the test id (`link-${id}`) and the expand/collapse key. */
  id: string
  label: string
  icon?: IconType
  /** Route path pattern. Not a ROUTE_PATHS value → rendered disabled. */
  to?: string
  params?: Record<string, string>
  subsections?: NavItem[]
}

const ROUTED_PATHS = new Set<string>(Object.values(ROUTE_PATHS))

export function isRouted(item: NavItem): boolean {
  return !!item.to && ROUTED_PATHS.has(item.to)
}

const getCurrentNavSections = (t: TFunc): NavItem[] => [
  {
    id: 'workspace',
    icon: 'workspace',
    label: t((s) => s.common.map),
    to: ROUTE_PATHS.WORKSPACE,
    params: { category: DEFAULT_WORKSPACE_CATEGORY, workspaceId: DEFAULT_WORKSPACE_ID },
  },
  {
    id: 'search',
    icon: 'category-search',
    label: t((s) => s.workspace.categories.search),
    to: ROUTE_PATHS.SEARCH,
  },
  ...AVAILABLE_WORKSPACES_CATEGORIES.map((category): NavItem => ({
    id: `category-${category}`,
    icon: `category-${category}` as IconType,
    label: t((s) => s.workspace.categories[category]),
    to: ROUTE_PATHS.WORKSPACES_LIST,
    params: { category },
  })),
]

const getPlatformNavSections = (t: TFunc): NavItem[] => [
  {
    id: 'home',
    icon: 'home',
    label: t((s) => s.nav.home),
    to: ROUTE_PATHS.LANDING,
  },
  {
    id: 'topics',
    icon: 'topics',
    label: t((s) => s.nav.topics),
    to: '/topics',
  },
  {
    id: 'map',
    icon: 'map',
    label: t((s) => s.nav.map),
    to: ROUTE_PATHS.MAP,
  },
  {
    id: 'areas',
    icon: 'areas',
    label: t((s) => s.nav.areas),
    to: '/areas',
  },
  {
    id: 'vessels',
    icon: 'vessel-section',
    label: t((s) => s.nav.vessels),
    // PLATFORM TODO: points at today's /vessel-search so search stays reachable in platform mode.
    // Swap to '/vessels' once that route lands.
    to: ROUTE_PATHS.SEARCH,
  },
  {
    id: 'ports',
    icon: 'ports',
    label: t((s) => s.nav.ports),
    to: '/ports',
  },
  {
    id: 'datasets-and-api',
    icon: 'datasets',
    label: t((s) => s.nav.datasetsAndApi),
    to: '/datasets-and-api',
    subsections: [
      { id: 'datasets', label: t((s) => s.nav.datasets), to: '/datasets-and-api/datasets' },
      { id: 'api', label: t((s) => s.nav.api), to: '/datasets-and-api/api' },
      {
        id: 'data-availability',
        label: t((s) => s.nav.dataAvailability),
        to: '/datasets-and-api/data-availability',
      },
    ],
  },
  {
    id: 'help-and-resources',
    icon: 'help-section',
    label: t((s) => s.nav.helpAndResources),
    to: '/help-and-resources',
    subsections: [
      {
        id: 'user-guide',
        label: t((s) => s.nav.toolsAndFeatures),
        to: '/help-and-resources/user-guide',
      },
      { id: 'use-cases', label: t((s) => s.nav.useCases), to: '/help-and-resources/use-cases' },
      {
        id: 'platform-and-data-updates',
        label: t((s) => s.nav.platformAndDataUpdates),
        to: '/help-and-resources/platform-and-data-updates',
      },
    ],
  },
]

export const getNavSections = (t: TFunc) =>
  PLATFORM_MODE ? getPlatformNavSections(t) : getCurrentNavSections(t)
