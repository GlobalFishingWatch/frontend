import { createServerFn } from '@tanstack/react-start'

import { readCookie } from '@globalfishingwatch/api-client'

import { PANEL_WIDTHS_COOKIE_KEY, type PanelWidths } from 'features/app/app.config'

const MIN_ASIDE_PCT = 33
const MAX_ASIDE_PCT = 66
const clampAsidePct = (pct: number) => Math.min(MAX_ASIDE_PCT, Math.max(MIN_ASIDE_PCT, pct))

const MIN_PANEL_WIDTH = 320
const MAX_PANEL_WIDTH = 800
const clampContentPanelWidth = (w: number) =>
  Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, w))

export function detectPanelWidthsFromRequest(request: Request): {
  asideWidthPct: number | null
  contentPanelWidth: number | null
  screenWidth: number | null
} {
  const cookieHeader = request.headers.get('cookie')
  const widths = cookieHeader
    ? readCookie<PanelWidths>({
        cookie: cookieHeader,
        key: PANEL_WIDTHS_COOKIE_KEY,
        type: 'object',
      })
    : null
  return {
    asideWidthPct: widths?.sidebar != null ? clampAsidePct(widths.sidebar) : null,
    contentPanelWidth:
      widths?.contentPanel != null ? clampContentPanelWidth(widths.contentPanel) : null,
    screenWidth: widths?.screen ?? null,
  }
}

export const getSidebarWidthState = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequest } = await import('@tanstack/react-start/server')
  const request = getRequest()
  return detectPanelWidthsFromRequest(request)
})
