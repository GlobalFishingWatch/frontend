import type { useTranslation } from 'react-i18next'

import type { IconType } from '@globalfishingwatch/ui-components/icon'
import type { RoutePathValues } from '@platform/config/routes'
import { ROUTE_PATHS } from '@platform/config/routes'

import { AVAILABLE_WORKSPACES_CATEGORIES } from 'features/_map/workspaces-list/workspaces-list.config'
import type { HelpHubSectionSlug } from 'features/help/helpHub.types'
import type { LanguageOption } from 'features/i18n/language.hooks'

export const PLATFORM_MODE = import.meta.env.VITE_PLATFORM_MODE === 'true'

type TFunc = ReturnType<typeof useTranslation>['t']

export type NavItem = {
  /** Also the test id (`link-${id}`) and the expand/collapse key. */
  id: string
  label: string
  icon?: IconType
  /** A real, registered route. Typed, so a typo here is a compile error. */
  to?: RoutePathValues
  /**
   * PLATFORM TODO: a route the platform will have but does not yet. Documents the intended target
   * while keeping the row disabled — deliberately untyped, since it matches no route today. Move
   * the value to `to` when the route lands.
   */
  plannedTo?: string
  params?: Record<string, string>
  /** External link. Takes precedence over `to`. */
  href?: string
  /** Acts instead of navigating. Takes precedence over `to`. */
  onClick?: () => void
  /** Extra test id on the clickable element, on top of the row's `link-${id}`. */
  testId?: string
  /** Swaps the row icon for a spinner (e.g. while the language switch refreshes datasets). */
  loading?: boolean
  subsections?: NavItem[]
}

export type RoutedNavItem = NavItem & { to: RoutePathValues }

export function isRouted(item: NavItem): item is RoutedNavItem {
  return item.to !== undefined
}

// TODO PLATFORM: maybe remove this if workspaces are linked in home
export const getCategoryItems = (t: TFunc, { icons = true } = {}): NavItem[] =>
  AVAILABLE_WORKSPACES_CATEGORIES.map((category) => ({
    id: `category-${category}`,
    ...(icons && { icon: `category-${category}` as IconType }),
    label: t((s) => s.workspace.categories[category], { defaultValue: category }),
    to: ROUTE_PATHS.WORKSPACES_LIST,
    params: { category },
  }))

const helpHubSectionParams = (sectionSlug: HelpHubSectionSlug) => ({ sectionSlug })

export const getPlatformNavSections = (
  t: TFunc,
  handlers: { onGetStartedClick: () => void }
): NavItem[] => [
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
    plannedTo: '/topics',
  },
  {
    id: 'map',
    icon: 'map',
    label: t((s) => s.nav.map),
    to: ROUTE_PATHS.MAP,
    subsections: getCategoryItems(t, { icons: false }),
  },
  {
    id: 'areas',
    icon: 'areas',
    label: t((s) => s.nav.areas),
    plannedTo: '/areas',
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
    plannedTo: '/ports',
  },
  {
    id: 'datasets-and-api',
    icon: 'datasets',
    label: t((s) => s.nav.datasetsAndApi),
    plannedTo: '/datasets-and-api',
    subsections: [
      { id: 'datasets', label: t((s) => s.nav.datasets), plannedTo: '/datasets-and-api/datasets' },
      { id: 'api', label: t((s) => s.nav.api), plannedTo: '/datasets-and-api/api' },
      {
        id: 'data-availability',
        label: t((s) => s.nav.dataAvailability),
        plannedTo: '/datasets-and-api/data-availability',
      },
    ],
  },
  {
    id: 'help-and-resources',
    icon: 'help-section',
    label: t((s) => s.nav.helpAndResources),
    to: ROUTE_PATHS.HELP_HUB,
    subsections: [
      {
        id: 'get-started',
        label: t((s) => s.onboarding.getStarted),
        onClick: handlers.onGetStartedClick,
      },
      {
        id: 'user-guide',
        label: t((s) => s.nav.toolsAndFeatures),
        to: ROUTE_PATHS.HELP_HUB_SECTION,
        params: helpHubSectionParams('tools-and-features'),
      },
      {
        id: 'use-cases',
        label: t((s) => s.nav.useCases),
        to: ROUTE_PATHS.HELP_HUB_SECTION,
        params: helpHubSectionParams('use-cases'),
      },
      {
        id: 'platform-and-data-updates',
        label: t((s) => s.nav.platformAndDataUpdates),
        to: ROUTE_PATHS.HELP_HUB_SECTION,
        params: helpHubSectionParams('platform-and-updates'),
      },
    ],
  },
]

export const getPlatformBottomSections = (
  t: TFunc,
  handlers: {
    onAssistantClick: () => void
    onLogIssueClick: () => void
    language: {
      options: LanguageOption[]
      currentLanguage: string
      isLoading: boolean
      toggleLanguage: (id: LanguageOption['id']) => void
    }
  }
): Record<'assistant' | 'feedback' | 'language' | 'settings', NavItem> => ({
  assistant: {
    id: 'assistant',
    icon: 'magic',
    label: t((s) => s.common.assistant),
    onClick: handlers.onAssistantClick,
  },
  feedback: {
    id: 'feedback',
    icon: 'feedback',
    label: t((s) => s.common.feedback),
    subsections: [
      {
        id: 'log-an-issue',
        label: t((s) => s.feedback.logAnIssue),
        testId: 'open-feedback-modal',
        onClick: handlers.onLogIssueClick,
      },
      {
        id: 'request-an-improvement',
        label: t((s) => s.feedback.requestAnImprovement),
        href: 'https://feedback.globalfishingwatch.org/',
      },
    ],
  },
  language: {
    id: 'language',
    icon: 'language',
    label:
      handlers.language.options.find(({ id }) => id === handlers.language.currentLanguage)?.label ??
      t((s) => s.nav.language),
    loading: handlers.language.isLoading,
    subsections: handlers.language.options
      .filter(({ id }) => id !== handlers.language.currentLanguage)
      .map(({ id, label, testId }) => ({
        id: `language-${id}`,
        label,
        testId,
        onClick: () => !handlers.language.isLoading && handlers.language.toggleLanguage(id),
      })),
  },
  settings: {
    id: 'settings',
    icon: 'settings',
    label: t((s) => s.nav.settings),
    plannedTo: '/settings',
  },
})
