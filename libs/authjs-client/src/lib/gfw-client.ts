const getUrl = (gateway: string, endpoint?: string) => `${gateway}${endpoint ? '/' + endpoint : ''}`

const getAuthUrl = (gateway: string) => getUrl(gateway, 'auth')

type GFWConfig = {
  gatewayUrl: string
  version?: string
  client?: string
  accessToken?: string
  bearerToken?: string
  refreshToken?: string
}

type Token = {
  token: string
  refreshToken: string
}

type RequestData = {
  requestData: {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: string
  }
  headers: Headers
}
const defaults: GFWConfig = {
  gatewayUrl: 'https://gateway.api.globalfishingwatch.org',
  version: 'v2',
}

const baseHeaders = new Headers({
  'Content-Type': 'application/json',
  Accept: 'application/json',
})

/**
 * Parse the JSON from a Response object and add the Headers under `_headers`
 * @param response the Response object returned by fetch
 * @returns Promise resolving to the json contents of the response
 */
async function _handleResponse(response: Response) {
  const headers = response.headers
  if (response.ok) {
    // Return empty response on 204 "No content", or Content-Length=0
    if (response.status === 204 || response.headers.get('content-length') === '0')
      return {
        _headers: headers,
      }
    // Otherwise, parse JSON response
    return response.json().then((res) => {
      res._headers = headers // TODO: this creates an array-like object when it adds _headers to an array response
      return res
    })
  } else {
    throw {
      _headers: headers,
      ...(await response.json()),
    }
  }
}
/**
 * Resolve the TEXT parsed from the successful response or reject the JSON from the error
 * @param {Response} response - the Response object returned by Fetch
 * @return {Promise<object>}
 * @throws {Promise<object>}
 * @private
 */
async function _handleResponseTextOrJson(response: Response) {
  let body = await response.text()
  if (response.ok) {
    let results
    try {
      // convert to object if it is a json
      results = JSON.parse(body)
    } catch (e) {
      // it is not a json
      results = body
    }
    return Promise.resolve(results)
  } else {
    let error
    try {
      // convert to object if it is a json
      error = JSON.parse(body)
    } catch (e) {
      // it is not a json
      error = body
    }
    return Promise.reject(error)
  }
}

/**
 * Performs request to the GFW api to refresh the token
 * @param gatewayUrl GFW Api gateway url
 * @param accessToken accessToken to use for logging in
 * @returns Promise resolving to the new token
 */
async function _refreshToken(gatewayUrl: string, refreshToken?: string) {
  const authUrl = getAuthUrl(gatewayUrl)
  const requestData = {
    url: `${authUrl}/token/reload`,
    method: 'GET',
  }
  const headers = {
    'refresh-token': refreshToken,
  }
  console.log('GFW-API. Refreshing token')
  const results = await fetch(requestData.url, {
    method: requestData.method,
    headers: Object.assign({}, baseHeaders, headers) as any,
  }).then(_handleResponseTextOrJson)

  return results
}

/**
 * GFW API client
 */
export class GFW {
  /**
   * GFW Api gateway url
   */
  url: string
  /**
   * GFW Auth gateway url
   */
  auth: string
  /**
   * Configuration variables used by the client
   */
  config: GFWConfig

  /**
   * Creates a new instance of the GFW Api client
   * @param options
   */
  constructor(options: GFWConfig) {
    const config = Object.assign({}, defaults, options)

    this.url = getUrl(config.gatewayUrl, config.version)
    this.auth = getAuthUrl(config.gatewayUrl)
    this.config = config
  }

  /**
   * Performs login against the GFW API with the given access_token
   * and returns the bearer and refresh tokens
   * @param gatewayUrl GFW Api gateway url
   * @param accessToken accessToken to use for logging in
   * @returns Promise resolving to the tokens returned from the API.
   */
  static async login(gatewayUrl: string, accessToken: string): Promise<Token> {
    const authUrl = getAuthUrl(gatewayUrl)
    const requestData = {
      url: `${authUrl}/token?access-token=${accessToken}`,
      method: 'GET',
    }
    const headers = {}
    console.log('GFW-API. Logging in with access token')
    const results = await fetch(requestData.url, {
      method: requestData.method,
      headers: Object.assign({}, baseHeaders, headers),
    }).then(_handleResponseTextOrJson)

    return results
  }

  /**
   * Performs login against the GFW API with the given access_token
   * and stores the bearer and refresh tokens in the client config
   * to be used in the upcoming requests
   * @returns Promise resolving to the tokens returned from the API.
   */
  async login(): Promise<Token> {
    const results = await GFW.login(this.config.gatewayUrl, this.config.accessToken ?? '')

    if (results.token) this.config.bearerToken = results.token
    if (results.refreshToken) this.config.refreshToken = results.refreshToken

    return results
  }

  /**
   * Performs logout against the GFW API with the given refresh_token
   * @param gatewayUrl GFW Api gateway url
   * @param accessToken accessToken to use for logging in
   * @returns Promise resolving an empty object
   */
  static async logout(gatewayUrl: string, refreshToken: string): Promise<any> {
    const authUrl = getAuthUrl(gatewayUrl)
    const requestData = {
      url: `${authUrl}/logout`,
      method: 'GET',
    }
    const headers = {
      'refresh-token': refreshToken,
    }
    console.log('GFW-API. Logout')
    const results = await fetch(requestData.url, {
      method: requestData.method,
      headers: Object.assign({}, baseHeaders, headers),
    }).then(_handleResponseTextOrJson)

    return results
  }

  /**
   * Performs logout against the GFW API with the given access_token
   * and clears the bearer and refresh tokens in the client config
   *
   * @returns Promise resolving an empty object
   */
  async logout(): Promise<any> {
    const results = await GFW.logout(this.config.gatewayUrl, this.config.refreshToken ?? '')

    this.config.bearerToken = ''
    this.config.refreshToken = ''

    return results
  }

  /**
   * Performs request to the GFW api to refresh the token
   * @returns Promise resolving to the new token
   */
  async refreshToken() {
    const results = await _refreshToken(this.config.gatewayUrl, this.config.refreshToken ?? '')

    if (results.token) this.config.bearerToken = results.token

    return results
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
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    resource: string,
    parameters?: Record<string, any>,
    body?: Record<string, any>
  ): RequestData {
    const requestData: any = {
      url: `${this.url}${resource}`,
      method,
    }
    if (parameters) requestData.url += '?' + new URLSearchParams(parameters).toString()

    if (body) requestData.body = JSON.stringify(body)

    const headers = {
      Authorization: `Bearer ${this.config.bearerToken}`,
    }
    return {
      requestData,
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
  private _fetch(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    resource: string,
    parameters?: Record<string, string>,
    body?: Record<string, any>
  ): Promise<Response> {
    const { requestData, headers } = this._makeRequest(method, resource, parameters, body)
    console.log(`GFW-API. ${method} ${resource}`)

    return fetch(requestData.url, {
      headers,
      method: requestData.method,
      ...(requestData.body ? { body: requestData.body } : {}),
    }).then(async (res: Response) => {
      if (!res.ok && res.status === 401 && this.config.refreshToken) {
        return await this.refreshToken()
          // Retry request after refreshing token
          .then(() => this._fetch(method, resource, parameters, body))
          // Token refresh was unsuccessful,
          // returning response from get request
          .catch((_) => res)
      }
      return res
    })
  }

  /**
   * Send a GET request
   * @param resource endpoint
   * @param parameters optional parameters to be send in the query
   * @returns Promise resolving to the response from the API.
   */
  get(resource: string, parameters?: Record<string, string>): Promise<Response> {
    return this._fetch('GET', resource, parameters)
  }

  /**
   * Send a POST request
   * @param resource - endpoint
   * @param body - POST parameters object.
   *   Will be encoded appropriately (JSON or urlencoded) based on the resource
   * @returns Promise resolving to the response from the API.
   */
  post(resource: string, body?: Record<string, any>): Promise<Response> {
    return this._fetch('POST', resource, undefined, body)
  }

  /**
   * Send a PUT request
   * @param resource - endpoint
   * @param parameters optional parameters to be send in the query
   * @param body - PUT parameters object.
   * @returns Promise resolving to the response from the API.
   */
  put(
    resource: string,
    parameters?: Record<string, string>,
    body?: Record<string, any>
  ): Promise<Response> {
    return this._fetch('PUT', resource, parameters, body)
  }

  /**
   * Send a PATCH request
   * @param resource - endpoint
   * @param parameters optional parameters to be send in the query
   * @param body - PUT parameters object.
   * @returns Promise resolving to the response from the API.
   */
  patch(
    resource: string,
    parameters?: Record<string, string>,
    body?: Record<string, any>
  ): Promise<Response> {
    return this._fetch('PATCH', resource, parameters, body)
  }

  /**
   * Send a DELETE request
   * @param resource - endpoint
   * @param parameters optional parameters to be send in the query
   * @param body - PUT parameters object.
   * @returns Promise resolving to the response from the API.
   */
  delete(resource: string, parameters?: Record<string, string>): Promise<Response> {
    return this._fetch('DELETE', resource, parameters)
  }
}

export default GFW
