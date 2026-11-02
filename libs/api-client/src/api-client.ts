import type {
  APIPagination,
  ResourceRequestType,
  ResourceResponseType,
  UserData,
  UserPermission,
} from '@globalfishingwatch/api-types'

import { getIsBrowser, logDebugUrl, safeLocalStorage } from './utils/browser'
import { getEnv } from './utils/env'
import {
  getIsRateLimitExceeded,
  getIsTimeoutError,
  getIsUnauthorizedError,
  isAuthError,
  isForbidden,
  isSessionError,
  isTransientError,
  parseAPIError,
} from './utils/errors'
import { parseJSON, processStatus } from './utils/parse'
import {
  getRateLimitDataset,
  getRateLimitLogUrl,
  isVisualizationRateLimitedUrl,
  parseRateLimit,
} from './utils/rate-limit'
import type { TokenStorage } from './utils/token-storage'
import { createLocalStorageTokenStorage } from './utils/token-storage'
import { renderRateLimitChallenge } from './utils/turnstile'
import { isUrlAbsolute } from './utils/url'
import {
  API_GATEWAY,
  API_VERSION,
  AUTH_PATH,
  DEBUG_API_REQUESTS,
  type DebugMode,
  GUEST_USER_TYPE,
  LOGOUT_SESSION_PATH,
  REGISTER_PATH,
  SETTINGS_PATH,
  USER_REFRESH_TOKEN_STORAGE_KEY,
  USER_TOKEN_STORAGE_KEY,
  VISUALIZE_LIMIT_RESET_PATH,
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
  rateLimitRetried?: boolean
}

export type RefreshStrategy = () => Promise<UserTokens>
export type SessionInvalidateStrategy = () => void | Promise<unknown>

export type RequestStatus = 'idle' | 'refreshingToken' | 'logging' | 'downloading'
export type RateLimitChallengeState = 'idle' | 'solving' | 'interactive' | 'failed' | 'cancelled'

export class GFW_API_CLASS {
  debug: DebugMode
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
  private defaultHeaders: HeadersInit = {}
  private rateLimitChallengeContainer: HTMLElement | null = null
  // Per dataset, the API limits each one separately. Settles once that dataset is reset (resolve) or
  // the user cancels (reject). Survives failed attempts so parked requests keep waiting while the
  // user retries. Insertion order is the challenge queue, one reset call per dataset
  private rateLimitResets = new Map<string, PromiseWithResolvers<void>>()
  // Hit the limit and not reset yet, kept after a cancel so the user can start the challenge again
  private rateLimitedDatasets = new Set<string>()
  private rateLimitChallengeAttempt: Promise<void> | null = null
  // Bumped to invalidate an attempt whose container went away, its late results are ignored
  private rateLimitChallengeAttemptId = 0
  private rateLimitResetListeners = new Set<(dataset: string) => void>()
  private rateLimitChallengeState: RateLimitChallengeState = 'idle'
  private rateLimitChallengeListeners = new Set<() => void>()
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

    if (this.isDebugging('request')) {
      console.log('GFWAPI: GFW API Client initialized with the following config', this.getConfig())
    }
  }

  private isDebugging(scope: Exclude<DebugMode, boolean>) {
    return this.debug === true || this.debug === scope
  }

  private debugLog(...args: unknown[]) {
    if (this.isDebugging('request')) {
      console.log(...args)
    }
  }

  private debugWarn(...args: unknown[]) {
    if (this.isDebugging('request')) {
      console.warn(...args)
    }
  }

  // Arrow function so it can be handed to the Turnstile helpers; filter the console by "[rate-limit]"
  /** Token storage, refresh, login, logout and session logs; filter the console by "[auth]" */
  private debugAuth(message: string, data?: unknown) {
    if (this.isDebugging('auth')) {
      console.log(`[auth] ${message}`, ...(data !== undefined ? [data] : []))
    }
  }

  private debugAuthWarn(message: string, data?: unknown) {
    if (this.isDebugging('auth')) {
      console.warn(`[auth] ${message}`, ...(data !== undefined ? [data] : []))
    }
  }

  private debugRateLimit = (message: string, data?: Record<string, unknown>) => {
    if (this.isDebugging('rate-limit')) {
      console.log(`[rate-limit] ${message}`, ...(data ? [data] : []))
    }
  }

  private debugAuthState(label: string) {
    if (this.isDebugging('auth')) {
      this.debugAuth(label, {
        hasAccessToken: Boolean(this.token),
        hasLocalRefreshToken: Boolean(this.refreshToken),
        hasRefreshStrategy: Boolean(this.refreshStrategy),
        hasSessionInvalidateStrategy: Boolean(this.sessionInvalidateStrategy),
        status: this.status,
        loginInProgress: Boolean(this.logging),
        refreshInProgress: Boolean(this.refreshingToken),
      })
    }
  }

  configure({
    baseUrl,
    tokenStorage,
    refreshStrategy,
    sessionInvalidateStrategy,
    defaultHeaders,
    debug,
  }: {
    baseUrl?: string
    tokenStorage?: TokenStorage
    refreshStrategy?: RefreshStrategy
    sessionInvalidateStrategy?: SessionInvalidateStrategy
    defaultHeaders?: HeadersInit
    debug?: DebugMode
  } = {}) {
    if (debug !== undefined) {
      this.debug = debug
    }

    if (baseUrl) {
      this.baseUrl = baseUrl
    }
    if (tokenStorage) {
      this.accessTokenStorage = tokenStorage
    }
    if (refreshStrategy) {
      this.refreshStrategy = refreshStrategy
    }
    if (sessionInvalidateStrategy) {
      this.sessionInvalidateStrategy = sessionInvalidateStrategy
    }
    if (defaultHeaders) {
      this.defaultHeaders = defaultHeaders
    }
    if (this.isDebugging('request')) {
      this.debugLog('GFWAPI: configure()', {
        baseUrl: Boolean(baseUrl),
        tokenStorage: Boolean(tokenStorage),
        refreshStrategy: Boolean(refreshStrategy),
        sessionInvalidateStrategy: Boolean(sessionInvalidateStrategy),
      })
    }
  }

  setRateLimitChallengeContainer(container: HTMLElement) {
    if (container !== this.rateLimitChallengeContainer) {
      this.rateLimitChallengeContainer = container
      this.debugRateLimit('challenge container set')
      if (this.rateLimitResets.size && this.rateLimitChallengeState !== 'failed') {
        this.debugRateLimit('challenge moved to the new container')
        this.invalidateRateLimitChallengeAttempt()
        this.runRateLimitChallengeAttempt(container)
      }
    }
  }

  clearRateLimitChallengeContainer(container: HTMLElement) {
    if (container !== this.rateLimitChallengeContainer) {
      this.debugRateLimit('challenge container clear ignored, another container took over')
      return
    }
    this.rateLimitChallengeContainer = null
    this.debugRateLimit('challenge container removed')
    if (this.rateLimitResets.size) {
      // No UI left to solve, retry or cancel the challenge: release parked requests with their 429
      this.debugRateLimit('challenge abandoned, parked requests rejected')
      this.invalidateRateLimitChallengeAttempt()
      this.rejectRateLimitResets(new Error('GFWAPI: rate limit challenge container removed'))
      this.setRateLimitChallengeState('idle')
    }
  }

  private rejectRateLimitResets(error: Error) {
    this.rateLimitResets.forEach((reset) => reset.reject(error))
    this.rateLimitResets.clear()
  }

  private invalidateRateLimitChallengeAttempt() {
    this.rateLimitChallengeAttemptId++
    this.rateLimitChallengeAttempt = null
  }

  subscribeRateLimitChallenge = (listener: () => void) => {
    this.rateLimitChallengeListeners.add(listener)
    return () => {
      this.rateLimitChallengeListeners.delete(listener)
    }
  }

  getRateLimitChallengeState = () => this.rateLimitChallengeState

  onRateLimitReset = (listener: (dataset: string) => void) => {
    this.rateLimitResetListeners.add(listener)
    return () => {
      this.rateLimitResetListeners.delete(listener)
    }
  }

  /** Resets every dataset that hit the limit, resolves once all of them are reset */
  startRateLimitChallenge = () => {
    this.debugRateLimit('challenge requested by the user', {
      datasets: [...this.rateLimitedDatasets],
    })
    return Promise.all(
      [...this.rateLimitedDatasets].map((dataset) => this.ensureRateLimitChallenge(dataset))
    ).then(() => {})
  }

  private setRateLimitChallengeState(state: RateLimitChallengeState) {
    this.debugRateLimit(`challenge state ${this.rateLimitChallengeState} -> ${state}`)
    this.rateLimitChallengeState = state
    this.rateLimitChallengeListeners.forEach((listener) => listener())
  }

  private ensureRateLimitChallenge(dataset: string): Promise<void> {
    const container = this.rateLimitChallengeContainer
    if (!container) {
      this.debugRateLimit('challenge skipped: no container')
      return Promise.reject(new Error('GFWAPI: no rate limit challenge container'))
    }
    const pending = this.rateLimitResets.get(dataset)
    if (pending) {
      this.debugRateLimit('challenge already queued, joining it', { dataset })
      return pending.promise
    }
    this.debugRateLimit('challenge queued', { dataset })
    const reset = Promise.withResolvers<void>()
    reset.promise.catch(() => {})
    this.rateLimitResets.set(dataset, reset)
    // After a failure the queue waits for the user to retry or cancel
    if (this.rateLimitChallengeState !== 'failed') {
      this.runRateLimitChallengeAttempt(container)
    }
    return reset.promise
  }

  private runRateLimitChallengeAttempt(container: HTMLElement) {
    // One at a time: each reset needs its own single-use token
    const dataset = this.rateLimitResets.keys().next().value
    if (this.rateLimitChallengeAttempt || !dataset) {
      return
    }
    const attemptId = ++this.rateLimitChallengeAttemptId
    const isStale = () => attemptId !== this.rateLimitChallengeAttemptId

    this.setRateLimitChallengeState('solving')
    this.rateLimitChallengeAttempt = (async () => {
      try {
        const captchaToken = await renderRateLimitChallenge(container, {
          debug: this.debugRateLimit,
          onInteractive: () => {
            if (!isStale()) this.setRateLimitChallengeState('interactive')
          },
        })
        if (isStale()) return
        const url = this.generateUrl(`/${VISUALIZE_LIMIT_RESET_PATH}`, { absolute: true })
        this.debugRateLimit('reset request sent', { url, dataset })
        const response = await this._internalFetch<Response>({
          url,
          options: {
            method: 'POST',
            body: { dataset, captchaToken },
            responseType: 'default',
          },
        })
        if (isStale()) return
        this.debugRateLimit('reset succeeded', {
          dataset,
          status: response.status,
          ...parseRateLimit(response),
        })
        this.rateLimitResets.get(dataset)?.resolve()
        this.rateLimitResets.delete(dataset)
        this.rateLimitedDatasets.delete(dataset)
        if (!this.rateLimitResets.size) this.setRateLimitChallengeState('idle')
        // A failing listener must not skip the others nor turn this successful reset into 'failed'
        this.rateLimitResetListeners.forEach((listener) => {
          try {
            listener(dataset)
          } catch (e) {
            this.debugRateLimit('reset listener failed', { error: (e as Error)?.message })
          }
        })
      } catch (e: any) {
        if (isStale()) return
        this.debugRateLimit('challenge failed, waiting for the user to retry or cancel', {
          error: e?.message ?? e?.status ?? e,
        })
        this.setRateLimitChallengeState('failed')
      } finally {
        if (!isStale()) {
          this.rateLimitChallengeAttempt = null
          // Next dataset in the queue, if any
          if (
            this.rateLimitResets.size &&
            this.rateLimitChallengeState !== 'failed' &&
            this.rateLimitChallengeContainer
          ) {
            this.runRateLimitChallengeAttempt(this.rateLimitChallengeContainer)
          }
        }
      }
    })()
  }

  retryRateLimitChallenge = () => {
    if (this.rateLimitChallengeState === 'failed' && this.rateLimitChallengeContainer) {
      this.debugRateLimit('challenge retried by the user')
      this.runRateLimitChallengeAttempt(this.rateLimitChallengeContainer)
    }
  }

  /** Gives up after a failure: parked requests reject with their original 429 */
  cancelRateLimitChallenge = () => {
    if (this.rateLimitChallengeState === 'failed') {
      this.debugRateLimit('challenge cancelled by the user')
      this.rejectRateLimitResets(new Error('GFWAPI: rate limit challenge cancelled'))
      this.setRateLimitChallengeState('cancelled')
    }
  }

  private logRateLimit(url: string, response: Response) {
    if (
      !this.rateLimitChallengeContainer ||
      !isVisualizationRateLimitedUrl(url) ||
      !response.headers?.has('Ratelimit-Remaining')
    ) {
      return
    }
    const dataset = getRateLimitDataset(url)
    if (!dataset) return
    const { remaining, limit } = parseRateLimit(response)
    this.debugRateLimit('response', {
      url: getRateLimitLogUrl(url),
      dataset,
      status: response.status,
      remaining,
      limit,
    })
  }

  private waitForRateLimitChallenge(dataset: string, signal?: AbortSignal | null) {
    const challenge = this.ensureRateLimitChallenge(dataset)
    if (!signal) return challenge
    return Promise.race([
      challenge,
      new Promise<never>((_, reject) => {
        if (signal.aborted) reject(signal.reason)
        signal.addEventListener('abort', () => reject(signal.reason), { once: true })
      }),
    ])
  }

  private invalidateClientSession() {
    if (this.isDebugging('auth')) {
      this.debugAuth('invalidateClientSession — clearing local session')
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
    if (this.isDebugging('auth')) {
      this.debugAuth('updated token with', token)
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
    if (this.isDebugging('auth')) {
      this.debugAuth('updated refreshToken with', refreshToken)
    }
  }

  private getStoredLocale(): string {
    return safeLocalStorage.get('i18nextLng') || 'en'
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

  getSettingsUrl(
    callbackUrl: string,
    { client = 'gfw', locale = '' } = {} satisfies {
      client?: string
      locale?: string
    }
  ) {
    const params = new URLSearchParams({
      client,
      locale: locale || this.getStoredLocale(),
      callback: callbackUrl,
    })
    return this.generateUrl(`/${API_VERSION}/${AUTH_PATH}/${SETTINGS_PATH}?${params.toString()}`, {
      absolute: true,
    })
  }

  getLogoutSessionUrl(
    { client = 'gfw', locale = '' } = {} satisfies {
      client?: string
      locale?: string
    }
  ) {
    const params = new URLSearchParams({
      client,
      locale: locale || this.getStoredLocale(),
    })
    return this.generateUrl(
      `/${API_VERSION}/${AUTH_PATH}/${LOGOUT_SESSION_PATH}?${params.toString()}`,
      { absolute: true }
    )
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
    if (this.isDebugging('auth')) {
      this.debugAuth('exchangeAccessToken')
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
    if (this.isDebugging('auth')) {
      this.debugAuth('reloadTokens', { hasRefreshToken: Boolean(refreshToken) })
    }
    return fetch(this.generateUrl(`/${AUTH_PATH}/tokens/reload`, { absolute: true }), {
      headers: { ...headers, 'refresh-token': refreshToken },
    })
      .then(processStatus)
      .then(parseJSON)
  }

  revokeRefreshToken(refreshToken: string, headers: HeadersInit = {}): Promise<Response> {
    if (this.isDebugging('auth')) {
      this.debugAuth('revokeRefreshToken', { hasRefreshToken: Boolean(refreshToken) })
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
        this.debugAuth(`Transient reload failure, retry attempt ${reloadRetries + 1}`)
        await new Promise((resolve) => setTimeout(resolve, 500 * (reloadRetries + 1)))
        return this.reloadAPIToken(refreshToken, reloadRetries + 1)
      }
      this.debugAuthWarn('reloadAPIToken failed', e)
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
        this.debugAuth('refreshTokens — reusing token rotated by another tab (before reload)')
        return { token: this.token, refreshToken: rotatedBefore }
      }
      try {
        return await this.reloadAPIToken(startRefreshToken)
      } catch (e: any) {
        const rotatedDuring = this.getRotatedRefreshToken(startRefreshToken)
        if (rotatedDuring) {
          this.debugAuth('refreshTokens — retrying with token rotated during reload')
          return await this.reloadAPIToken(rotatedDuring)
        }
        throw e
      }
    })
  }

  async refreshAPIToken() {
    if (this.refreshingToken) {
      this.debugAuth('refreshAPIToken — joining in-flight refresh')
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
      this.debugAuthWarn('refreshAPIToken — no local refresh token')
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
      .catch(() => {
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
      this.debugAuth('waiting for login before fetch', { url })
      try {
        await this.logging
        this.debugAuth('login settled, continuing fetch', { url })
      } catch {
        this.debugAuth('login failed — fetch continues without session', { url })
      }
    }
    try {
      return await this._fetchAttempt<T, Body>({ url, options, refreshRetries, waitLogin })
    } catch (e: any) {
      if (this.isDebugging('request')) {
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
    rateLimitRetried = false,
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
      if (this.isDebugging('request')) {
        logDebugUrl('GFWAPI: Fetching URL: ', url)
        if (token != null) {
          this.debugLog('GFWAPI: stateless fetch (per-request token, no refresh/retry)')
        }
      }
      const finalHeaders = {
        ...this.defaultHeaders,
        ...(typeof headers === 'function' ? headers() : headers),
        ...(requestType === 'json' && { 'Content-Type': 'application/json' }),
        ...(local && {
          'x-gateway-url': API_GATEWAY,
          user: JSON.stringify({
            id: getEnv('VITE_LOCAL_API_USER_ID'),
            type: getEnv('VITE_LOCAL_API_USER_TYPE'),
            email: getEnv('VITE_LOCAL_API_USER_EMAIL'),
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
        .then((res) => {
          // Read the headers before processStatus, parsed errors lose them
          this.logRateLimit(fetchUrl, res)
          return processStatus(res, responseType)
        })
        .then((res) => {
          switch (responseType) {
            case 'default':
              return res
            case 'json':
              return parseJSON(res).catch(() => {
                // When an error occurs while parsing and
                // http response is no content, returns an
                // empty response instead of an raising error
                if (res.status === 204) return
              })
            case 'withHeaders':
              return parseJSON(res)
                .catch((e) => {
                  if (res.status === 204) return
                  throw e
                })
                .then((data) => ({ data, headers: res.headers }))
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
      // 429 on a rate limited resource => park the request until the challenge resets its dataset
      const rateLimitDataset = isVisualizationRateLimitedUrl(url)
        ? getRateLimitDataset(url)
        : undefined
      const rateLimited = getIsRateLimitExceeded(e) && !!rateLimitDataset
      if (rateLimited) this.rateLimitedDatasets.add(rateLimitDataset)
      if (rateLimited && !rateLimitRetried && this.rateLimitChallengeContainer) {
        this.debugRateLimit('429: request parked until the challenge resets the limit', {
          url: getRateLimitLogUrl(url),
          dataset: rateLimitDataset,
        })
        try {
          await this.waitForRateLimitChallenge(rateLimitDataset, options.signal)
        } catch (challengeError: any) {
          this.debugRateLimit(
            options.signal?.aborted
              ? '429: parked request aborted'
              : '429: challenge failed, rejecting with the original 429',
            { url: getRateLimitLogUrl(url), error: challengeError?.message }
          )
          throw e
        }
        this.debugRateLimit('429: limit reset, retrying parked request', {
          url: getRateLimitLogUrl(url),
        })
        return this._fetchAttempt<T, Body>({
          url,
          options,
          refreshRetries,
          waitLogin,
          rateLimitRetried: true,
        })
      }
      // 401 = not authenticated, 403 = not authorized => try to refresh the token.
      if (refreshRetries > this.maxRefreshRetries) {
        this.debugLog(`GFWAPI: retry attempts exceeded for ${url}`)
        this.debugWarn(`GFWAPI: Error fetching ${url}`, e)
        throw e
      }
      const authError = isAuthError(e)
      const stateless = token != null
      if (authError && skipAuthRefresh) {
        this.debugAuth('auth error — skipAuthRefresh, not retrying', {
          url,
          status: e.status,
        })
      }
      if (authError && stateless) {
        this.debugAuth('auth error — stateless request, not refreshing', {
          url,
          status: e.status,
        })
      }
      if (authError && !skipAuthRefresh && !stateless) {
        this.debugAuth(`auth error — refreshing token (attempt ${refreshRetries})`, {
          url,
          status: e.status,
        })
        try {
          await this.refreshAPIToken()
          this.debugAuth('token refresh worked, trying to fetch again', { url })
        } catch (err: any) {
          this.debugAuthWarn(`token refresh failed for ${url}`, err)

          const refreshRejected =
            isSessionError(err) && !isForbidden(err) && !getIsTimeoutError(err)
          if (getIsBrowser() && refreshRejected) {
            this.debugAuth('refresh rejected — invalidating client session')
            this.invalidateClientSession()
          }
          if (refreshRejected) {
            e.refreshError = true
            this.debugAuth('marking original error as refreshError')
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
    if (this.isDebugging('auth')) {
      this.debugAuth('fetchUser', { stateless: token != null, hasToken: Boolean(token) })
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
      this.debugAuth('fetchUser OK', { userId: user?.id, type: user?.type })
      return user
    } catch (e: any) {
      this.debugAuthWarn('fetchUser failed', e)
      throw new Error('Error trying to get user data', { cause: e })
    }
  }

  async fetchGuestUser({ token }: { token?: string } = {}): Promise<UserData> {
    if (this.isDebugging('auth')) {
      this.debugAuth('fetchGuestUser', { stateless: token != null })
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

      this.debugAuth('fetchGuestUser OK', { permissions: permissions.length })
      return user
    } catch (e: any) {
      this.debugAuthWarn('fetchGuestUser failed', e)
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
        this.debugAuth('_login — exchanging SSO access token')
        try {
          const tokens = await this.exchangeAccessToken(accessToken)
          this.token = tokens.token
          this.refreshToken = tokens.refreshToken
          this.debugAuth('_login — access token exchanged, tokens stored')
        } catch (e: any) {
          if (!this.token && !this.refreshToken) {
            const msg = getIsUnauthorizedError(e)
              ? 'Invalid access token'
              : 'Error trying to generate tokens'
            this.debugAuthWarn(`_login — ${msg}`, e)
            throw new Error(msg, { cause: e })
          }
          this.debugAuth('_login — access token exchange failed, falling back to stored tokens')
        }
      }

      if (this.token) {
        this.debugAuth('_login — fetching user with stored access token')
        try {
          const user = await this.fetchUser()
          this.debugAuth('_login — user resolved with access token', {
            userId: user?.id,
            type: user?.type,
          })
          return user
        } catch (e: any) {
          this.debugAuthWarn('_login — access token rejected, will try refresh', e)
        }
      }

      const refreshTokenToUse = refreshToken || this.refreshToken
      const canRefresh = this.refreshStrategy
        ? Boolean(this.token || refreshTokenToUse)
        : Boolean(refreshTokenToUse)
      this.debugAuth('_login — refresh decision', {
        canRefresh,
        viaRefreshStrategy: Boolean(this.refreshStrategy),
        hasAccessToken: Boolean(this.token),
        hasLocalRefreshToken: Boolean(refreshTokenToUse),
      })
      if (canRefresh) {
        this.debugAuth(
          `_login — refreshing via ${this.refreshStrategy ? 'refreshStrategy' : 'localStorage'}`
        )
        try {
          if (this.refreshStrategy) {
            await this.refreshAPIToken()
          } else {
            await this.refreshTokens(refreshTokenToUse)
          }
          this.debugAuth('_login — refresh OK, fetching user')
          const user = await this.fetchUser()
          this.debugAuth('_login — user resolved after refresh', {
            userId: user?.id,
            type: user?.type,
          })
          return user
        } catch (e: any) {
          const msg = isSessionError(e)
            ? 'Invalid refresh token'
            : 'Error trying to refreshing the token'
          this.debugAuthWarn(`_login — ${msg}`, e)
          throw new Error(msg, { cause: e })
        }
      }

      this.debugAuthWarn('_login — no session (no token and refresh not attempted)')
      // status 401 so consumers classify "no session" as an auth error (→ guest
      // fallback), not a transient/network failure to retry. Mirrors refreshAPIToken.
      const error: any = new Error('No login token provided')
      error.status = 401
      throw error
    } finally {
      this.status = 'idle'
      this.debugAuth('_login finished')
    }
  }

  async login(params: LoginParams): Promise<UserData> {
    if (this.logging) {
      this.debugAuth('login — joining in-flight login')
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
      this.debugAuth('logout — revoking session on gateway')
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
      this.debugAuth('logout — gateway OK')
      return true
    } catch (e: any) {
      this.debugAuthWarn('logout — gateway call failed (local session still cleared)', e)
      throw new Error('Error on the logout proccess', { cause: e })
    } finally {
      this.invalidateClientSession()
      this.debugAuth('logout finished')
    }
  }
}

export const GFWAPI = new GFW_API_CLASS()
