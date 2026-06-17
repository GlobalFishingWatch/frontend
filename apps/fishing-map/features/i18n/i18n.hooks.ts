import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppDispatch } from 'features/app/app.hooks'
import { setUserLanguage } from 'features/user/user.slice'
import type { Locale } from 'types'
import { getIsBrowser } from 'utils/dom'

export function useUserLanguageUpdate() {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (i18n.isInitialized && i18n.language) {
      dispatch(setUserLanguage(i18n.language as Locale))
    }

    const onLanguageChanged = (lng: Locale) => {
      if (getIsBrowser()) {
        document.documentElement.setAttribute('lang', lng)
      }
      dispatch(setUserLanguage(lng as Locale))
    }

    i18n.on('languageChanged', onLanguageChanged)
    return () => {
      i18n.off('languageChanged', onLanguageChanged)
    }
  }, [i18n, dispatch])
}
