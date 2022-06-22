import ReactGA from 'react-ga'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const ROOT_DOM_ELEMENT = '__next'

export const GOOGLE_UNIVERSAL_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_UNIVERSAL_ANALYTICS_ID
export const GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS: ReactGA.InitializeOptions = IS_PRODUCTION
  ? {}
  : { debug: true }

// Params to use replace instead of push for router history to make navigation easier
export const REPLACE_URL_PARAMS = ['latitude', 'longitude', 'zoom']

export const DEFAULT_WORKSPACE = {
  latitude: 0,
  longitude: 0,
  zoom: 4,
  start: '2017-01-01T00:00:00.000Z',
  end: new Date().toISOString(),
}

export const DEFAULT_VIEWPORT = {
  zoom: 4,
  latitude: 19,
  longitude: 26,
}

export const NSLABELS_ENDOPOINT = IS_PRODUCTION ?
  'https://gateway.api.globalfishingwatch.org/v1/tileset/nslabels/tile?x={x}&y={y}&z={z}' :
  'https://gateway.api.dev.globalfishingwatch.org/v1/tileset/nslabels/tile?x={x}&y={y}&z={z}'


