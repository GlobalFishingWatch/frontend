export const ROOT_DOM_ELEMENT = '__next'

const LOCAL_API_URL = 'http://localhost:8080'
// const LOCAL_API_URL = `http://${window.location.host}`
const LOCAL_API_VERSION = '/v1'
export const API_URL = LOCAL_API_URL + LOCAL_API_VERSION

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
