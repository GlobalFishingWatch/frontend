import { createServerFn } from '@tanstack/react-start'

export const getI18nState = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequestI18n } = await import('./request-i18n.server')
  const { getI18nServerState } = await import('./i18n.server')
  const state = getI18nServerState(getRequestI18n())
  // Assert to satisfy createServerFn's serializable constraint (expects {} vs unknown)
  return state as {
    initialI18nStore: Record<string, Record<string, Record<string, object>>>
    initialLanguage: string
  }
})
