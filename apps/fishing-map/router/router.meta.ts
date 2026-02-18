import type Resources from 'features/i18n/i18n.types'

export type WorkspaceCategoryDescriptionKey =
  keyof Resources['translations']['workspace']['siteDescription']

export type TranslateFn = (key: string) => string

const PREFIX = 'GFW'
const DEFAULT_DESCRIPTION = `Through our free and open data transparency platform, Global Fishing Watch enables research and innovation in support of ocean sustainability.`

/** English fallbacks when i18n state is unavailable (SSR edge cases, pre-render) */
const fallbackTranslations = {
  common: { map: 'Map' },
  search: { title: 'Search' },
  workspace: {
    siteDescription: {
      default:
        'The Global Fishing Watch map is the first open-access platform for visualization and analysis of marine traffic and vessel-based human activity at sea.',
      'fishing-activity':
        'The Global Fishing Watch map is the first open-access platform for visualization and analysis of marine traffic and vessel-based human activity at sea.',
      'marine-manager':
        'The portal provides dynamic interactive data on marine traffic, biology and ocean conditions to support marine protected area design and management.',
      search: 'Search by vessel name or identification code.',
    },
  },
  analysis: { title: 'Report' },
  vessel: { title: 'Vessel profile' },
  user: { title: 'User' },
} as const

type I18nState = {
  initialI18nStore: Record<string, Record<string, Record<string, unknown>>>
  initialLanguage: string
}

type RouteMatch = { routeId: string; loaderData?: { i18nState?: I18nState } }

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === 'string' ? current : undefined
}

/**
 * Derives a translation function from the root match's i18nState.
 * Falls back to English when state is missing (SSR edge cases, pre-render).
 */
export function getTFuntion(matches: RouteMatch[]): TranslateFn {
  const rootMatch = matches.find((m) => m.routeId?.startsWith?.('__root__'))
  const state = rootMatch?.loaderData?.i18nState
  if (!state?.initialI18nStore?.[state.initialLanguage]) {
    return (key: string) =>
      getNested(fallbackTranslations as unknown as Record<string, unknown>, key) ?? key
  }
  const ns = state.initialI18nStore[state.initialLanguage]['translations'] as
    | Record<string, unknown>
    | undefined
  if (!ns) {
    return (key: string) =>
      getNested(fallbackTranslations as unknown as Record<string, unknown>, key) ?? key
  }
  return (key: string) =>
    getNested(ns, key) ??
    getNested(fallbackTranslations as unknown as Record<string, unknown>, key) ??
    key
}

const getHeadTitle = (category: string = fallbackTranslations.common.map) =>
  `${PREFIX} | ${category}`

export const getRouteHead = (
  { category, description, t } = {} as { category?: string; description?: string; t?: TranslateFn }
) => {
  const categoryResolved = category ?? (t ? t('common.map') : fallbackTranslations.common.map)
  const descriptionResolved =
    description ??
    (t
      ? t('workspace.siteDescription.default')
      : fallbackTranslations.workspace.siteDescription.default)
  return {
    meta: [
      {
        title: getHeadTitle(categoryResolved),
        description: descriptionResolved,
      },
    ],
  }
}

export const getWorkspaceHead = (category: WorkspaceCategoryDescriptionKey, t?: TranslateFn) => {
  const description = t
    ? t(`workspace.siteDescription.${category}`) || DEFAULT_DESCRIPTION
    : (fallbackTranslations.workspace.siteDescription[category] ?? DEFAULT_DESCRIPTION)
  return getRouteHead({ category, description, t })
}

export const getSearchHead = (t?: TranslateFn) => {
  return getRouteHead({
    category: t ? t('search.title') : fallbackTranslations.search.title,
    description: t
      ? t('workspace.siteDescription.search')
      : fallbackTranslations.workspace.siteDescription.search,
    t,
  })
}
