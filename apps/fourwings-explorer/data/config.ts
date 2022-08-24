export const ROOT_DOM_ELEMENT = '__next'

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const LOCAL_API_URL =
  IS_PRODUCTION && typeof window !== 'undefined'
    ? `http://${window.location.host}`
    : process.env.NEXT_LOCAL_API_URL || 'http://localhost:8080'
const LOCAL_API_VERSION = process.env.NEXT_LOCAL_API_VERSION || '/v1'
export const API_URL = LOCAL_API_URL + LOCAL_API_VERSION

export const LOCALE = 'en'
export const TIMEBAR_HEIGHT = 72

export const FIRST_YEAR_OF_DATA = 2012
export const LAST_YEAR_OF_DATA = 2030
export const CURRENT_YEAR = new Date().getFullYear()
export const DEFAULT_WORKSPACE = {
  latitude: 0,
  longitude: 0,
  zoom: 1,
  start: '2017-01-01T00:00:00.000Z',
  end: new Date().toISOString(),
  availableStart: new Date(Date.UTC(FIRST_YEAR_OF_DATA, 0, 1)).toISOString(),
  availableEnd: new Date(
    Date.UTC(LAST_YEAR_OF_DATA, 11, 31) + 24 * 60 * 60 * 1000 - 1
  ).toISOString(),
}

export const DEFAULT_VIEWPORT = {
  zoom: 1.5,
  latitude: 19,
  longitude: 26,
}

export const DEFAULT_URL_DEBOUNCE = 600
