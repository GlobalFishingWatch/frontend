const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const BASE_PATH = process.env.NEXT_PUBLIC_URL || IS_PRODUCTION ? '/map' : ''

export const ROOT_DOM_ELEMENT = '__next'
export const LOCALE = 'en'

export const DEFAULT_VIEWPORT = {
  zoom: 1.5,
  latitude: 19,
  longitude: 26,
}

export const DEFAULT_URL_DEBOUNCE = 600
export const API_BASE = 'https://gateway.api.dev.globalfishingwatch.org/prototypes/'
