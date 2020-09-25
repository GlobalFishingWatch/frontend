export const DEFAULT_WORKSPACE = {
  latitude: 0,
  longitude: 0,
  zoom: 1,
  start: '2017-01-01T00:00:00.000Z',
  end: new Date().toISOString(),
}

// Params to use replace instead of push for router history to make navigation easier
export const REPLACE_URL_PARAMS = ['latitude', 'longitude', 'zoom']
