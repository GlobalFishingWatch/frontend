import { createFileRoute } from '@tanstack/react-router'

import { RATE_LIMIT_CHALLENGE_ACTION } from '@globalfishingwatch/api-client'

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

// Local stand-in for the GFW API rate-limit reset endpoint (RATE_LIMIT_RESET_PATH in libs/api-client).
// GFWAPI calls it when VITE_RATE_LIMIT_RESET_URL points here. Delete once the API ships the endpoint.
export const Route = createFileRoute('/api/rate-limit/reset')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        if (!import.meta.env.DEV) {
          return new Response(null, { status: 404 })
        }
        const { isSameOrigin, forbiddenResponse } = await import('server/api/utils/request')
        if (!isSameOrigin(request)) {
          return forbiddenResponse()
        }
        const secret = process.env.TURNSTILE_SECRET_KEY
        if (!secret) {
          return Response.json(
            { success: false, message: 'TURNSTILE_SECRET_KEY is not set' },
            { status: 500 }
          )
        }
        const { token } = await request.json().catch(() => ({}))
        if (typeof token !== 'string' || !token) {
          return Response.json({ success: false, message: 'token is required' }, { status: 400 })
        }

        // https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
        const result = await fetch(SITEVERIFY_URL, {
          method: 'POST',
          body: new URLSearchParams({ secret, response: token }),
        }).then((response) => response.json())
        console.log('[rate-limit] siteverify', {
          success: result.success,
          action: result.action,
          hostname: result.hostname,
          errors: result['error-codes'],
        })

        // Cloudflare's test keys return no action
        const actionMatches =
          result.action === RATE_LIMIT_CHALLENGE_ACTION || result.metadata?.result_with_testing_key
        if (!result.success || !actionMatches) {
          return Response.json(
            { success: false, errors: result['error-codes'] ?? ['action-mismatch'] },
            { status: 403 }
          )
        }

        const limit = import.meta.env.VITE_RATE_LIMIT_MOCK_LIMIT || '10'
        return new Response(null, {
          status: 204,
          headers: { 'Ratelimit-Limit': limit, 'Ratelimit-Remaining': limit },
        })
      },
    },
  },
})
