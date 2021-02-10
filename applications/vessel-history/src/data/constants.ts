export const BASE_URL = process.env.NODE_ENV === 'production' ? '/vessel-history' : ''

export const SPLASH_TIMEOUT = 1000
console.log(['REACT_APP_WORKSPACE_ENV:', process.env.REACT_APP_WORKSPACE_ENV])
export const SHOW_VESSEL_API_SOURCE =
  process.env.REACT_APP_WORKSPACE_ENV === 'production' ? false : true
