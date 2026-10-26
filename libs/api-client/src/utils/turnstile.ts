import { getEnv } from './env'
import type { RateLimitDebug } from './rate-limit'
import { RATE_LIMIT_CHALLENGE_ACTION } from './rate-limit'

// https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
// Must be loaded from this exact url, never proxied or bundled
const TURNSTILE_SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad'

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string | undefined
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: Turnstile
    onTurnstileLoad?: () => void
  }
}

let turnstileLoading: Promise<Turnstile> | null = null

function loadTurnstile(debug: RateLimitDebug): Promise<Turnstile> {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile)
  }
  if (!turnstileLoading) {
    debug('turnstile: loading script')
    turnstileLoading = new Promise((resolve, reject) => {
      window.onTurnstileLoad = () => {
        debug('turnstile: script loaded')
        resolve(window.turnstile as Turnstile)
      }
      const script = document.createElement('script')
      script.src = TURNSTILE_SCRIPT_URL
      script.async = true
      script.onerror = () => {
        debug('turnstile: script failed to load')
        turnstileLoading = null
        script.remove()
        reject(new Error('Turnstile script failed to load'))
      }
      document.head.appendChild(script)
    })
  }
  return turnstileLoading
}

/** Runs a Managed challenge that stays invisible unless Cloudflare needs an interaction, resolves with the single-use token */
export async function renderRateLimitChallenge(
  container: HTMLElement,
  { onInteractive, debug }: { onInteractive: () => void; debug: RateLimitDebug }
): Promise<string> {
  const turnstile = await loadTurnstile(debug)
  let widgetId: string | undefined
  try {
    return await new Promise<string>((resolve, reject) => {
      const sitekey = getEnv('VITE_TURNSTILE_SITE_KEY')
      widgetId = turnstile.render(container, {
        sitekey,
        action: RATE_LIMIT_CHALLENGE_ACTION,
        appearance: 'interaction-only',
        'response-field': false,
        callback: (token: string) => {
          debug('turnstile: solved', { tokenLength: token.length })
          resolve(token)
        },
        'before-interactive-callback': () => {
          debug('turnstile: interaction required')
          onInteractive()
        },
        'after-interactive-callback': () => debug('turnstile: interaction finished'),
        'error-callback': (code: string) => {
          debug('turnstile: error', { code })
          reject(new Error(`Turnstile error ${code}`))
        },
        'timeout-callback': () => debug('turnstile: interactive challenge timed out'),
        'unsupported-callback': () => {
          debug('turnstile: unsupported browser')
          reject(new Error('Turnstile unsupported browser'))
        },
      })
      debug('turnstile: widget rendered', { widgetId, sitekey })
    })
  } finally {
    if (widgetId) {
      turnstile.remove(widgetId)
      debug('turnstile: widget removed', { widgetId })
    }
  }
}
