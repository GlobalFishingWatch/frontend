/// <reference types="vite/client" />

import type { UserPermission } from '@globalfishingwatch/api-types'

import { getEnv } from './utils/env'

export const API_GATEWAY =
  getEnv('API_GATEWAY') ||
  getEnv('VITE_API_GATEWAY') ||
  getEnv('NEXT_PUBLIC_API_GATEWAY') ||
  'https://gateway.api.dev.globalfishingwatch.org'

export const USER_TOKEN_STORAGE_KEY = 'GFW_API_USER_TOKEN'
export const USER_REFRESH_TOKEN_STORAGE_KEY = 'GFW_API_USER_REFRESH_TOKEN'

export const API_VERSION =
  getEnv('API_GATEWAY_VERSION') ||
  getEnv('VITE_API_VERSION') ||
  getEnv('NEXT_PUBLIC_API_VERSION') ||
  'v3'

/**
 * true logs every scope, a scope name logs only that one:
 * 'request' fetches, retries and errors,
 * 'auth' tokens/refresh/login/logout/session ("[auth]"),
 * 'rate-limit' the rate limit + Turnstile trace ("[rate-limit]")
 */
export type DebugMode = boolean | 'request' | 'auth' | 'rate-limit'

const DEBUG_SCOPES: string[] = ['request', 'auth', 'rate-limit']

const parseDebugMode = (value?: string): DebugMode =>
  value === 'true' ? true : value && DEBUG_SCOPES.includes(value) ? (value as DebugMode) : false

export const DEBUG_API_REQUESTS: DebugMode = parseDebugMode(
  getEnv('DEBUG_API_REQUESTS') ?? getEnv('VITE_DEBUG_API_REQUESTS')
)

export const AUTH_PATH = 'auth'
export const REGISTER_PATH = 'registration'
export const SETTINGS_PATH = 'settings'
export const LOGOUT_SESSION_PATH = 'logout-session'
export const GUEST_USER_TYPE = 'guest'
export const CONCURRENT_ERROR_STATUS = 429
// Validates the Turnstile token and resets the track/events limit
export const VISUALIZE_LIMIT_RESET_PATH = 'vessels/tracks/visualize-limit/reset'

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
