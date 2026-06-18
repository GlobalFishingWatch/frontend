/// <reference types="vite/client" />

import type { UserPermission } from '@globalfishingwatch/api-types'

export const API_GATEWAY =
  (typeof process !== 'undefined' && process.env?.API_GATEWAY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_GATEWAY) ||
  import.meta.env?.API_GATEWAY ||
  import.meta.env?.VITE_API_GATEWAY ||
  'https://gateway.api.dev.globalfishingwatch.org'

export const USER_TOKEN_STORAGE_KEY = 'GFW_API_USER_TOKEN'
export const USER_REFRESH_TOKEN_STORAGE_KEY = 'GFW_API_USER_REFRESH_TOKEN'

export const API_VERSION =
  (typeof process !== 'undefined' && process.env?.API_GATEWAY_VERSION) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_VERSION) ||
  import.meta.env?.API_VERSION ||
  import.meta.env?.VITE_API_VERSION ||
  'v3'

export const DEBUG_API_REQUESTS: boolean =
  (typeof process !== 'undefined' && process.env?.API_GATEWAY === 'true') ||
  import.meta.env?.DEBUG_API_REQUESTS === 'true' ||
  false

export const AUTH_PATH = 'auth'
export const REGISTER_PATH = 'registration'
export const GUEST_USER_TYPE = 'guest'
export const CONCURRENT_ERROR_STATUS = 429

export const ANONYMOUS_PERMISSIONS = [
  { type: 'dataset', value: '*global*', action: 'basic-search' },
  { type: 'dataset', value: '*public*', action: 'read' },
  { type: 'dataset', value: 'vessel-insights', action: 'read' },
  { type: 'insights', value: 'coverage', action: 'read' },
  { type: 'insights', value: 'encounter', action: 'read' },
  { type: 'insights', value: 'fishing', action: 'read' },
  { type: 'insights', value: 'gap', action: 'read' },
  { type: 'insights', value: 'loitering', action: 'read' },
  { type: 'insights', value: 'port_visit', action: 'read' },
  { type: 'insights', value: 'vessel_identity_iuu_vessel_list', action: 'read' },
  { type: 'report', value: '*-public', action: 'read' },
  { type: 'vessel', value: 'bunker', action: 'read' },
  { type: 'vessel', value: 'carrier', action: 'read' },
  { type: 'vessel', value: 'fishing', action: 'read' },
  { type: 'vessel', value: 'support', action: 'read' },
  { type: 'vessel-group', value: '*-public', action: 'read' },
  { type: 'vessel-info', value: 'commercial-sources', action: 'basic-search' },
  { type: 'vessel-info', value: 'non-commercial-sources', action: 'basic-search' },
  { type: 'workspace', value: '*-public', action: 'read' },
] satisfies UserPermission[]
