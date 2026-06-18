import { getIsBrowser } from 'utils/dom'

const isBrowser = getIsBrowser()

export const COLOR_PRIMARY_BLUE =
  (isBrowser &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-primary-blue')) ||
  'rgb(22, 63, 137)'
export const COLOR_SECONDARY_BLUE =
  (isBrowser &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-secondary-blue')) ||
  'rgb(22, 63, 137, .75)'
export const COLOR_GRADIENT =
  (isBrowser &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-background')) ||
  'rgb(229, 240, 242)'

export const SIDEBAR_WIDTH_COOKIE_KEY = 'sidebarWidth'
export const CONTENT_PANEL_WIDTH_COOKIE_KEY = 'contentPanelWidth'
export const SCREEN_WIDTH_COOKIE_KEY = 'screenWidth'
// Access token: JS-readable (client builds Bearer headers from it; SSR reads it from the request).
export const USER_TOKEN_COOKIE_KEY = 'GFW_API_USER_TOKEN'
// Refresh token: httpOnly (only the auth server functions touch it).
export const USER_REFRESH_TOKEN_COOKIE_KEY = 'GFW_API_REFRESH_TOKEN'
