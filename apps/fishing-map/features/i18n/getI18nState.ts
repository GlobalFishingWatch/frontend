import { createServerFn } from '@tanstack/react-start'

export const getI18nState = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequest } = await import('@tanstack/react-start/server')
  const { getI18nServerState } = await import('./i18n.server')
  return getI18nServerState(getRequest())
})
