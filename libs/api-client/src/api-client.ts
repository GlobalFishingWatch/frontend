import type {
  APIPagination,
  ResourceRequestType,
  ResourceResponseType,
  UserData,
  UserPermission,
} from '@globalfishingwatch/api-types'

import { getIsBrowser, logDebugUrl } from './utils/browser'
import {
  getIsTimeoutError,
  getIsUnauthorizedError,
  isAuthError,
  isForbidden,
  isSessionError,
  isTransientError,
  parseAPIError,
} from './utils/errors'
import { parseJSON, processStatus } from './utils/parse'
import type { TokenStorage } from './utils/token-storage'
import { createLocalStorageTokenStorage } from './utils/token-storage'
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
  body?: T
  cache?: RequestCache
  // Static headers or a function to avoid stale values between requests (e.g. a rotating refresh-token)
  headers?: HeadersInit | (() => HeadersInit)
  local?: boolean
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  requestType?: ResourceRequestType
  responseType?: ResourceResponseType
  token?: string
  version?: ApiVersion
}

type InternalFetchOptions<Body = unknown> = {
  url: string
  options?: FetchOptions<Body> & { skipAuthRefresh?: boolean }
  refreshRetries?: number
  waitLogin?: boolean
}

export type RefreshStrategy = () => Promise<UserTokens>
export type SessionInvalidateStrategy = () => void | Promise<unknown>

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
  private refreshTokenStorage: TokenStorage
  private refreshStrategy: RefreshStrategy | null = null
  private sessionInvalidateStrategy: SessionInvalidateStrategy | null = null
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
    this.refreshTokenStorage = createLocalStorageTokenStorage(refreshTokenStorageKey)
    this.logging = null

    if (debug) {
      console.log('GFWAPI: GFW API Client initialized with the following config', this.getConfig())
    }
  }

  private debugLog(...args: unknown[]) {
    if (this.debug) {
      console.log(...args)
    }
  }

  private debugWarn(...args: unknown[]) {
    if (this.debug) {
      console.warn(...args)
    }
  }

  private debugAuthState(label: string) {
    if (!this.debug) return
    this.debugLog(`GFWAPI: ${label}`, {
      hasAccessToken: Boolean(this.token),
      hasLocalRefreshToken: Boolean(this.refreshToken),
      hasRefreshStrategy: Boolean(this.refreshStrategy),
      hasSessionInvalidateStrategy: Boolean(this.sessionInvalidateStrategy),
      status: this.status,
      loginInProgress: Boolean(this.logging),
      refreshInProgress: Boolean(this.refreshingToken),
    })
  }

  // Opt-in overrides for apps that need a different auth model (e.g. SSR: a cookie
  // access token + a server-function refresh). Default behavior is unchanged for
  // every app that does not call this.
  configure({
    tokenStorage,
    refreshStrategy,
    sessionInvalidateStrategy,
  }: {
    tokenStorage?: TokenStorage
    refreshStrategy?: RefreshStrategy
    sessionInvalidateStrategy?: SessionInvalidateStrategy
  } = {}) {
    if (tokenStorage) {
      this.accessTokenStorage = tokenStorage
    }
    if (refreshStrategy) {
      this.refreshStrategy = refreshStrategy
    }
    if (sessionInvalidateStrategy) {
      this.sessionInvalidateStrategy = sessionInvalidateStrategy
    }
    if (this.debug) {
      this.debugLog('GFWAPI: configure()', {
        tokenStorage: Boolean(tokenStorage),
        refreshStrategy: Boolean(refreshStrategy),
        sessionInvalidateStrategy: Boolean(sessionInvalidateStrategy),
      })
    }
  }

  private invalidateClientSession() {
    if (this.debug) {
      this.debugLog('GFWAPI: invalidateClientSession — clearing local session')
    }
    this.token = ''
    this.refreshToken = ''
    void this.sessionInvalidateStrategy?.()
  }

  get token() {
    return this.accessTokenStorage.get()
  }

  private set token(token: string) {
    this.accessTokenStorage.set(token)
    if (this.debug) {
      this.debugLog('GFWAPI: updated token with', token)
    }
  }

  get refreshToken() {
    if (this.refreshStrategy) {
      return ''
    }
    return this.refreshTokenStorage.get()
  }

  private set refreshToken(refreshToken: string) {
    if (!this.refreshStrategy) {
      this.refreshTokenStorage.set(refreshToken)
    }
    if (this.debug) {
      this.debugLog('GFWAPI: updated refreshToken with', refreshToken)
    }
  }

  private getStoredLocale(): string {
    if (getIsBrowser()) {
      return localStorage.getItem('i18nextLng') || 'en'
    }
    return 'en'
  }

  getRegisterUrl(callbackUrl: string, { client = 'gfw', locale = '' } = {}) {
    const resolvedLocale = locale || this.getStoredLocale()
    return this.generateUrl(
      `/${API_VERSION}/${AUTH_PATH}/${REGISTER_PATH}?client=${client}&callback=${encodeURIComponent(
        callbackUrl
      )}&locale=${resolvedLocale}`,
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
    const params = new URLSearchParams({
      client,
      locale: locale || this.getStoredLocale(),
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

  exchangeAccessToken(accessToken: string, headers: HeadersInit = {}): Promise<UserTokens> {
    if (this.debug) {
      this.debugLog('GFWAPI: exchangeAccessToken')
    }
    return fetch(
      this.generateUrl(`/${AUTH_PATH}/tokens?access-token=${accessToken}`, { absolute: true }),
      {
        headers,
      }
    )
      .then(processStatus)
      .then(parseJSON)
  }

  reloadTokens(refreshToken: string, headers: HeadersInit = {}): Promise<UserTokens> {
    if (this.debug) {
      this.debugLog('GFWAPI: reloadTokens', { hasRefreshToken: Boolean(refreshToken) })
    }
    return fetch(this.generateUrl(`/${AUTH_PATH}/tokens/reload`, { absolute: true }), {
      headers: { ...headers, 'refresh-token': refreshToken },
    })
      .then(processStatus)
      .then(parseJSON)
  }

  revokeRefreshToken(refreshToken: string, headers: HeadersInit = {}): Promise<Response> {
    if (this.debug) {
      this.debugLog('GFWAPI: revokeRefreshToken', { hasRefreshToken: Boolean(refreshToken) })
    }
    return fetch(this.generateUrl(`/${AUTH_PATH}/logout`, { absolute: true }), {
      headers: { ...headers, 'refresh-token': refreshToken },
    }).then(processStatus)
  }

  private async reloadAPIToken(refreshToken: string, reloadRetries = 0): Promise<UserTokens> {
    try {
      const refreshResponse = await this.reloadTokens(refreshToken)
      const { token, refreshToken: newRefreshToken } = refreshResponse
      this.token = token
      this.refreshToken = newRefreshToken
      return refreshResponse
    } catch (e: any) {
      if (isTransientError(e) && reloadRetries < this.maxReloadRetries) {
        this.debugLog(`GFWAPI: Transient reload failure, retry attempt ${reloadRetries + 1}`)
        await new Promise((resolve) => setTimeout(resolve, 500 * (reloadRetries + 1)))
        return this.reloadAPIToken(refreshToken, reloadRetries + 1)
      }
      this.debugWarn('GFWAPI: reloadAPIToken failed', e)
      throw e
    }
  }

  private async withTokenRefreshLock<T>(run: () => Promise<T>): Promise<T> {
    if (getIsBrowser() && typeof navigator !== 'undefined' && navigator.locks?.request) {
      return navigator.locks.request('gfw-token-refresh', run) as Promise<T>
    }
    return run()
  }

  private getRotatedRefreshToken(startedWith: string): string | null {
    const latest = this.refreshToken
    return latest && latest !== startedWith ? latest : null
  }

  private async refreshTokens(startRefreshToken: string): Promise<UserTokens> {
    return this.withTokenRefreshLock(async () => {
      const rotatedBefore = this.getRotatedRefreshToken(startRefreshToken)
      if (rotatedBefore) {
        this.debugLog(
          'GFWAPI: refreshTokens — reusing token rotated by another tab (before reload)'
        )
        return { token: this.token, refreshToken: rotatedBefore }
      }
      try {
        return await this.reloadAPIToken(startRefreshToken)
      } catch (e: any) {
        const rotatedDuring = this.getRotatedRefreshToken(startRefreshToken)
        if (rotatedDuring) {
          this.debugLog('GFWAPI: refreshTokens — retrying with token rotated during reload')
          return await this.reloadAPIToken(rotatedDuring)
        }
        throw e
      }
    })
  }

  async refreshAPIToken() {
    if (this.refreshingToken) {
      this.debugLog('GFWAPI: refreshAPIToken — joining in-flight refresh')
      return this.refreshingToken
    }

    if (this.refreshStrategy) {
      this.debugAuthState('refreshAPIToken — via refreshStrategy')
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
      this.debugWarn('GFWAPI: refreshAPIToken — no local refresh token')
      const error: any = new Error('No refresh token')
      error.status = 401
      throw error
    }

    this.debugAuthState('refreshAPIToken — via localStorage reload')
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
        return true
      })
      .catch((e) => {
        return false
      })
      .finally(() => {
        this.status = 'idle'
      })
  }

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
    if (this.logging && waitLogin && options.token == null) {
      this.debugLog('GFWAPI: waiting for login before fetch', { url })
      try {
        await this.logging
        this.debugLog('GFWAPI: login settled, continuing fetch', { url })
      } catch {
        this.debugLog('GFWAPI: login failed — fetch continues without session', { url })
      }
    }
    try {
      return await this._fetchAttempt<T, Body>({ url, options, refreshRetries, waitLogin })
    } catch (e: any) {
      if (this.debug) {
        this.debugWarn(`GFWAPI: Error fetching ${url}`, e)
      }
      throw this.normalizeError(e, options.responseType ?? 'json')
    }
  }

  private async _fetchAttempt<T, Body = unknown>({
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
    try {
      if (this.debug) {
        logDebugUrl('GFWAPI: Fetching URL: ', url)
        if (token != null) {
          this.debugLog('GFWAPI: stateless fetch (per-request token, no refresh/retry)')
        }
      }
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
        this.debugLog(`GFWAPI: retry attempts exceeded for ${url}`)
        this.debugWarn(`GFWAPI: Error fetching ${url}`, e)
        throw e
      }
      const authError = isAuthError(e)
      const stateless = token != null
      if (authError && skipAuthRefresh) {
        this.debugLog('GFWAPI: auth error — skipAuthRefresh, not retrying', {
          url,
          status: e.status,
        })
      }
      if (authError && stateless) {
        this.debugLog('GFWAPI: auth error — stateless request, not refreshing', {
          url,
          status: e.status,
        })
      }
      if (authError && !skipAuthRefresh && !stateless) {
        this.debugLog(`GFWAPI: auth error — refreshing token (attempt ${refreshRetries})`, {
          url,
          status: e.status,
        })
        try {
          await this.refreshAPIToken()
          if (this.debug) {
            logDebugUrl('GFWAPI: Token refresh worked! trying to fetch again ', url)
          }
        } catch (err: any) {
          this.debugWarn(`GFWAPI: token refresh failed for ${url}`, err)

          const refreshRejected =
            isSessionError(err) && !isForbidden(err) && !getIsTimeoutError(err)
          if (getIsBrowser() && refreshRejected) {
            this.debugLog('GFWAPI: refresh rejected — invalidating client session')
            this.invalidateClientSession()
          }
          if (refreshRejected) {
            e.refreshError = true
            this.debugLog('GFWAPI: marking original error as refreshError')
          }
          throw e
        }
      }
      if (!stateless && ((authError && !skipAuthRefresh) || e.status >= 500)) {
        this.debugLog(`GFWAPI: retrying fetch (attempt ${refreshRetries + 1})`, {
          url,
          reason: authError ? 'auth' : '5xx',
          status: e.status,
        })
        return this._fetchAttempt<T, Body>({
          url,
          options,
          refreshRetries: refreshRetries + 1,
          waitLogin,
        })
      }
      throw e
    }
  }

  async fetchUser({ token, headers }: { token?: string; headers?: HeadersInit } = {}) {
    if (this.debug) {
      this.debugLog('GFWAPI: fetchUser', { stateless: token != null, hasToken: Boolean(token) })
    }
    try {
      const user = await this._internalFetch<UserData>({
        url: this.generateUrl(`/${AUTH_PATH}/me`),
        options: {
          token,
          headers,
        },
        refreshRetries: 0,
        waitLogin: false,
      })
      this.debugLog('GFWAPI: fetchUser OK', { userId: user?.id, type: user?.type })
      return user
    } catch (e: any) {
      this.debugWarn('GFWAPI: fetchUser failed', e)
      throw new Error('Error trying to get user data', { cause: e })
    }
  }

  async fetchGuestUser({ token }: { token?: string } = {}): Promise<UserData> {
    if (this.debug) {
      this.debugLog('GFWAPI: fetchGuestUser', { stateless: token != null })
    }
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

      this.debugLog('GFWAPI: fetchGuestUser OK', { permissions: permissions.length })
      return user
    } catch (e: any) {
      this.debugWarn('GFWAPI: fetchGuestUser failed', e)
      throw new Error('Error trying to get user data', { cause: e })
    }
  }

  private async _login({
    accessToken,
    refreshToken,
  }: {
    accessToken: string | null
    refreshToken?: string | null
  }): Promise<UserData> {
    this.debugAuthState('_login start')
    try {
      if (accessToken) {
        this.debugLog('GFWAPI: _login — exchanging SSO access token')
        try {
          const tokens = await this.exchangeAccessToken(accessToken)
          this.token = tokens.token
          this.refreshToken = tokens.refreshToken
          this.debugLog('GFWAPI: _login — access token exchanged, tokens stored')
        } catch (e: any) {
          if (!this.token && !this.refreshToken) {
            const msg = getIsUnauthorizedError(e)
              ? 'Invalid access token'
              : 'Error trying to generate tokens'
            this.debugWarn(`GFWAPI: _login — ${msg}`, e)
            throw new Error(msg, { cause: e })
          }
          this.debugLog(
            'GFWAPI: _login — access token exchange failed, falling back to stored tokens'
          )
        }
      }

      if (this.token) {
        this.debugLog('GFWAPI: _login — fetching user with stored access token')
        try {
          const user = await this.fetchUser()
          this.debugLog('GFWAPI: _login — user resolved with access token', {
            userId: user?.id,
            type: user?.type,
          })
          return user
        } catch (e: any) {
          this.debugWarn('GFWAPI: _login — access token rejected, will try refresh', e)
        }
      }

      const refreshTokenToUse = refreshToken || this.refreshToken
      const canRefresh = this.refreshStrategy
        ? Boolean(this.token || refreshTokenToUse)
        : Boolean(refreshTokenToUse)
      this.debugLog('GFWAPI: _login — refresh decision', {
        canRefresh,
        viaRefreshStrategy: Boolean(this.refreshStrategy),
        hasAccessToken: Boolean(this.token),
        hasLocalRefreshToken: Boolean(refreshTokenToUse),
      })
      if (canRefresh) {
        this.debugLog(
          `GFWAPI: _login — refreshing via ${this.refreshStrategy ? 'refreshStrategy' : 'localStorage'}`
        )
        try {
          if (this.refreshStrategy) {
            await this.refreshAPIToken()
          } else {
            await this.refreshTokens(refreshTokenToUse)
          }
          this.debugLog('GFWAPI: _login — refresh OK, fetching user')
          const user = await this.fetchUser()
          this.debugLog('GFWAPI: _login — user resolved after refresh', {
            userId: user?.id,
            type: user?.type,
          })
          return user
        } catch (e: any) {
          const msg = isSessionError(e)
            ? 'Invalid refresh token'
            : 'Error trying to refreshing the token'
          this.debugWarn(`GFWAPI: _login — ${msg}`, e)
          throw new Error(msg, { cause: e })
        }
      }

      this.debugWarn('GFWAPI: _login — no session (no token and refresh not attempted)')
      // status 401 so consumers classify "no session" as an auth error (→ guest
      // fallback), not a transient/network failure to retry. Mirrors refreshAPIToken.
      const error: any = new Error('No login token provided')
      error.status = 401
      throw error
    } finally {
      this.status = 'idle'
      this.debugLog('GFWAPI: _login finished')
    }
  }

  async login(params: LoginParams): Promise<UserData> {
    if (this.logging) {
      this.debugLog('GFWAPI: login — joining in-flight login')
      return this.logging
    }
    const { accessToken = null, refreshToken } = params
    this.debugAuthState('login start')
    this.status = 'logging'
    this.logging = this._login({ accessToken, refreshToken }).finally(() => {
      this.logging = null
    })
    return this.logging
  }

  async logout() {
    this.debugAuthState('logout start')
    try {
      this.debugLog('GFWAPI: logout — revoking session on gateway')
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
      this.debugLog('GFWAPI: logout — gateway OK')
      return true
    } catch (e: any) {
      this.debugWarn('GFWAPI: logout — gateway call failed (local session still cleared)', e)
      throw new Error('Error on the logout proccess', { cause: e })
    } finally {
      this.invalidateClientSession()
      this.debugLog('GFWAPI: logout finished')
    }
  }
}

export const GFWAPI = new GFW_API_CLASS()
