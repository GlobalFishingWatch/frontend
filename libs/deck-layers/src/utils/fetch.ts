import { GFWAPI } from '@globalfishingwatch/api-client'

export function getFetchLoadOptions(extraOptions = {}) {
  return {
    fetch: {
      headers: {
        Authorization: `Bearer ${GFWAPI.getToken()}`,
      },
      ...extraOptions,
    },
  }
}
