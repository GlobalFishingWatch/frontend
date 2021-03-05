export const BASE_URL = process.env.NODE_ENV === 'production' ? '/vessel-history' : ''

export const SPLASH_TIMEOUT = 1000
export const BASE_DATASET = 'public-global-fishing-vessels:v20201001'
export const SHOW_VESSEL_API_SOURCE =
  process.env.REACT_APP_WORKSPACE_ENV === 'production' ? false : true
