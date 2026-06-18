import type {
  APIPagination,
  ResourceRequestType,
  ResourceResponseType,
  UserData,
  UserPermission,
} from '@globalfishingwatch/api-types'

import { getIsBrowser } from './utils/browser'
import {
  getIsTimeoutError,
  getIsUnauthorizedError,
  isAuthError,
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
  }

  private invalidateClientSession() {
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
      console.log('GFWAPI: updated token with', token)
    }
  }

  get refreshToken() {
    if (getIsBrowser()) {
      return localStorage.getItem(this.storageKeys.refreshToken) || ''
    }
    return ''
  }

  private set refreshToken(refreshToken: string) {
    if (getIsBrowser()) {
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

  getRegisterUrl(callbackUrl: string, { client = 'gfw', locale = 'en' } = {}) {
    return this.generateUrl(
      `/${API_VERSION}/${AUTH_PATH}/${REGISTER_PATH}?client=${client}&callback=${encodeURIComponent(
        callbackUrl
      )}&locale=${locale}`,
      { absolute: true }
    )
  }

  getLoginUrl(
    callbackUrl: string,
    { client = 'gfw', locale = 'en', hideHeader = false } = {} satisfies {
      client?: string
      locale?: string
      hideHeader?: boolean
    }
  ) {
    const params = new URLSearchParams({
      client,
      locale,
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
        return { token: this.token, refreshToken: rotatedBefore }
      }
      try {
        return await this.reloadAPIToken(startRefreshToken)
      } catch (e: any) {
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
      // Don't do any request until the login is completed
      try {
        await this.logging
      } catch (e: any) {
        if (this.debug) {
          console.log(`Fetch resource executed without login headers in url: ${url}`)
        }
      }
    }
    try {
      return await this._fetchAttempt<T, Body>({ url, options, refreshRetries, waitLogin })
    } catch (e: any) {
      if (this.debug) {
        console.warn(`GFWAPI: Error fetching ${url}`, e)
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
        console.log(`GFWAPI: Fetching URL: ${url}`)
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
        if (this.debug) {
          console.log(`GFWAPI: Attemps to retry the request excedeed`)
          console.warn(`GFWAPI: Error fetching ${url}`, e)
        }
        throw e
      }
      const authError = isAuthError(e)
      const stateless = token != null
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
            console.warn(`GFWAPI: Error refreshing the token ${url}`, err)
          }

          const refreshRejected = getIsUnauthorizedError(err) && !getIsTimeoutError(err)
          if (getIsBrowser() && refreshRejected) {
            this.invalidateClientSession()
          }
          if (refreshRejected) {
            e.refreshError = true
          }
          throw e
        }
      }
      if (!stateless && ((authError && !skipAuthRefresh) || e.status >= 500)) {
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

  private async _login({
    accessToken,
    refreshToken,
  }: {
    accessToken: string | null
    refreshToken?: string | null
  }): Promise<UserData> {
    try {
      if (accessToken) {
        if (this.debug) {
          console.log(`GFWAPI: Trying to get tokens using access-token`)
        }
        try {
          const tokens = await this.exchangeAccessToken(accessToken)
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
            throw new Error(msg, { cause: e })
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
          return user
        } catch (e: any) {
          if (this.debug) {
            console.warn('GFWAPI: Token expired, trying to refresh', e)
          }
        }
      }

      const refreshTokenToUse = refreshToken || this.refreshToken
      const canRefresh = this.refreshStrategy || refreshTokenToUse
      if (canRefresh) {
        if (this.debug) {
          console.log(`GFWAPI: Token wasn't valid, trying to refresh`)
        }
        try {
          if (this.refreshStrategy) {
            await this.refreshAPIToken()
          } else {
            await this.refreshTokens(refreshTokenToUse)
          }
          if (this.debug) {
            console.log(`GFWAPI: Refresh token OK, fetching user`)
          }
          const user = await this.fetchUser()
          if (this.debug) {
            console.log(`GFWAPI: Login finished, user data ready:`, user)
          }
          return user
        } catch (e: any) {
          const msg = getIsUnauthorizedError(e)
            ? 'Invalid refresh token'
            : 'Error trying to refreshing the token'
          console.warn(e)
          if (this.debug) {
            console.warn(`GFWAPI: ${msg}`)
          }
          throw new Error(msg, { cause: e })
        }
      }

      // status 401 so consumers classify "no session" as an auth error (→ guest
      // fallback), not a transient/network failure to retry. Mirrors refreshAPIToken.
      const error: any = new Error('No login token provided')
      error.status = 401
      throw error
    } finally {
      this.status = 'idle'
    }
  }

  async login(params: LoginParams): Promise<UserData> {
    if (this.logging) {
      return this.logging
    }
    const { accessToken = null, refreshToken } = params
    this.status = 'logging'
    this.logging = this._login({ accessToken, refreshToken }).finally(() => {
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
      // server call failed (incl. httpOnly cookies via sessionInvalidateStrategy).
      this.invalidateClientSession()
    }
  }
}

export const GFWAPI = new GFW_API_CLASS()
