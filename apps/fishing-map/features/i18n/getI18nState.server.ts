import { createServerFn } from '@tanstack/react-start'

export const getI18nState = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequest } = await import('@tanstack/react-start/server')
  const { createServerI18n } = await import('./i18n.server')
  const { state } = await createServerI18n(getRequest())
  // Assert to satisfy createServerFn's serializable constraint (expects {} vs unknown)
  return state as {
    initialI18nStore: Record<string, Record<string, Record<string, object>>>
    initialLanguage: string
  }
})
