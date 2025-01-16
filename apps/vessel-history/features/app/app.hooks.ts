import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { TypedUseSelectorHook} from 'react-redux';
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch,RootState } from 'store'

import { FEEDBACK_EN, FEEDBACK_FR } from 'data/config'
import { getBrowser, getHref, getOperatingSystem } from 'utils/dom'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useApp = () => {
  const { i18n } = useTranslation()

  const openFeedback = useCallback(() => {
    if (i18n.language === 'fr') {
      const url =
        FEEDBACK_FR +
        `?usp=pp_url&entry.896676966=${getHref()}&entry.1441570157=${getOperatingSystem()}&entry.374853059=${getBrowser()}&entry.687140445=${getHref()}`
      window?.open(url, '_blank')?.focus()
    } else {
      const url =
        FEEDBACK_EN +
        `?usp=pp_url&entry.896676966=${getHref()}&entry.1441570157=${getOperatingSystem()}&entry.374853059=${getBrowser()}&entry.331914194=${getHref()}`
      window?.open(url, '_blank')?.focus()
    }
  }, [i18n.language])

  return {
    openFeedback,
  }
}
