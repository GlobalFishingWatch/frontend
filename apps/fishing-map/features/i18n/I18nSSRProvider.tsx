import { I18nextProvider } from 'react-i18next'

import globalI18n from 'features/i18n/i18n'

type I18nSSRProviderProps = {
  children: React.ReactNode
}

export function I18nSSRProvider({ children }: I18nSSRProviderProps) {
  // Server: globalI18n is a Proxy → getRequestI18n() (AsyncLocalStorage, initReactI18next on server).
  // Client: global singleton with http-backend and SSR-hydrated resources.
  return <I18nextProvider i18n={globalI18n}>{children}</I18nextProvider>
}
