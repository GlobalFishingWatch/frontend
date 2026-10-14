import type { BrowserContext, Request } from 'playwright/test'

const PIPE_4_DATASET = /\b[a-z0-9-]+:v4\.\d+\b/g

export function getRequestUrlAndBody(request: Request) {
  const raw = `${request.url()} ${request.postData() ?? ''}`
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

/** Collects pipe 4 dataset ids sent to the API, keyed by dataset with the first url that used it */
export function trackPipe4Requests(context: BrowserContext) {
  const pipe4Requests = new Map<string, string>()
  context.on('request', (request) => {
    if (!request.url().includes('gateway.api.')) return
    for (const dataset of getRequestUrlAndBody(request).match(PIPE_4_DATASET) ?? []) {
      if (!pipe4Requests.has(dataset)) pipe4Requests.set(dataset, request.url())
    }
  })
  return pipe4Requests
}
