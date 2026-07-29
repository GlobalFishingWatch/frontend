import { getIsBrowser } from 'utils/dom'

const isBrowser = getIsBrowser()

export const COLOR_PRIMARY_BLUE =
  (isBrowser &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-primary-blue')) ||
  'rgba(22, 63, 137)'

export const COLOR_SECONDARY_BLUE =
  (isBrowser &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-secondary-blue')) ||
  'rgba(22, 63, 137, 0.72)'

export const COLOR_GRADIENT =
  (isBrowser &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-background')) ||
  'rgba(232, 240, 252)'

// Re-exported so existing imports keep working. Anything outside the app bundle (e2e, tooling) must
// import 'features/app/cookies.config' directly — this module is not loadable outside Vite.
export {
  PANEL_WIDTHS_COOKIE_KEY,
  USER_REFRESH_TOKEN_COOKIE_KEY,
  USER_TOKEN_COOKIE_KEY,
} from './cookies.config'
export type { PanelWidths } from './cookies.config'

const SSR_SUBDOMAIN_SUFFIX =
  { development: '-dev', staging: '-sta' }[import.meta.env.VITE_WORKSPACE_ENV as string] ?? ''
export const SSR_REFERER = `https://ssr${SSR_SUBDOMAIN_SUFFIX}.globalfishingwatch.org`
// The gateway grants anonymous access by referer; node fetch sends none, browsers do.
export const SSR_HEADERS = { referer: SSR_REFERER } as HeadersInit
