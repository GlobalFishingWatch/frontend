import { createServerFn } from '@tanstack/react-start'

export const getSidebarWidthState = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequest } = await import('@tanstack/react-start/server')
  const {
    detectSidebarWidthFromRequest,
    detectContentPanelWidthFromRequest,
    detectScreenWidthFromRequest,
  } = await import('./getSidebarWidth.server')
  const request = getRequest()
  return {
    asideWidthPct: detectSidebarWidthFromRequest(request),
    contentPanelWidth: detectContentPanelWidthFromRequest(request),
    screenWidth: detectScreenWidthFromRequest(request),
  }
})
