import { GFW_API_CLASS,GFWAPI } from '@globalfishingwatch/api-client'

import { CUSTOM_ACCESS_TOKEN, IS_STANDALONE_APP } from 'data/config'

export class STANDALONE_GFW_API_CLASS extends GFW_API_CLASS {
  setToken(token: string) {
    this.token = token
    if (this.debug) {
      console.log('GFWApiClient: no need to set token')
    }
  }

  getToken() {
    return CUSTOM_ACCESS_TOKEN
  }

  getRefreshToken() {
    return null
  }
}

// it's not possible to keep only the extended because internally the library use
// another instance and don't have token
export const GFWApiClient = IS_STANDALONE_APP ? new STANDALONE_GFW_API_CLASS() : GFWAPI
