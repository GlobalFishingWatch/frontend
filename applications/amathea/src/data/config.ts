export const APP_NAME_FILTER = 'marine-reserves'

export const BASE_URL = process.env.NODE_ENV === 'production' ? '/marine-reserves' : ''

export const DEFAULT_WORKSPACE = {
  latitude: 0,
  longitude: 0,
  zoom: 1,
  start: '2018-01-01T00:00:00.000Z',
  end: '2019-12-31T23:59:59.999Z',
  hiddenDataviews: [],
}

// Params to use replace instead of push for router history to make navigation easier
export const REPLACE_URL_PARAMS = ['latitude', 'longitude', 'zoom']
