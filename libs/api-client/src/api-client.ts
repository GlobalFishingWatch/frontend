import { saveAs } from 'file-saver'

import type {
  APIPagination,
  ResourceRequestType,
  ResourceResponseType,
  UserData,
  UserPermission,
} from '@globalfishingwatch/api-types'

import { getIsUnauthorizedError, isAuthError, parseAPIError } from './utils/errors'
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

export { GUEST_USER_TYPE, API_VERSION, API_GATEWAY } from './config'

interface UserTokens {
  token: string
  refreshToken: string
}

interface LoginParams {
  accessToken?: string | null
  refreshToken?: string | null
}
export type ApiVersion = '' | 'v1' | 'v2' | 'v3'
export type FetchOptions<T = unknown> = Partial<Omit<RequestInit, 'body'>> & {
  version?: ApiVersion
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  cache?: RequestCache
  responseType?: ResourceResponseType
  requestType?: ResourceRequestType
  body?: T
  local?: boolean
}

interface LibConfig {
  version?: ApiVersion
  debug?: boolean
  baseUrl?: string
}

const isClientSide = typeof window !== 'undefined'

export type RequestStatus = 'idle' | 'refreshingToken' | 'logging' | 'downloading'
export class GFW_API_CLASS {
  debug: boolean
  token = ''
  apiVersion: ApiVersion
  refreshToken = ''
  baseUrl: string
  storageKeys: {
    token: string
    refreshToken: string
  }
  maxRefreshRetries = 1
  logging: Promise<UserData> | null
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
    this.storageKeys = { token: tokenStorageKey, refreshToken: refreshTokenStorageKey }
    if (isClientSide) {
      this.setToken(localStorage.getItem(tokenStorageKey) || '')
      this.setRefreshToken(localStorage.getItem(refreshTokenStorageKey) || '')
    }
    this.logging = null

    if (debug) {
      console.log('GFWAPI: GFW API Client initialized with the following config', this.getConfig())
    }
  }

  getBaseUrl() {
    return this.baseUrl
  }

  getStatus() {
    return this.status
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

  getLoginUrl(callbackUrl: string, { client = 'gfw', locale = '' } = {}) {
    const fallbackLocale =
      locale || (isClientSide ? localStorage.getItem('i18nextLng') : 'en') || 'en'
    const callbackUrlEncoded = encodeURIComponent(callbackUrl)
    return this.generateUrl(
      `/${API_VERSION}/${AUTH_PATH}?client=${client}&callback=${callbackUrlEncoded}&locale=${fallbackLocale}`,
      { absolute: true }
    )
  }

  getConfig() {
    return {
      debug: this.debug,
      baseUrl: this.baseUrl,
      storageKeys: this.storageKeys,
      token: this.getToken(),
      refreshToken: this.getRefreshToken(),
    }
  }

  setDefaultApiVersion(version: ApiVersion) {
    this.apiVersion = version
  }

  setConfig(config: LibConfig) {
    const { debug = this.debug, baseUrl = this.baseUrl, version = this.apiVersion } = config
    this.debug = debug
    this.baseUrl = baseUrl
    this.apiVersion = version
  }

  getToken() {
    return this.token
  }

  setToken(token: string) {
    this.token = token
    if (isClientSide) {
      if (token) {
        localStorage.setItem(this.storageKeys.token, token)
      } else {
        localStorage.removeItem(this.storageKeys.token)
      }
    }
    if (this.debug) {
      console.log('GFWAPI: updated token with', token)
    }
  }

  getRefreshToken() {
    return this.refreshToken
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken
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

  async getTokensWithAccessToken(accessToken: string): Promise<UserTokens> {
    return fetch(
      this.generateUrl(`/${AUTH_PATH}/tokens?access-token=${accessToken}`, { absolute: true })
    )
      .then(processStatus)
      .then(parseJSON)
  }

  async getTokenWithRefreshToken(
    refreshToken: string
  ): Promise<{ token: string; refreshToken: string }> {
    return fetch(this.generateUrl(`/${AUTH_PATH}/tokens/reload`, { absolute: true }), {
      headers: {
        'refresh-token': refreshToken,
      },
    })
      .then(processStatus)
      .then(parseJSON)
  }

  async refreshAPIToken() {
    if (this.status !== 'refreshingToken') {
      this.status = 'refreshingToken'
      try {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        const refreshResponse = await this.getTokenWithRefreshToken(refreshToken)
        const { token, refreshToken: newRefreshToken } = refreshResponse
        this.setToken(token)
        this.setRefreshToken(newRefreshToken)
        this.status = 'idle'
        return refreshResponse
      } catch (e: any) {
        this.status = 'idle'
        e.status = 401
        throw e
      }
    }
    return
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
    if (url.startsWith('/v3/') || url.startsWith('/v2/') || url.startsWith('/v1/')) {
      return absolute ? `${this.baseUrl}${url}` : url
    }
    const apiVersion = version ?? this.apiVersion
    const prefix = apiVersion ? `/${apiVersion}` : ''

    return absolute ? `${this.baseUrl}${prefix}${url}` : `${prefix}${url}`
  }

  fetch<Response, Body = unknown>(url: string, options: FetchOptions<Body> = {}) {
    return this._internalFetch<Response, Body>(
      this.generateUrl(url, { version: options.version }),
      options
    )
  }

  download(downloadUrl: string, fileName = 'download'): Promise<boolean> {
    this.status = 'downloading'
    return this._internalFetch<Blob>(downloadUrl, { responseType: 'blob' })
      .then((blob) => {
        saveAs(blob, fileName)
        this.status = 'idle'
        return true
      })
      .catch((e) => {
        this.status = 'idle'
        return false
      })
  }

  async _internalFetch<T = Record<string, unknown> | Blob | ArrayBuffer | Response, Body = unknown>(
    url: string,
    options: FetchOptions<Body> = {},
    refreshRetries = 0,
    waitLogin = true
  ): Promise<T> {
    const {
      method = 'GET',
      body = null,
      headers = {},
      responseType = 'json',
      requestType = 'json',
      cache,
      signal,
      local = false,
    } = options
    try {
      if (this.logging && waitLogin) {
        // Don't do any request until the login is completed
        // and don't wait for the login request itselft
        try {
          await this.logging
        } catch (e: any) {
          if (this.debug) {
            console.log(`Fetch resource executed without login headers in url: ${url}`)
          }
        }
      }

      try {
        if (this.debug) {
          console.log(`GFWAPI: Fetching URL: ${url}`)
        }
        const finalHeaders = {
          ...headers,
          ...(requestType === 'json' && { 'Content-Type': 'application/json' }),
          ...(local && {
            'x-gateway-url': API_GATEWAY,
            user: JSON.stringify({
              id: process.env.REACT_APP_LOCAL_API_USER_ID,
              type: process.env.REACT_APP_LOCAL_API_USER_TYPE,
              email: process.env.REACT_APP_LOCAL_API_USER_EMAIL,
            }),
          }),
          Authorization: `Bearer ${this.getToken()}`,
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
                try {
                  return import('@globalfishingwatch/pbf-decoders').then(({ vessels }) => {
                    return res.arrayBuffer().then((buffer) => {
                      const track = vessels.Track.decode(new Uint8Array(buffer))
                      return track.data
                    })
                  })
                } catch (e: any) {
                  console.warn(
                    '@globalfishingwatch/pbf-decoders is a mandatory external dependency when using vessel response decoding'
                  )
                  throw e
                }
              }
              default:
                return res
            }
          })
        return data
      } catch (e: any) {
        // 401 = not authenticated => trying to refresh the token
        // 403 = not authorized => trying to refresh the token
        // 401 + refreshError = true => refresh token failed
        if (refreshRetries <= this.maxRefreshRetries) {
          const authError = isAuthError(e)
          if (authError) {
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
              if (isClientSide) {
                localStorage.removeItem(this.storageKeys.token)
                localStorage.removeItem(this.storageKeys.refreshToken)
              }
              e.refreshError = true
              throw parseAPIError(e)
            }
          }
          if (authError || e.status >= 500) {
            return this._internalFetch(url, options, ++refreshRetries, waitLogin)
          }
          throw e
        } else {
          if (this.debug) {
            if (refreshRetries >= this.maxRefreshRetries) {
              console.log(`GFWAPI: Attemps to retry the request excedeed`)
            }
            console.warn(`GFWAPI: Error fetching ${url}`, e)
          }
          if (responseType === 'default') {
            throw e
          }

          throw parseAPIError(e)
        }
      }
    } catch (e: any) {
      if (this.debug) {
        console.warn(`GFWAPI: Error fetching ${url}`, e)
      }
      if (responseType === 'default') {
        throw e
      }
      throw parseAPIError(e)
    }
  }

  async fetchUser() {
    try {
      const user = await this._internalFetch<UserData>(
        this.generateUrl(`/${AUTH_PATH}/me`),
        {},
        0,
        false
      )
      return user
    } catch (e: any) {
      console.warn(e)
      throw new Error('Error trying to get user data')
    }
  }

  async fetchGuestUser(): Promise<UserData> {
    try {
      const permissions: UserPermission[] = await this._internalFetch<
        APIPagination<UserPermission>
      >(this.generateUrl(`/auth/acl/permissions/anonymous`)).then(
        (response: APIPagination<UserPermission>) => {
          return response.entries
        }
      )
      const user: UserData = { id: 0, type: GUEST_USER_TYPE, permissions, groups: [] }

      return user
    } catch (e: any) {
      console.warn(e)
      throw new Error('Error trying to get user data')
    }
  }

  async login(params: LoginParams): Promise<UserData> {
    const { accessToken = null, refreshToken = this.getRefreshToken() } = params
    this.status = 'logging'
    // eslint-disable-next-line no-async-promise-executor
    this.logging = new Promise(async (resolve, reject) => {
      if (accessToken) {
        if (this.debug) {
          console.log(`GFWAPI: Trying to get tokens using access-token`)
        }
        try {
          const tokens = await this.getTokensWithAccessToken(accessToken)
          this.setToken(tokens.token)
          this.setRefreshToken(tokens.refreshToken)
          if (this.debug) {
            console.log(`GFWAPI: access-token valid, tokens ready`)
          }
        } catch (e: any) {
          if (!this.getToken() && !this.getRefreshToken()) {
            const msg = getIsUnauthorizedError(e)
              ? 'Invalid access token'
              : 'Error trying to generate tokens'
            if (this.debug) {
              console.warn(`GFWAPI: ${msg}`)
            }
            reject(new Error(msg))
            this.status = 'idle'
            return null
          }
        }
      }

      if (this.getToken()) {
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

      if (refreshToken) {
        if (this.debug) {
          console.log(`GFWAPI: Token wasn't valid, trying to refresh`)
        }
        try {
          const { token, refreshToken: newRefreshToken } =
            await this.getTokenWithRefreshToken(refreshToken)
          this.setToken(token)
          this.setRefreshToken(newRefreshToken)
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
          reject(new Error(msg))
          this.status = 'idle'
          return null
        }
      }
      this.status = 'idle'
      reject(new Error('No login token provided'))
      return
    })
    return await this.logging
  }

  async logout() {
    try {
      if (this.debug) {
        console.log(`GFWAPI: Logout - tokens cleaned`)
      }
      await this._internalFetch(`/${AUTH_PATH}/logout`, {
        headers: {
          'refresh-token': this.getRefreshToken(),
        },
      })
      this.setToken('')
      this.setRefreshToken('')
      if (this.debug) {
        console.log(`GFWAPI: Logout invalid session api OK`)
      }
      return true
    } catch (e: any) {
      if (this.debug) {
        console.warn(`GFWAPI: Logout invalid session fail`)
      }
      throw new Error('Error on the logout proccess')
    }
  }
}

export const GFWAPI = new GFW_API_CLASS()
