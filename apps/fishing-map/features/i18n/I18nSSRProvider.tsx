import { useMemo } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18next from 'i18next'

import globalI18n from 'features/i18n/i18n'
import { DEFAULT_NAMESPACE } from 'features/i18n/i18n.config'
import type { I18nServerState } from 'features/i18n/i18n-state.utils'
import { getIsBrowser } from 'utils/dom'

function createI18nFromState(state: I18nServerState) {
  const namespaces = Object.keys(
    state.initialI18nStore[state.initialLanguage] ?? { [DEFAULT_NAMESPACE]: {} }
  )
  const instance = i18next.createInstance()
  instance.use(initReactI18next).init({
    resources: state.initialI18nStore,
    lng: state.initialLanguage,
    fallbackLng: state.initialLanguage,
    defaultNS: DEFAULT_NAMESPACE,
    ns: namespaces.length > 0 ? namespaces : [DEFAULT_NAMESPACE],
    initAsync: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })
  return instance
}

type I18nSSRProviderProps = {
  children: React.ReactNode
  serverState?: I18nServerState
}

export function I18nSSRProvider({ children, serverState }: I18nSSRProviderProps) {
  const i18nInstance = useMemo(
    () =>
      // Client: reuse the global singleton (http-backend + SSR-hydrated resources).
      !getIsBrowser() && serverState ? createI18nFromState(serverState) : globalI18n,
    [serverState]
  )

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
