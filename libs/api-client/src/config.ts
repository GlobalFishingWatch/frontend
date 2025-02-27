/// <reference types="vite/client" />

export const API_GATEWAY =
  process.env.API_GATEWAY ||
  process.env.REACT_APP_API_GATEWAY ||
  process.env.NEXT_PUBLIC_API_GATEWAY ||
  import.meta?.env?.API_GATEWAY || // vite bundled libraries
  import.meta?.env?.VITE_API_GATEWAY ||
  'https://gateway.api.dev.globalfishingwatch.org'

export const USER_TOKEN_STORAGE_KEY = 'GFW_API_USER_TOKEN'
export const USER_REFRESH_TOKEN_STORAGE_KEY = 'GFW_API_USER_REFRESH_TOKEN'
export const API_VERSION =
  process.env.API_GATEWAY_VERSION || process.env.NEXT_PUBLIC_API_VERSION || 'v3'

export const DEBUG_API_REQUESTS: boolean = process.env.NEXT_PUBLIC_DEBUG_API_REQUESTS === 'true'
export const AUTH_PATH = 'auth'
export const REGISTER_PATH = 'registration'
export const GUEST_USER_TYPE = 'guest'
export const CONCURRENT_ERROR_STATUS = 429
