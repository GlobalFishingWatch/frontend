import { useMemo } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18next from 'i18next'

import globalI18n, { DEFAULT_NAMESPACE } from 'features/i18n/i18n'

import type { I18nServerState } from './i18n.server'

// Constant — never changes between server and client within one environment.
const isServer = typeof window === 'undefined'

function createI18nFromState(state: I18nServerState) {
  const i18nInstance = i18next.createInstance()
  const namespaces = Object.keys(
    state.initialI18nStore[state.initialLanguage] ?? { [DEFAULT_NAMESPACE]: {} }
  )
  i18nInstance.use(initReactI18next).init({
    resources: state.initialI18nStore,
    lng: state.initialLanguage,
    defaultNS: DEFAULT_NAMESPACE,
    ns: namespaces.length > 0 ? namespaces : [DEFAULT_NAMESPACE],
    initImmediate: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })
  return i18nInstance
}

type I18nSSRProviderProps = {
  children: React.ReactNode
  serverState?: I18nServerState
}

export function I18nSSRProvider({ children, serverState }: I18nSSRProviderProps) {
  const i18nInstance = useMemo(
    () =>
      // Server: isolated per-request instance — translations are loaded synchronously,
      //   no Backend plugin needed, safe from cross-request contamination.
      // Client: reuse the global instance from i18n.ts — it has the Backend plugin
      //   (for on-demand language loading) and was already seeded with the SSR
      //   translations by getSsrI18nState() before React hydrated.
      isServer && serverState ? createI18nFromState(serverState) : globalI18n,
    [serverState]
  )

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
