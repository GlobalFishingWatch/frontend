import { createServerFn } from '@tanstack/react-start'

export const getI18nState = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequest } = await import('@tanstack/react-start/server')
  const { getI18nServerState } = await import('./i18n.server')
  const state = await getI18nServerState(getRequest())
  // Assert to satisfy createServerFn's serializable constraint (expects {} vs unknown)
  return state as {
    initialI18nStore: Record<string, Record<string, Record<string, object>>>
    initialLanguage: string
  }
})
