import {
  CONTENT_PANEL_WIDTH_COOKIE_KEY,
  SCREEN_WIDTH_COOKIE_KEY,
  SIDEBAR_WIDTH_COOKIE_KEY,
} from 'features/app/app.config'

const MIN_ASIDE_PCT = 33
const MAX_ASIDE_PCT = 66
const clampAsidePct = (pct: number) => Math.min(MAX_ASIDE_PCT, Math.max(MIN_ASIDE_PCT, pct))

const MIN_PANEL_WIDTH = 320
const MAX_PANEL_WIDTH = 800
const clampContentPanelWidth = (w: number) =>
  Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, w))

function readCookieNumber(cookieHeader: string, key: string): number | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${key}=([^;]+)`))
  const parsed = match?.[1] ? parseFloat(decodeURIComponent(match[1])) : NaN
  return Number.isNaN(parsed) ? null : parsed
}

export function detectSidebarWidthFromRequest(request: Request): number | null {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  const value = readCookieNumber(cookieHeader, SIDEBAR_WIDTH_COOKIE_KEY)
  return value !== null ? clampAsidePct(value) : null
}

export function detectContentPanelWidthFromRequest(request: Request): number | null {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  const value = readCookieNumber(cookieHeader, CONTENT_PANEL_WIDTH_COOKIE_KEY)
  return value !== null ? clampContentPanelWidth(value) : null
}

export function detectScreenWidthFromRequest(request: Request): number | null {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  return readCookieNumber(cookieHeader, SCREEN_WIDTH_COOKIE_KEY)
}
