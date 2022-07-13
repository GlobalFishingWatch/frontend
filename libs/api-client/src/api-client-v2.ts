import { FetchOptions, GFW_API_CLASS } from './api-client'

export const LAST_API_VERSION = process.env.NEXT_PUBLIC_LAST_API_VERSION || 'v2'
const DEBUG_API_REQUESTS: boolean = process.env.NEXT_PUBLIC_DEBUG_API_REQUESTS === 'true'

export class GFW_API_CLASS_V2 extends GFW_API_CLASS {

  constructor({
    debug = DEBUG_API_REQUESTS,
  } = {}) {
    super({ debug })

  }

  /**
   * 
   * @param url path to the endpoint
   * @param version null to user the last version, '' to don't user version, 'vx' where x is a static version
   * @returns path to the endpoint prefixed with the version
   */
  generateUrl(url: string, version: string | null = null): string {
    return `${version === null ? '/' + LAST_API_VERSION : (version ? '/' + version : '')}${url}`
  }

  fetch<T>(url: string, options: FetchOptions = {}, version: string | null = null) {
    return this._internalFetch<T>(this.generateUrl(url, version), options)
  }

  // TODO: Do the same for other functions? like: download, 
}

export const GFWAPIV2 = new GFW_API_CLASS_V2()
