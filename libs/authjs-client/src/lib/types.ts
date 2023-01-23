export type GFWConfigParams = {
  gatewayUrl?: string
  version?: string
  debug?: boolean
  accessToken?: string
  bearerToken?: string
  refreshToken?: string
}

// GFWConfig is the same as GFWConfigParams, but with gatewayUrl required.
export type GFWConfig = Omit<GFWConfigParams, 'gatewayUrl'> & { gatewayUrl: string }

export type Token = {
  token: string
  refreshToken: string
}

export type RequestDataMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type RequestData = {
  request: {
    url: string
    method: RequestDataMethod
    body?: string
  }
  headers: Headers
}
