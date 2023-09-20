export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const ROOT_DOM_ELEMENT = '__next'

export const GOOGLE_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID ?? 'GTM-KK5ZFST'
export const GOOGLE_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID ?? 'G-R3PWRQW70G'

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

export const NSLABELS_ENDOPOINT =
  process.env.NEXT_PUBLIC_API_GATEWAY + '/v1/tileset/nslabels/tile?x={x}&y={y}&z={z}'
