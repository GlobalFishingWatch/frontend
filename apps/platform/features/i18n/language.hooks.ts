import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useStore } from 'react-redux'
import { useRouter } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import { IS_DEVELOPMENT_ENV } from 'data/map/config'
import { refreshDatasetsLocaleThunk } from 'features/_map/datasets/datasets.slice'
import { selectAllDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'
import { selectHasEditTranslationsPermissions } from 'features/_user/selectors/user.permissions.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { CROWDIN_IN_CONTEXT_LANG } from 'features/i18n/i18n.config'
import type { RootState } from 'store'
import { Locale } from 'types'

const LocaleLabels = [
  { id: Locale.en, label: 'English' },
  { id: Locale.es, label: 'Español' },
  { id: Locale.fr, label: 'Français' },
  // { id: Locale.id, label: 'Bahasa Indonesia' },
  { id: Locale.pt, label: 'Portuguese' },
]

export type LanguageOption = {
  id: Locale | 'source'
  label: string
  testId: string
}

/** Shared by the map's flyout toggle and the platform nav's language subsections. */
export function useLanguageOptions() {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const store = useStore<RootState>()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const datasetsRefreshRef = useRef<{ abort: () => void } | null>(null)
  const hasEditTranslationsPermissions = useSelector(selectHasEditTranslationsPermissions)

  const toggleLanguage = useCallback(
    async (lang: Locale | 'source') => {
      if (lang === i18n.language) {
        return
      }
      trackEvent({
        category: TrackCategory.I18n,
        action: `Change language`,
        label: lang,
      })

      setIsLoading(true)
      const locale = lang === 'source' ? Locale.en : (lang as Locale)
      datasetsRefreshRef.current?.abort()
      // Read at click time instead of useSelector so the nav doesn't re-render on dataview changes
      const priorityIds = (selectAllDataviewInstancesResolved(store.getState()) || []).flatMap(
        (dataview) => dataview.datasets?.map(({ id }) => id) || []
      )
      const datasetsRefresh = dispatch(refreshDatasetsLocaleThunk({ locale, priorityIds }))
      datasetsRefreshRef.current = datasetsRefresh
      await Promise.all([i18n.loadLanguages(lang), datasetsRefresh])
      if (datasetsRefreshRef.current !== datasetsRefresh) {
        return
      }
      await i18n.changeLanguage(lang)
      await router.invalidate({
        filter: (match) => match.fullPath.startsWith(ROUTE_PATHS.HELP_HUB),
      })
      setIsLoading(false)
    },
    [dispatch, i18n, router, store]
  )

  const options: LanguageOption[] = useMemo(
    () => [
      ...(IS_DEVELOPMENT_ENV
        ? [
            {
              id: 'source' as const,
              label: '🚧 Source 🚧',
              testId: 'language-option-source',
            },
          ]
        : []),
      ...LocaleLabels.map(({ id, label }) => ({
        id,
        label,
        testId: `language-option-${id}`,
      })),
      ...(hasEditTranslationsPermissions
        ? [
            {
              id: CROWDIN_IN_CONTEXT_LANG as Locale,
              label: 'Edit translations',
              testId: 'language-option-edit-translations',
            },
          ]
        : []),
    ],
    [hasEditTranslationsPermissions]
  )

  return { options, toggleLanguage, isLoading, currentLanguage: i18n.language }
}
