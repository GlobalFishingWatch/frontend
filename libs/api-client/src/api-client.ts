import type {
  APIPagination,
  ResourceRequestType,
  ResourceResponseType,
  UserData,
  UserPermission,
} from '@globalfishingwatch/api-types'

import {
  getIsTimeoutError,
  getIsUnauthorizedError,
  isAuthError,
  isTransientError,
  parseAPIError,
} from './utils/errors'
import { parseJSON, processStatus } from './utils/parse'
import { isUrlAbsolute } from './utils/url'
import {
  API_GATEWAY,
  API_VERSION,
  AUTH_PATH,
  DEBUG_API_REQUESTS,
  GUEST_USER_TYPE,
  REGISTER_PATH,
  USER_REFRESH_TOKEN_STORAGE_KEY,
  USER_TOKEN_STORAGE_KEY,
} from './config'

interface UserTokens {
  token: string
  refreshToken: string
}

interface LoginParams {
  accessToken?: string | null
  refreshToken?: string | null
}
export type ApiVersion = '' | 'v3'
export type FetchOptions<T = unknown> = Partial<Omit<RequestInit, 'body' | 'headers'>> & {
  version?: ApiVersion
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  cache?: RequestCache
  responseType?: ResourceResponseType
  requestType?: ResourceRequestType
  // Pass a function when a header value must be re-read on every attempt (e.g. a
  // rotating refresh-token), so the auto-retry never replays a stale value.
  headers?: HeadersInit | (() => HeadersInit)
  // Skip the 401/403 → refresh → retry machinery (e.g. logout, where a 401 just
  // means the session is already gone and refreshing would replay a stale token).
  skipAuthRefresh?: boolean
  // Per-request bearer token, used INSTEAD of the singleton's stored token. For
  // server-side (SSR) requests: avoids reading/mutating the shared singleton (which
  // would leak tokens across concurrent requests). When set, the login gate and the
  // refresh/retry machinery are skipped — a failure just throws so SSR can fall back.
  token?: string
  body?: T
  local?: boolean
}

type InternalFetchOptions<Body = unknown> = {
  url: string
  options?: FetchOptions<Body>
  refreshRetries?: number
  waitLogin?: boolean
}

const isClientSide = typeof window !== 'undefined'

// Where the access token is read/written. Default is localStorage; apps that need
// the token visible to a server (SSR) can swap in `createCookieTokenStorage` via
// `GFWAPI.configure({ tokenStorage })`. Both are SSR-safe (no-op without the global).
export interface TokenStorage {
  get(): string
  set(value: string): void
}

const createLocalStorageTokenStorage = (key: string): TokenStorage => ({
  get: () => (isClientSide ? localStorage.getItem(key) || '' : ''),
  set: (value: string) => {
    if (isClientSide) {
      if (value) {
        localStorage.setItem(key, value)
      } else {
        localStorage.removeItem(key)
      }
    }
  },
})

// JS-readable cookie storage so the access token is sent on requests and readable
// by the server from the request Cookie header (NOT httpOnly — the client reads it
// to build Bearer headers). Server-side it returns '' (no `document`).
export const createCookieTokenStorage = (key: string): TokenStorage => ({
  // Guard on `document` (the global this storage actually uses), not `window`/isClientSide,
  // so it's correct wherever cookies are available and testable for the SSR case.
  get: () => {
    if (typeof document === 'undefined') return ''
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${key}=([^;]+)`))
    return match?.[1] ? decodeURIComponent(match[1]) : ''
  },
  set: (value: string) => {
    if (typeof document === 'undefined') return
    document.cookie = value
      ? `${key}=${encodeURIComponent(value)};path=/;samesite=lax`
      : `${key}=;path=/;max-age=0;samesite=lax`
  },
})

// Injected when an app's token refresh must happen elsewhere (e.g. an SSR server
// function that forwards an httpOnly refresh cookie to the gateway). Returns the
// rotated tokens; the strategy itself is responsible for persisting them.
export type RefreshStrategy = () => Promise<UserTokens>

export type RequestStatus = 'idle' | 'refreshingToken' | 'logging' | 'downloading'
export class GFW_API_CLASS {
  debug: boolean
  apiVersion: ApiVersion
  baseUrl: string
  storageKeys: {
    token: string
    refreshToken: string
  }
  maxRefreshRetries = 1
  maxReloadRetries = 2
  logging: Promise<UserData> | null
  private refreshingToken: Promise<UserTokens> | null = null
  private accessTokenStorage: TokenStorage
  private refreshStrategy: RefreshStrategy | null = null
  status: RequestStatus = 'idle'

  constructor({
    debug = DEBUG_API_REQUESTS,
    baseUrl = API_GATEWAY,
    version = API_VERSION as ApiVersion,
    tokenStorageKey = USER_TOKEN_STORAGE_KEY,
    refreshTokenStorageKey = USER_REFRESH_TOKEN_STORAGE_KEY,
  } = {}) {
    this.debug = debug
    this.baseUrl = baseUrl
    this.apiVersion = version
    this.storageKeys = {
      token: tokenStorageKey,
      refreshToken: refreshTokenStorageKey,
    }
    this.accessTokenStorage = createLocalStorageTokenStorage(tokenStorageKey)
    this.logging = null

    if (debug) {
      console.log('GFWAPI: GFW API Client initialized with the following config', this.getConfig())
    }
  }

  // Opt-in overrides for apps that need a different auth model (e.g. SSR: a cookie
  // access token + a server-function refresh). Default behavior is unchanged for
  // every app that does not call this.
  configure({
    tokenStorage,
    refreshStrategy,
  }: { tokenStorage?: TokenStorage; refreshStrategy?: RefreshStrategy } = {}) {
    if (tokenStorage) {
      this.accessTokenStorage = tokenStorage
    }
    if (refreshStrategy) {
      this.refreshStrategy = refreshStrategy
    }
  }

  get token() {
    return this.accessTokenStorage.get()
  }

  private set token(token: string) {
    this.accessTokenStorage.set(token)
    if (this.debug) {
      console.log('GFWAPI: updated token with', token)
    }
  }

  get refreshToken() {
    if (isClientSide) {
      return localStorage.getItem(this.storageKeys.refreshToken) || ''
    }
    return ''
  }

  private set refreshToken(refreshToken: string) {
    if (isClientSide) {
      if (refreshToken) {
        localStorage.setItem(this.storageKeys.refreshToken, refreshToken)
      } else {
        localStorage.removeItem(this.storageKeys.refreshToken)
      }
    }
    if (this.debug) {
      console.log('GFWAPI: updated refreshToken with', refreshToken)
    }
  }

  getRegisterUrl(callbackUrl: string, { client = 'gfw', locale = '' } = {}) {
    const fallbackLocale =
      locale || (isClientSide ? localStorage.getItem('i18nextLng') : 'en') || 'en'
    return this.generateUrl(
      `/${API_VERSION}/${AUTH_PATH}/${REGISTER_PATH}?client=${client}&callback=${encodeURIComponent(
        callbackUrl
      )}&locale=${fallbackLocale}`,
      { absolute: true }
    )
  }

  getLoginUrl(
    callbackUrl: string,
    { client = 'gfw', locale = '', hideHeader = false } = {} satisfies {
      client?: string
      locale?: string
      hideHeader?: boolean
    }
  ) {
    const fallbackLocale =
      locale || (isClientSide ? localStorage.getItem('i18nextLng') : 'en') || 'en'
    const params = new URLSearchParams({
      client,
      locale: fallbackLocale,
      callback: callbackUrl,
      ...(hideHeader && { hideHeader: 'true' }),
    })
    return this.generateUrl(`/${API_VERSION}/${AUTH_PATH}?${params.toString()}`, { absolute: true })
  }

  getConfig() {
    return {
      debug: this.debug,
      baseUrl: this.baseUrl,
      storageKeys: this.storageKeys,
      token: this.token,
      refreshToken: this.refreshToken,
    }
  }

  // Pure token-endpoint calls: no singleton state, no env guards — safe to call from a
  // server (SSR). Reject with a status-bearing error on non-2xx (via processStatus).
  exchangeAccessToken(accessToken: string): Promise<UserTokens> {
    return fetch(
      this.generateUrl(`/${AUTH_PATH}/tokens?access-token=${accessToken}`, { absolute: true })
    )
      .then(processStatus)
      .then(parseJSON)
  }

  reloadTokens(refreshToken: string): Promise<UserTokens> {
    return fetch(this.generateUrl(`/${AUTH_PATH}/tokens/reload`, { absolute: true }), {
      headers: { 'refresh-token': refreshToken },
    })
      .then(processStatus)
      .then(parseJSON)
  }

  revokeRefreshToken(refreshToken: string): Promise<Response> {
    return fetch(this.generateUrl(`/${AUTH_PATH}/logout`, { absolute: true }), {
      headers: { 'refresh-token': refreshToken },
    }).then(processStatus)
  }

  async getTokensWithAccessToken(accessToken: string): Promise<UserTokens> {
    // We need to avoid requesting tokens from the Login window because the accessToken
    // needs to be used for the first time in the main window
    if (typeof window === 'undefined' || window.opener) {
      return { token: '', refreshToken: '' }
    }
    return this.exchangeAccessToken(accessToken)
  }

  /**
   * AUTH / TOKEN-REFRESH INVARIANTS — each guard below covers a DISTINCT race.
   * Before adding a fix, find which invariant it belongs to and extend that one
   * rather than bolting on a new branch elsewhere.
   *
   * 1. Concurrent requests must trigger ONE refresh        → `refreshingToken` promise dedup (refreshAPIToken).
   * 2. Another tab rotated the token BEFORE we start        → Web Lock + before-flight pre-check (refreshTokens).
   * 3. The token rotates DURING our in-flight reload        → during-flight catch retry (refreshTokens); also the
   *    (and when navigator.locks is unavailable)              ONLY guard without Web Locks — do not remove it.
   * 4. Transient (network/5xx) vs auth (401/403) failure    → `isTransientError` (single source of truth).
   * 5. Wipe tokens ONLY on a real 401 refresh rejection     → `getIsUnauthorizedError(err) && !getIsTimeoutError(err)`
   *    (never on transient/timeout/5xx, never on a 403)        in `attempt`; sets `e.refreshError` for consumers.
   * 6. A stale refresh token must not be replayed on logout → `skipAuthRefresh` + function-valued `headers`.
   *
   * Server-side (SSR): never read/write the shared singleton's token (cross-request
   * leak) — callers pass a per-request `token` via FetchOptions instead.
   */
  // Calls reloadTokens, stores the rotated tokens, and retries transient
  // (network/5xx) failures with backoff. Does NOT retry auth rejections (401/403).
  private async reloadAPIToken(refreshToken: string, reloadRetries = 0): Promise<UserTokens> {
    try {
      const refreshResponse = await this.reloadTokens(refreshToken)
      const { token, refreshToken: newRefreshToken } = refreshResponse
      this.token = token
      this.refreshToken = newRefreshToken
      return refreshResponse
    } catch (e: any) {
      if (isTransientError(e) && reloadRetries < this.maxReloadRetries) {
        if (this.debug) {
          console.log(`GFWAPI: Transient reload failure, retry attempt ${reloadRetries + 1}`)
        }
        await new Promise((resolve) => setTimeout(resolve, 500 * (reloadRetries + 1)))
        return this.reloadAPIToken(refreshToken, reloadRetries + 1)
      }
      throw e
    }
  }

  private async withTokenRefreshLock<T>(run: () => Promise<T>): Promise<T> {
    if (isClientSide && typeof navigator !== 'undefined' && navigator.locks?.request) {
      return navigator.locks.request('gfw-token-refresh', run) as Promise<T>
    }
    return run()
  }

  // Returns the stored refresh token if another tab has rotated it away from the
  // one we started with, otherwise null. Backs both the before-flight pre-check
  // and the during-flight catch in refreshTokens.
  private getRotatedRefreshToken(startedWith: string): string | null {
    const latest = this.refreshToken
    return latest && latest !== startedWith ? latest : null
  }

  private async refreshTokens(startRefreshToken: string): Promise<UserTokens> {
    return this.withTokenRefreshLock(async () => {
      // Another tab rotated the token BEFORE our refresh started: reuse it.
      const rotatedBefore = this.getRotatedRefreshToken(startRefreshToken)
      if (rotatedBefore) {
        return { token: this.token, refreshToken: rotatedBefore }
      }
      try {
        return await this.reloadAPIToken(startRefreshToken)
      } catch (e: any) {
        // The token rotated DURING our in-flight reload (also the only guard when
        // navigator.locks is unavailable): retry once with the newer stored token.
        const rotatedDuring = this.getRotatedRefreshToken(startRefreshToken)
        if (rotatedDuring) {
          return await this.reloadAPIToken(rotatedDuring)
        }
        throw e
      }
    })
  }

  async refreshAPIToken() {
    if (this.refreshingToken) {
      return this.refreshingToken
    }
    // Configured (e.g. SSR/httpOnly) refresh: delegate to the injected strategy. It
    // owns "is there a refresh token?" (it reads an httpOnly cookie this client can't)
    // and persists the rotated tokens. Still deduped here and serialized across tabs.
    if (this.refreshStrategy) {
      const strategy = this.refreshStrategy
      this.status = 'refreshingToken'
      this.refreshingToken = this.withTokenRefreshLock(() => strategy()).finally(() => {
        this.status = 'idle'
        this.refreshingToken = null
      })
      return this.refreshingToken
    }
    const refreshToken = this.refreshToken
    if (!refreshToken) {
      const error: any = new Error('No refresh token')
      error.status = 401
      throw error
    }
    this.status = 'refreshingToken'
    this.refreshingToken = this.refreshTokens(refreshToken).finally(() => {
      this.status = 'idle'
      this.refreshingToken = null
    })
    return this.refreshingToken
  }

  generateUrl(
    url: string,
    { version = this.apiVersion, absolute = false } = {} as {
      version?: ApiVersion
      absolute?: boolean
    }
  ): string {
    if (isUrlAbsolute(url)) {
      return url
    }
    if (url.startsWith(`/${API_VERSION}/`)) {
      return absolute ? `${this.baseUrl}${url}` : url
    }
    const apiVersion = version ?? this.apiVersion
    const prefix = apiVersion ? `/${apiVersion}` : ''

    return absolute ? `${this.baseUrl}${prefix}${url}` : `${prefix}${url}`
  }

  fetch<Response, Body = unknown>(url: string, options: FetchOptions<Body> = {}) {
    return this._internalFetch<Response, Body>({
      url: this.generateUrl(url, { version: options.version }),
      options,
    })
  }

  download(downloadUrl: string, fileName = 'download'): Promise<boolean> {
    this.status = 'downloading'
    return this._internalFetch<Blob>({ url: downloadUrl, options: { responseType: 'blob' } })
      .then(async (blob) => {
        const { saveAs } = await import('file-saver')
        saveAs(blob, fileName)
        this.status = 'idle'
        return true
      })
      .catch((e) => {
        this.status = 'idle'
        return false
      })
  }

  // Raw errors are returned as-is for responseType 'default' (callers want the
  // original Response/object, by identity); everything else gets the parsed shape.
  private normalizeError(e: any, responseType: ResourceResponseType) {
    return responseType === 'default' ? e : parseAPIError(e)
  }

  private async _internalFetch<
    T = Record<string, unknown> | Blob | ArrayBuffer | Response,
    Body = unknown,
  >({
    url,
    options = {},
    refreshRetries = 0,
    waitLogin = true,
  }: InternalFetchOptions<Body>): Promise<T> {
    // A per-request token is a stateless server call — never wait on the client login.
    if (this.logging && waitLogin && options.token == null) {
      // Don't do any request until the login is completed, and don't wait for the
      // login request itself. The gate runs once, not on every retry attempt.
      try {
        await this.logging
      } catch (e: any) {
        if (this.debug) {
          console.log(`Fetch resource executed without login headers in url: ${url}`)
        }
      }
    }
    try {
      return await this.attempt<T, Body>({ url, options, refreshRetries, waitLogin })
    } catch (e: any) {
      if (this.debug) {
        console.warn(`GFWAPI: Error fetching ${url}`, e)
      }
      throw this.normalizeError(e, options.responseType ?? 'json')
    }
  }

  private async attempt<T, Body = unknown>({
    url,
    options = {},
    refreshRetries = 0,
    waitLogin = true,
  }: InternalFetchOptions<Body>): Promise<T> {
    const {
      method = 'GET',
      body = null,
      headers = {},
      responseType = 'json',
      requestType = 'json',
      cache,
      signal,
      local = false,
      skipAuthRefresh = false,
      token,
    } = options
    // A per-request token means a stateless server call: use it for the bearer and
    // skip the client-only refresh/retry machinery (no singleton refresh context).
    const stateless = token != null
    try {
      if (this.debug) {
        console.log(`GFWAPI: Fetching URL: ${url}`)
      }
      // Headers are rebuilt on every attempt so a function-valued `headers` and the
      // Authorization token are re-read after a refresh/rotation, never replayed stale.
      const finalHeaders = {
        ...(typeof headers === 'function' ? headers() : headers),
        ...(requestType === 'json' && { 'Content-Type': 'application/json' }),
        ...(local && {
          'x-gateway-url': API_GATEWAY,
          user: JSON.stringify({
            id: process.env.REACT_APP_LOCAL_API_USER_ID,
            type: process.env.REACT_APP_LOCAL_API_USER_TYPE,
            email: process.env.REACT_APP_LOCAL_API_USER_EMAIL,
          }),
        }),
        Authorization: `Bearer ${token ?? this.token}`,
      }
      const fetchUrl = isUrlAbsolute(url) ? url : this.baseUrl + url
      const data = await fetch(fetchUrl, {
        method,
        signal,
        ...(cache && { cache }),
        ...(body &&
          ({ body: requestType === 'json' ? JSON.stringify(body) : body } as RequestInit)),
        headers: finalHeaders,
      })
        .then((res) => processStatus(res, responseType))
        .then((res) => {
          switch (responseType) {
            case 'default':
              return res
            case 'json':
              return parseJSON(res).catch((e) => {
                // When an error occurs while parsing and
                // http response is no content, returns an
                // empty response instead of an raising error
                if (res.status === 204) return
              })
            case 'blob':
              return res.blob()
            case 'text':
              return res.text()
            case 'arrayBuffer':
              return res.arrayBuffer()
            case 'vessel': {
              return import('./pbf-decoders/vessels-proto').then(({ Track }) => {
                return res.arrayBuffer().then((buffer) => {
                  const track = Track.decode(new Uint8Array(buffer))
                  return track.data
                })
              })
            }
            default:
              return res
          }
        })
      return data
    } catch (e: any) {
      // 401 = not authenticated, 403 = not authorized => try to refresh the token.
      if (refreshRetries > this.maxRefreshRetries) {
        if (this.debug) {
          console.log(`GFWAPI: Attemps to retry the request excedeed`)
          console.warn(`GFWAPI: Error fetching ${url}`, e)
        }
        throw e
      }
      const authError = isAuthError(e)
      if (authError && !skipAuthRefresh && !stateless) {
        if (this.debug) {
          console.log(`GFWAPI: Trying to refresh the token attempt: ${refreshRetries}`)
        }
        try {
          await this.refreshAPIToken()
          if (this.debug) {
            console.log(`GFWAPI: Token refresh worked! trying to fetch again ${url}`)
          }
        } catch (err: any) {
          if (this.debug) {
            console.warn(`GFWAPI: Error fetching ${url}`, err)
          }
          // Wipe tokens only when the refresh was genuinely rejected (a real 401),
          // not on a transient timeout — and flag the original error as a refresh
          // failure so consumers can surface "session expired".
          const refreshRejected = getIsUnauthorizedError(err) && !getIsTimeoutError(err)
          if (isClientSide && refreshRejected) {
            this.token = ''
            this.refreshToken = ''
          }
          if (refreshRejected) {
            e.refreshError = true
          }
          throw e
        }
      }
      if (!stateless && ((authError && !skipAuthRefresh) || e.status >= 500)) {
        return this.attempt<T, Body>({
          url,
          options,
          refreshRetries: refreshRetries + 1,
          waitLogin,
        })
      }
      throw e
    }
  }

  // `token` lets SSR resolve the user from a per-request token without touching the
  // shared singleton's stored token (which would leak across concurrent requests).
  async fetchUser({ token }: { token?: string } = {}) {
    try {
      const user = await this._internalFetch<UserData>({
        url: this.generateUrl(`/${AUTH_PATH}/me`),
        options: { token },
        refreshRetries: 0,
        waitLogin: false,
      })
      return user
    } catch (e: any) {
      console.warn(e)
      throw new Error('Error trying to get user data', { cause: e })
    }
  }

  async fetchGuestUser({ token }: { token?: string } = {}): Promise<UserData> {
    try {
      const permissions: UserPermission[] = await this._internalFetch<
        APIPagination<UserPermission>
      >({
        url: this.generateUrl(`/auth/acl/permissions/anonymous`),
        options: { token },
      }).then((response: APIPagination<UserPermission>) => {
        return response.entries
      })
      const user: UserData = { id: 0, type: GUEST_USER_TYPE, permissions, groups: [] }

      return user
    } catch (e: any) {
      console.warn(e)
      throw new Error('Error trying to get user data', { cause: e })
    }
  }

  async login(params: LoginParams): Promise<UserData> {
    if (this.logging) {
      return this.logging
    }
    const { accessToken = null, refreshToken } = params
    this.status = 'logging'
    // eslint-disable-next-line no-async-promise-executor
    this.logging = new Promise<UserData>(async (resolve, reject) => {
      if (accessToken) {
        if (this.debug) {
          console.log(`GFWAPI: Trying to get tokens using access-token`)
        }
        try {
          const tokens = await this.getTokensWithAccessToken(accessToken)
          this.token = tokens.token
          this.refreshToken = tokens.refreshToken
          if (this.debug) {
            console.log(`GFWAPI: access-token valid, tokens ready`)
          }
        } catch (e: any) {
          if (!this.token && !this.refreshToken) {
            const msg = getIsUnauthorizedError(e)
              ? 'Invalid access token'
              : 'Error trying to generate tokens'
            if (this.debug) {
              console.warn(`GFWAPI: ${msg}`)
            }
            reject(new Error(msg, { cause: e }))
            this.status = 'idle'
            return null
          }
        }
      }

      if (this.token) {
        if (this.debug) {
          console.log(`GFWAPI: Trying to get user with current token`)
        }
        try {
          const user = await this.fetchUser()
          if (this.debug) {
            console.log(`GFWAPI: Token valid, user data ready:`, user)
          }
          resolve(user)
          this.status = 'idle'
          return user
        } catch (e: any) {
          if (this.debug) {
            console.warn('GFWAPI: Token expired, trying to refresh', e)
          }
        }
      }

      const refreshTokenToUse = refreshToken || this.refreshToken
      if (refreshTokenToUse) {
        if (this.debug) {
          console.log(`GFWAPI: Token wasn't valid, trying to refresh`)
        }
        try {
          await this.refreshTokens(refreshTokenToUse)
          if (this.debug) {
            console.log(`GFWAPI: Refresh token OK, fetching user`)
          }
          const user = await this.fetchUser()
          if (this.debug) {
            console.log(`GFWAPI: Login finished, user data ready:`, user)
          }
          resolve(user)
          this.status = 'idle'
          return user
        } catch (e: any) {
          const msg = getIsUnauthorizedError(e)
            ? 'Invalid refresh token'
            : 'Error trying to refreshing the token'
          console.warn(e)
          if (this.debug) {
            console.warn(`GFWAPI: ${msg}`)
          }
          reject(new Error(msg, { cause: e }))
          this.status = 'idle'
          return null
        }
      }
      this.status = 'idle'
      // status 401 so consumers classify "no session" as an auth error (→ guest
      // fallback), not a transient/network failure to retry. Mirrors refreshAPIToken.
      const error: any = new Error('No login token provided')
      error.status = 401
      reject(error)
      return
    }).finally(() => {
      this.logging = null
    })
    return this.logging
  }

  async logout() {
    try {
      if (this.debug) {
        console.log(`GFWAPI: Logout - tokens cleaned`)
      }
      await this._internalFetch<void>({
        url: this.generateUrl(`/${API_VERSION}/${AUTH_PATH}/logout`),
        options: {
          // Re-read the refresh token per attempt and don't refresh on a 401:
          // a logout 401 means the session is already gone, so refreshing would
          // only replay a now-stale token against the server.
          headers: () => ({ 'refresh-token': this.refreshToken }),
          skipAuthRefresh: true,
        },
      })
      if (this.debug) {
        console.log(`GFWAPI: Logout invalid session api OK`)
      }
      return true
    } catch (e: any) {
      if (this.debug) {
        console.warn(`GFWAPI: Logout invalid session fail`)
      }
      throw new Error('Error on the logout proccess', { cause: e })
    } finally {
      // Logout intent is to drop the local session — always clear, even if the
      // server call failed.
      this.token = ''
      this.refreshToken = ''
    }
  }
}

export const GFWAPI = new GFW_API_CLASS()
