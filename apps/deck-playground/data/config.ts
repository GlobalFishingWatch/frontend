export const ROOT_DOM_ELEMENT = '__next'
export const LOCALE = 'en'
export const TIMEBAR_HEIGHT = 72

export const DEFAULT_VIEWPORT = {
  zoom: 1.5,
  latitude: 19,
  longitude: 26,
}

export const FIRST_YEAR_OF_DATA = 2021
export const LAST_YEAR_OF_DATA = 2022
export const CURRENT_YEAR = new Date().getFullYear()

export const DEFAULT_WORKSPACE = {
  ...DEFAULT_VIEWPORT,
  start: '2022-01-01T00:00:00.000Z',
  end: new Date().toISOString(),
  availableStart: new Date(Date.UTC(FIRST_YEAR_OF_DATA, 0, 1)).toISOString(),
  availableEnd: new Date(
    Date.UTC(LAST_YEAR_OF_DATA, 11, 31) + 24 * 60 * 60 * 1000 - 1
  ).toISOString(),
}

export const DEFAULT_URL_DEBOUNCE = 600
