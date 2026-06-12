import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from '@tanstack/react-router'

import { useAppDispatch } from 'features/app/app.hooks'
import { setUserLanguage } from 'features/user/user.slice'
import type { Locale } from 'types'
import { getIsBrowser } from 'utils/dom'

export function useUserLanguageUpdate() {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    // Initial language is dispatched on store creation in routes/_app.tsx —
    // here we only track changes.
    const onLanguageChanged = (lng: Locale) => {
      if (getIsBrowser()) {
        document.documentElement.setAttribute('lang', lng)
      }
      dispatch(setUserLanguage(lng as Locale))
      // Re-run the root beforeLoad (it reads the freshly switched i18n state) so route
      // head() functions recompute the title/meta in the new language.
      router.invalidate()
    }

    i18n.on('languageChanged', onLanguageChanged)
    return () => {
      i18n.off('languageChanged', onLanguageChanged)
    }
  }, [i18n, dispatch, router])
}
