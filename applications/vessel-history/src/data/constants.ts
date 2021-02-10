export const BASE_URL = process.env.NODE_ENV === 'production' ? '/port-inspector' : ''

export const SPLASH_TIMEOUT = 1000
console.log(['NODE_ENV:', process.env.NODE_ENV])
export const SHOW_VESSEL_API_SOURCE = process.env.NODE_ENV === 'production' ? false : true
