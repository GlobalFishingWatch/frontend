import type { BrowserContext, Request } from 'playwright/test'

const API_HOST = 'gateway.api.'
const PIPE_4_DATASET = /\b[a-z0-9-]+:v4\.\d+\b/g

function getRequestText(request: Request) {
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
    if (!request.url().includes(API_HOST)) return
    for (const dataset of getRequestText(request).match(PIPE_4_DATASET) ?? []) {
      if (!pipe4Requests.has(dataset)) pipe4Requests.set(dataset, request.url())
    }
  })
  return pipe4Requests
}
