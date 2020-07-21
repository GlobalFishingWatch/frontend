import { saveAs } from 'file-saver'
import { vessels } from '@globalfishingwatch/pbf/decoders/vessels'
import { UserData } from './types'
import { isUrlAbsolute } from './utils/url'

const API_GATEWAY =
  process.env.API_GATEWAY ||
  process.env.REACT_APP_API_GATEWAY ||
  'https://gateway.api.dev.globalfishingwatch.org'
export const USER_TOKEN_STORAGE_KEY = 'GFW_API_USER_TOKEN'
export const USER_REFRESH_TOKEN_STORAGE_KEY = 'GFW_API_USER_REFRESH_TOKEN'
const AUTH_PATH = 'auth'

interface ResponseError {
  status: number
  message: string
}

interface UserTokens {
  token: string
  refreshToken: string
}

interface LibConfig {
  debug?: boolean
  baseUrl?: string
  dataset?: string
}

interface LoginParams {
  accessToken?: string | null
  refreshToken?: string | null
}

export type FetchResponseTypes = 'default' | 'text' | 'json' | 'blob' | 'arrayBuffer' | 'vessel'
export type FetchOptions = RequestInit & {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /**
   * JSON Object
   */
  body?: any
  responseType?: FetchResponseTypes
  dataset?: boolean
}

const processStatus = (response: Response) => {
  return response.status >= 200 && response.status < 300
    ? Promise.resolve(response)
    : Promise.reject({ status: response.status, message: response.statusText })
}

const parseJSON = (response: Response) => response.json()
const isUnauthorizedError = (error: ResponseError) =>
  error && error.status > 400 && error.status < 403

const isClientSide = typeof window !== 'undefined'

export class GFWAPI {
  debug: boolean
  token = ''
  refreshToken = ''
  dataset = ''
  baseUrl: string
  storageKeys: {
    token: string
    refreshToken: string
  }
  maxRefreshRetries = 1
  logging: Promise<UserData> | null

  constructor({
    debug = false,
    baseUrl = API_GATEWAY,
    tokenStorageKey = USER_TOKEN_STORAGE_KEY,
    refreshTokenStorageKey = USER_REFRESH_TOKEN_STORAGE_KEY,
  } = {}) {
    this.debug = debug
    this.baseUrl = baseUrl
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

  getLoginUrl(callbackUrl: string, client = 'gfw') {
    return `${this.baseUrl}/${AUTH_PATH}?client=${client}&callback=${callbackUrl}`
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

  setConfig(config: LibConfig) {
    const { debug = this.debug, baseUrl = this.baseUrl, dataset = this.dataset } = config
    this.debug = debug
    this.baseUrl = baseUrl
    this.dataset = dataset
  }

  getToken() {
    return this.token
  }

  setToken(token: string) {
    this.token = token
    if (token) {
      localStorage.setItem(this.storageKeys.token, token)
    } else {
      localStorage.removeItem(this.storageKeys.token)
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
    if (refreshToken) {
      localStorage.setItem(this.storageKeys.refreshToken, refreshToken)
    } else {
      localStorage.removeItem(this.storageKeys.refreshToken)
    }
    if (this.debug) {
      console.log('GFWAPI: updated refreshToken with', refreshToken)
    }
  }

  async getTokensWithAccessToken(accessToken: string): Promise<UserTokens> {
    return fetch(`${this.baseUrl}/${AUTH_PATH}/token?access-token=${accessToken}`)
      .then(processStatus)
      .then(parseJSON)
  }

  async getTokenWithRefreshToken(refreshToken: string): Promise<{ token: string }> {
    return fetch(`${this.baseUrl}/${AUTH_PATH}/token/reload`, {
      headers: {
        'refresh-token': refreshToken,
      },
    })
      .then(processStatus)
      .then(parseJSON)
  }

  fetch<T>(url: string, options: FetchOptions = {}) {
    return this._internalFetch<T>(url, options)
  }

  download(downloadUrl: string, fileName = 'download'): Promise<boolean> {
    return this._internalFetch<Blob>(downloadUrl, { responseType: 'blob' })
      .then((blob) => {
        saveAs(blob, fileName)
        return true
      })
      .catch((e) => {
        return false
      })
  }

  async _internalFetch<T = Record<string, unknown> | Blob | ArrayBuffer | Response>(
    url: string,
    options: FetchOptions = {},
    refreshRetries = 0,
    waitLogin = true
  ): Promise<T> {
    try {
      if (this.logging && waitLogin) {
        // Don't do any request until the login is completed
        // and don't wait for the login request itselft
        try {
          await this.logging
        } catch (e) {
          if (this.debug) {
            console.log(`Fetch resource executed without login headers in url: ${url}`)
          }
        }
      }

      try {
        const {
          method = 'GET',
          body = null,
          headers = {},
          responseType = 'json',
          signal,
          dataset = this.dataset,
        } = options
        if (this.debug) {
          console.log(`GFWAPI: Fetching url: ${url}`)
        }
        const prefix = `${isUrlAbsolute(url) ? '' : this.baseUrl}`
        const fetchUrl = prefix + (dataset ? `/datasets/${this.dataset}` : '') + url
        const data = await fetch(fetchUrl, {
          method,
          signal,
          ...(body && { body: JSON.stringify(body) }),
          headers: {
            ...headers,
            ...(json && { 'Content-Type': 'application/json' }),
            Authorization: `Bearer ${this.getToken()}`,
          },
        })
          .then(processStatus)
          .then((res) => {
            switch (responseType) {
              case 'default':
                return res
              case 'json':
                return parseJSON(res)
              case 'blob':
                return res.blob()
              case 'text':
                return res.text()
              case 'arrayBuffer':
                return res.arrayBuffer()
              case 'vessel':
                return res.arrayBuffer().then((buffer) => {
                  const track = vessels.Track.decode(new Uint8Array(buffer))
                  return track.data
                })
              default:
                return res
            }
          })
        return data
      } catch (e) {
        // 401 = not authenticated => trying to refresh the token
        // 403 = not authorized => trying to refresh the token
        // 401 + refreshError = true => refresh token failed
        if (refreshRetries <= this.maxRefreshRetries) {
          if (e.status === 401 || e.status === 403) {
            if (this.debug) {
              console.log(`GFWAPI: Trying to refresh the token attempt: ${refreshRetries}`)
            }
            try {
              const { token } = await this.getTokenWithRefreshToken(this.getRefreshToken())
              this.setToken(token)

              if (this.debug) {
                console.log(`GFWAPI: Token refresh worked! trying to fetch again ${url}`)
              }
            } catch (e) {
              if (this.debug) {
                console.warn(`GFWAPI: Error fetching ${url}`, e)
              }
              localStorage.removeItem(this.storageKeys.token)
              localStorage.removeItem(this.storageKeys.refreshToken)
              e.refreshError = true
              throw e
            }
          }
          return this._internalFetch(url, options, ++refreshRetries, waitLogin)
        } else {
          if (this.debug) {
            if (refreshRetries >= this.maxRefreshRetries) {
              console.log(`GFWAPI: Attemps to retry the request excedeed`)
            }
            console.warn(`GFWAPI: Error fetching ${url}`, e)
          }
          throw e
        }
      }
    } catch (e) {
      if (this.debug) {
        console.warn(`GFWAPI: Error fetching ${url}`, e)
      }
      throw e
    }
  }

  async fetchUser() {
    try {
      const user = await this._internalFetch<UserData>(
        `/${AUTH_PATH}/me`,
        { dataset: false },
        0,
        false
      )
      return user
    } catch (e) {
      console.warn(e)
      throw new Error('Error trying to get user data')
    }
  }

  async login(params: LoginParams): Promise<UserData> {
    const { accessToken = null, refreshToken = this.getRefreshToken() } = params
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
        } catch (e) {
          if (!this.getToken() && !this.getRefreshToken()) {
            const msg = isUnauthorizedError(e)
              ? 'Invalid access token'
              : 'Error trying to generate tokens'
            if (this.debug) {
              console.warn(`GFWAPI: ${msg}`)
            }
            reject(new Error(msg))
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
          return user
        } catch (e) {
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
          const { token } = await this.getTokenWithRefreshToken(refreshToken)
          this.setToken(token)
          if (this.debug) {
            console.log(`GFWAPI: Refresh token OK, fetching user`)
          }
          const user = await this.fetchUser()
          if (this.debug) {
            console.log(`GFWAPI: Login finished, user data ready:`, user)
          }
          resolve(user)
          return user
        } catch (e) {
          const msg = isUnauthorizedError(e)
            ? 'Invalid refresh token'
            : 'Error trying to refreshing the token'
          console.warn(e)
          if (this.debug) {
            console.warn(`GFWAPI: ${msg}`)
          }
          reject(new Error(msg))
          return null
        }
      }
      reject(new Error('No login token provided'))
    })
    return await this.logging
  }

  async logout() {
    try {
      if (this.debug) {
        console.log(`GFWAPI: Logout - tokens cleaned`)
      }
      await fetch(`${this.baseUrl}/${AUTH_PATH}/logout`, {
        headers: {
          'refresh-token': this.refreshToken,
        },
      }).then(processStatus)
      this.setToken('')
      this.setRefreshToken('')
      if (this.debug) {
        console.log(`GFWAPI: Logout invalid session api OK`)
      }
      return true
    } catch (e) {
      if (this.debug) {
        console.warn(`GFWAPI: Logout invalid session fail`)
      }
      throw new Error('Error on the logout proccess')
    }
  }
}

export default new GFWAPI()
