import { GFWConfig } from './types'

export const AUTH_SECRET = process.env['NEXTAUTH_SECRET']

export const GFW_API_GATEWAY =
  process.env['API_GATEWAY'] ||
  process.env['REACT_APP_API_GATEWAY'] ||
  process.env['NEXT_PUBLIC_API_GATEWAY'] ||
  'https://gateway.api.dev.globalfishingwatch.org'

export const GFW_API_VERSION =
  process.env['API_VERSION'] ||
  process.env['REACT_APP_API_VERSION'] ||
  process.env['NEXT_PUBLIC_API_VERSION'] ||
  'v2'

export const GFW_API_AUTH_ENDPOINT = '/auth'

export const GFW_CLIENT_DEFAULTS: GFWConfig = {
  gatewayUrl: GFW_API_GATEWAY,
  version: GFW_API_VERSION,
  debug: false,
}

export const GFW_CLIENT_BASE_HEADERS = new Headers({
  'Content-Type': 'application/json',
  Accept: 'application/json',
})
