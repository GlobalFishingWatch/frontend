import { useMemo } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18next from 'i18next'

import { DEFAULT_NAMESPACE } from 'features/i18n/i18n'

import type { I18nServerState } from './i18n.server'

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
  const i18nWithState = useMemo(() => {
    if (!serverState) return null
    return createI18nFromState(serverState)
  }, [serverState])

  if (serverState && i18nWithState) {
    return <I18nextProvider i18n={i18nWithState}>{children}</I18nextProvider>
  }

  return <>{children}</>
}
