import { FetchOptions, GFW_API_CLASS } from './api-client'

const LAST_API_VERSION = 'v2'

export class GFW_API_CLASS_V2 extends GFW_API_CLASS {

  generateUrl(url: string, version: string | null = null): string {
    return `${version === null ? '/' + LAST_API_VERSION : (version ? '/' + version : '')}${url}`
  }

  fetch<T>(url: string, options: FetchOptions = {}, version: string | null = null) {
    return this._internalFetch<T>(this.generateUrl(url, version), options)
  }

  // TODO: Do the same for other functions? like: download, 
}

export const GFWAPIV2 = new GFW_API_CLASS_V2()
