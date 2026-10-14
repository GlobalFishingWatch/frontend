import type { BrowserContext, Request } from 'playwright/test'

import { getRequestUrlAndBody } from './pipe-version'

// Same prefixes as DATASET_*_PREFIX in libs/datasets-client, with an optional `:vX.Y` version
const DATASET_ID = /\b(?:public|private|full)-[a-z0-9-]+(?::v\d+\.\d+)?/g
const MONTENEGRO_CODE = 'mne'

export type ForbiddenDatasetReason = 'private-as-guest' | 'montenegro'

/**
 * The api-client sends `Authorization: Bearer ${token}` on every request, with an empty token
 * for guests. Reading it from the request itself avoids guessing the app's session from the test,
 * which drifts during logout (the token is only wiped after the server logout resolves).
 */
function isGuestRequest(request: Request) {
  const authorization = request.headers()['authorization'] ?? ''
  const token = authorization.replace(/^Bearer\s*/i, '').trim()
  return !token || token === 'undefined' || token === 'null'
}

/**
 * Collects dataset ids sent to the API that must never be requested:
 * - any `private-*` dataset sent without a user token (as a guest)
 * - any Montenegro (`mne`) dataset, logged in or not
 * Keyed by dataset with the reason and the first url that used it
 *
 * CORS preflights are skipped: browsers never send `Authorization` on an OPTIONS preflight, so
 * every authenticated cross-origin request would read as a guest one. Chromium surfaces
 * preflights as `request` events and Firefox does not, so without this logged-in sessions
 * failed in Chromium only.
 */
export function trackForbiddenDatasetRequests(context: BrowserContext) {
  const forbidden = new Map<string, { reason: ForbiddenDatasetReason; url: string }>()

  context.on('request', (request) => {
    if (!request.url().includes('gateway.api.')) return
    if (request.method() === 'OPTIONS') return

    for (const dataset of getRequestUrlAndBody(request).match(DATASET_ID) ?? []) {
      const reason: ForbiddenDatasetReason | undefined = dataset.includes(MONTENEGRO_CODE)
        ? 'montenegro'
        : dataset.startsWith('private-') && isGuestRequest(request)
          ? 'private-as-guest'
          : undefined
      if (reason && !forbidden.has(dataset)) {
        forbidden.set(dataset, { reason, url: request.url() })
      }
    }
  })
  return forbidden
}
