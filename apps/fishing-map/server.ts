import server, { createServerEntry } from '@tanstack/react-start/server-entry'

import { proxy } from './proxy'

export default createServerEntry({
  async fetch(request, opts) {
    const result = proxy(request)

    if (result.type === 'response') {
      return result.response
    }

    const requestToUse = result.type === 'request' ? result.request : request
    return server.fetch(requestToUse, opts)
  },
})
