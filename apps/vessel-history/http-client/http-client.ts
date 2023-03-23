import { GFW_API_CLASS } from '@globalfishingwatch/api-client'
import { CUSTOM_ACCESS_TOKEN, IS_STANDALONE_APP } from 'data/config'

export class STANDALONE_GFW_API_CLASS extends GFW_API_CLASS {
  setToken(token: string) {
    this.token = token
    if (CUSTOM_ACCESS_TOKEN) {
      localStorage.setItem(this.storageKeys.token, CUSTOM_ACCESS_TOKEN)
    } else {
      if (token) {
        localStorage.setItem(this.storageKeys.token, token)
      } else {
        localStorage.removeItem(this.storageKeys.token)
      }
    }
    if (this.debug) {
      console.log('GFWApiClient: updated token with', token)
    }
  }

  getToken() {
    return this.token || CUSTOM_ACCESS_TOKEN
  }

  getRefreshToken() {
    return IS_STANDALONE_APP ? null : this.refreshToken
  }
}

export const GFWApiClient = new STANDALONE_GFW_API_CLASS()
