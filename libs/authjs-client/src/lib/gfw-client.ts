import type { UserData, UserPermission, APIPagination } from '@globalfishingwatch/api-types'
import { GFW_API_AUTH_ENDPOINT, GFW_CLIENT_BASE_HEADERS, GFW_CLIENT_DEFAULTS } from './config'
import { GFWConfig, GFWConfigParams, RequestData, RequestDataMethod, Token } from './types'
import { handleResponseTextOrJson } from './utils'
export const GUEST_USER_TYPE = 'guest'

/**
 * GFW API client
 */
export class GFW {
  /**
   * GFW Api gateway url
   */
  url: string
  /**
   * Configuration variables used by the client
   */
  config: GFWConfig

  /**
   * Creates a new instance of the GFW Api client
   * @param options
   */
  constructor(options: GFWConfigParams) {
    const config = {
      ...GFW_CLIENT_DEFAULTS,
      ...options,
    }
    this.url = `${config.gatewayUrl}/${config.version}`
    this.config = config
  }

  /**
   * Performs request to the GFW api to refresh the token
   * @param gatewayUrl GFW Api gateway url
   * @param refreshToken refreshToken to use for logging in
   * @returns Promise resolving to the new token
   */
  static async refreshToken<T = { token: string; refreshToken: string }>(
    gatewayUrl: string,
    refreshToken?: string
  ): Promise<T> {
    const requestData = {
      url: `${gatewayUrl}/${GFW_API_AUTH_ENDPOINT}token/reload`,
      method: 'GET',
    }
    const results = await fetch(requestData.url, {
      method: requestData.method,
      headers: {
        ...GFW_CLIENT_BASE_HEADERS,
        'refresh-token': refreshToken,
      },
    }).then(handleResponseTextOrJson<T>)

    return results
  }

  /**
   * Performs login against the GFW API with the given access_token
   * and returns the bearer and refresh tokens
   * @param gatewayUrl GFW Api gateway url
   * @param accessToken accessToken to use for logging in
   * @returns Promise resolving to the tokens returned from the API.
   */
  static async login(gatewayUrl: string, accessToken: string): Promise<Token> {
    return await fetch(`${gatewayUrl}/${GFW_API_AUTH_ENDPOINT}/token?access-token=${accessToken}`, {
      method: 'GET',
      headers: GFW_CLIENT_BASE_HEADERS,
    }).then(handleResponseTextOrJson<Token>)
  }

  /**
   * Performs logout against the GFW API with the given refresh_token
   * @param gatewayUrl GFW Api gateway url
   * @param refreshToken refreshToken to use for logging in
   * @returns Promise resolving an empty object
   */
  static async logout(gatewayUrl: string, refreshToken: string): Promise<unknown> {
    return await fetch(`${gatewayUrl}/${GFW_API_AUTH_ENDPOINT}/logout`, {
      method: 'GET',
      headers: Object.assign({}, GFW_CLIENT_BASE_HEADERS, {
        'refresh-token': refreshToken,
      }),
    }).then(handleResponseTextOrJson)
  }

  /**
   * Performs login against the GFW API with the given access_token
   * and stores the bearer and refresh tokens in the client config
   * to be used in the upcoming requests
   * @returns Promise resolving to the tokens returned from the API.
   */
  async login(): Promise<Token> {
    if (this.config.debug) {
      console.log('GFW-API. Logging in with access token')
    }
    try {
      const results = await GFW.login(this.url, this.config.accessToken ?? '')
      if (results.token) this.config.bearerToken = results.token
      if (results.refreshToken) this.config.refreshToken = results.refreshToken
      return results
    } catch (e) {
      if (this.config.debug) {
        console.error('GFW-API. Error logging in', e)
      }
      throw e
    }
  }

  async fetchUser() {
    try {
      return await this.get<UserData>(`${GFW_API_AUTH_ENDPOINT}/me`)
    } catch (e) {
      if (this.config.debug) {
        console.log('GFW-API. Error fetching user', e)
      }
      throw e
    }
  }

  async fetchGuestUser(): Promise<UserData> {
    try {
      const permissions: UserPermission[] = await this.get<APIPagination<UserPermission>>(
        `${GFW_API_AUTH_ENDPOINT}/acl/permissions/anonymous`
      ).then((response) => {
        return response.entries
      })
      const user: UserData = { id: 0, type: GUEST_USER_TYPE, permissions, groups: [] }

      return user
    } catch (e) {
      if (this.config.debug) {
        console.log('GFW-API. Error fetching guest user', e)
      }
      throw e
    }
  }

  /**
   * Performs logout against the GFW API with the given access_token
   * and clears the bearer and refresh tokens in the client config
   *
   * @returns Promise resolving an empty object
   */
  async logout(): Promise<any> {
    if (this.config.debug) {
      console.log('GFW-API. Logging out')
    }
    try {
      const results = await GFW.logout(this.url, this.config.refreshToken ?? '')
      this.config.bearerToken = ''
      this.config.refreshToken = ''
      return results
    } catch (e) {
      if (this.config.debug) {
        console.error('GFW-API. Error logging out', e)
      }
      throw e
    }
  }

  /**
   * Performs request to the GFW api to refresh the token
   * @returns Promise resolving to the new token
   */
  async refreshToken() {
    if (this.config.debug) {
      console.log('GFW-API. Refreshing token')
    }
    try {
      const results = await GFW.refreshToken(this.url, this.config.refreshToken ?? '')
      if (results.token) this.config.bearerToken = results.token
      return results
    } catch (e) {
      if (this.config.debug) {
        console.log('GFW-API. Refreshing token error', e)
      }
      throw e
    }
  }

  /**
   * Construct the data and headers for an authenticated HTTP request
   * @param method "GET", "POST", "PUT", "DELETE" or "PATCH"
   * @param resource the API endpoint
   * @param parameters
   * @param body
   * @returns Request data object
   */
  private _makeRequest(
    method: RequestDataMethod,
    resource: string,
    parameters?: Record<string, any>,
    body?: Record<string, any>
  ): RequestData {
    const request: RequestData['request'] = {
      url: `${this.url}${resource}`,
      method,
    }
    if (parameters) request.url += '?' + new URLSearchParams(parameters).toString()

    if (body) request.body = JSON.stringify(body)

    const headers = {
      Authorization: `Bearer ${this.config.bearerToken}`,
    }
    return {
      request,
      headers: new Headers(headers),
    }
  }

  /**
   * Internal fetch method to send requests to the API and
   * handle token refreshing
   * @param method "GET", "POST", "PUT", "DELETE" or "PATCH"
   * @param resource - endpoint
   * @param parameters optional parameters to be send in the query
   * @param body - Body object to send with the paykload
   * @returns Promise resolving to the response from the API.
   */
  private _fetch<R = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    resource: string,
    parameters?: Record<string, string>,
    body?: Record<string, any>
  ): Promise<R> {
    const { request, headers } = this._makeRequest(method, resource, parameters, body)
    if (this.config.debug) {
      console.log(`GFW-API. ${method} ${request.url}`)
    }

    return fetch(request.url, {
      headers,
      method: request.method,
      ...(request.body ? { body: request.body } : {}),
    }).then(async (res: Response) => {
      if (!res.ok && res.status === 401 && this.config.refreshToken) {
        return await this.refreshToken()
          // Retry request after refreshing token
          .then(() => this._fetch(method, resource, parameters, body))
          // Token refresh was unsuccessful,
          // returning response from get request
          .catch((_) => res)
      }
      return await handleResponseTextOrJson(res)
    })
  }

  /**
   * Send a GET request
   * @param resource endpoint
   * @param parameters optional parameters to be send in the query
   * @returns Promise resolving to the response from the API.
   */
  get<R = unknown>(resource: string, parameters?: Record<string, string>): Promise<R> {
    return this._fetch<R>('GET', resource, parameters)
  }

  /**
   * Send a POST request
   * @param resource - endpoint
   * @param body - POST parameters object.
   *   Will be encoded appropriately (JSON or urlencoded) based on the resource
   * @returns Promise resolving to the response from the API.
   */
  post<R = unknown>(resource: string, body?: Record<string, any>): Promise<R> {
    return this._fetch<R>('POST', resource, undefined, body)
  }

  /**
   * Send a PUT request
   * @param resource - endpoint
   * @param parameters optional parameters to be send in the query
   * @param body - PUT parameters object.
   * @returns Promise resolving to the response from the API.
   */
  put<R = unknown>(
    resource: string,
    parameters?: Record<string, string>,
    body?: Record<string, any>
  ): Promise<R> {
    return this._fetch<R>('PUT', resource, parameters, body)
  }

  /**
   * Send a PATCH request
   * @param resource - endpoint
   * @param parameters optional parameters to be send in the query
   * @param body - PUT parameters object.
   * @returns Promise resolving to the response from the API.
   */
  patch<R = unknown>(
    resource: string,
    parameters?: Record<string, string>,
    body?: Record<string, any>
  ): Promise<R> {
    return this._fetch<R>('PATCH', resource, parameters, body)
  }

  /**
   * Send a DELETE request
   * @param resource - endpoint
   * @param parameters optional parameters to be send in the query
   * @param body - PUT parameters object.
   * @returns Promise resolving to the response from the API.
   */
  delete<R = unknown>(resource: string, parameters?: Record<string, string>): Promise<R> {
    return this._fetch<R>('DELETE', resource, parameters)
  }
}

export default GFW
