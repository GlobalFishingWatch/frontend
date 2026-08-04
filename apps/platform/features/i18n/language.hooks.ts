import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { IS_DEVELOPMENT_ENV } from 'data/map/config'
import { refreshDatasetsLocaleThunk } from 'features/_map/datasets/datasets.slice'
import { selectHasEditTranslationsPermissions } from 'features/_user/selectors/user.permissions.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { CROWDIN_IN_CONTEXT_LANG } from 'features/i18n/i18n.config'
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
  const [isLoading, setIsLoading] = useState(false)
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
      await dispatch(refreshDatasetsLocaleThunk(locale))
      i18n.changeLanguage(lang)
      setIsLoading(false)
    },
    [dispatch, i18n]
  )

  const options: LanguageOption[] = useMemo(
    () => [
      ...(IS_DEVELOPMENT_ENV
        ? [{ id: 'source' as const, label: '🚧 Source 🚧', testId: 'language-option-source' }]
        : []),
      ...LocaleLabels.map(({ id, label }) => ({ id, label, testId: `language-option-${id}` })),
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
