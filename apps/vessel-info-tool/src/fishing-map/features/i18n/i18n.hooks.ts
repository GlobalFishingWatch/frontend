import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { setUserLanguage } from 'features/user/user.slice'
import type { Locale } from 'types'

export function useUserLanguageUpdate() {
  const { i18n } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    i18n.on('languageChanged', (lng) => {
      if (process.browser) {
        document.documentElement.setAttribute('lang', lng)
      }
      dispatch(setUserLanguage(lng as Locale))
    })
    return () => {
      i18n.off('languageChanged')
    }
  }, [i18n, dispatch])
}
