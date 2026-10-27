import { describe, expect, vi } from 'vitest'

import { isVisualizationRateLimitedUrl, parseRateLimit } from '../utils/rate-limit'
import { renderRateLimitChallenge } from '../utils/turnstile'

import { createApiClient, it } from './helpers'

vi.mock('../utils/turnstile', () => ({
  renderRateLimitChallenge: vi.fn(() => Promise.resolve('turnstile-token')),
}))

const rateLimitedResponse = (status: number, remaining: number) =>
  new Response(JSON.stringify({ ok: status < 400 }), {
    status,
    headers: { 'Ratelimit-Remaining': String(remaining), 'Ratelimit-Limit': '10' },
  })

describe('rate limit', () => {
  it('matches only track visualisation and events urls', () => {
    expect(isVisualizationRateLimitedUrl('/v3/vessels/abc/tracks?start-date=2024')).toBe(true)
    expect(isVisualizationRateLimitedUrl('https://gw.org/v3/events?vessels=abc')).toBe(true)
    expect(isVisualizationRateLimitedUrl('/v3/vessels/abc,def/tracks/download?format=csv')).toBe(
      false
    )
    expect(isVisualizationRateLimitedUrl('/v3/events/stats')).toBe(false)
    expect(isVisualizationRateLimitedUrl('/v3/vessels/search')).toBe(false)
  })

  it('parses the rate limit headers', () => {
    expect(parseRateLimit(rateLimitedResponse(200, 4))).toEqual({
      remaining: 4,
      limit: 10,
      retryAfter: 0,
      reset: undefined,
    })
  })

  it('parks a 429, resets the limit with the challenge token and retries', async ({
    client,
    fetchMock,
  }) => {
    client.setRateLimitChallengeContainer(document.createElement('div'))
    fetchMock
      .mockResolvedValueOnce(rateLimitedResponse(429, 0))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(rateLimitedResponse(200, 10))

    await expect(client.fetch('/vessels/abc/tracks')).resolves.toEqual({ ok: true })

    const [resetUrl, resetInit] = fetchMock.mock.calls[1]
    expect(resetUrl).toBe('https://api.example.com/v3/auth/rate-limit/reset')
    expect(resetInit.body).toBe(JSON.stringify({ token: 'turnstile-token' }))
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(client.getRateLimitChallengeState()).toBe('idle')
  })

  it('keeps the request parked when the reset fails, until the user retries', async ({
    client,
    fetchMock,
  }) => {
    client.setRateLimitChallengeContainer(document.createElement('div'))
    fetchMock
      .mockResolvedValueOnce(rateLimitedResponse(429, 0))
      .mockResolvedValueOnce(new Response(null, { status: 403 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(rateLimitedResponse(200, 10))

    const request = client.fetch('/vessels/abc/tracks')
    await vi.waitFor(() => expect(client.getRateLimitChallengeState()).toBe('failed'))

    client.retryRateLimitChallenge()
    await expect(request).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect(client.getRateLimitChallengeState()).toBe('idle')
  })

  it('calls every reset listener even when one throws, and keeps the reset successful', async ({
    client,
  }) => {
    client.setRateLimitChallengeContainer(document.createElement('div'))
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(rateLimitedResponse(429, 0))
        .mockResolvedValueOnce(new Response(null, { status: 204 }))
        .mockResolvedValueOnce(rateLimitedResponse(200, 10))
    )
    const failingListener = vi.fn(() => {
      throw new Error('layer already removed')
    })
    const listener = vi.fn()
    client.onRateLimitReset(failingListener)
    client.onRateLimitReset(listener)

    await expect(client.fetch('/vessels/abc/tracks')).resolves.toEqual({ ok: true })
    expect(failingListener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(client.getRateLimitChallengeState()).toBe('idle')
  })

  it('rejects parked requests with their 429 when the user cancels', async ({ client }) => {
    client.setRateLimitChallengeContainer(document.createElement('div'))
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(rateLimitedResponse(429, 0))
        .mockResolvedValueOnce(new Response(null, { status: 403 }))
    )

    const request = client.fetch('/vessels/abc/tracks')
    await vi.waitFor(() => expect(client.getRateLimitChallengeState()).toBe('failed'))

    client.cancelRateLimitChallenge()
    await expect(request).rejects.toMatchObject({ status: 429 })
    expect(client.getRateLimitChallengeState()).toBe('cancelled')
  })

  it.for([
    { debug: 'request', request: true, auth: false, rateLimit: false },
    { debug: 'auth', request: false, auth: true, rateLimit: false },
    { debug: 'rate-limit', request: false, auth: false, rateLimit: true },
    { debug: true, request: true, auth: true, rateLimit: true },
    { debug: false, request: false, auth: false, rateLimit: false },
  ] as const)('debug $debug only logs its scope', async ({ debug, request, auth, rateLimit }) => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const client = createApiClient({ debug })
    client.setRateLimitChallengeContainer(document.createElement('div'))
    client.configure({ baseUrl: 'https://api.example.com' })
    // No refresh token stored: logs an [auth] warning and rejects
    await client.refreshAPIToken().catch(() => {})

    const messages = [...log.mock.calls, ...warn.mock.calls].map(([message]) => String(message))
    expect(messages.some((m) => m.startsWith('GFWAPI:'))).toBe(request)
    expect(messages.some((m) => m.startsWith('[auth]'))).toBe(auth)
    expect(messages.some((m) => m.startsWith('[rate-limit]'))).toBe(rateLimit)
    log.mockRestore()
    warn.mockRestore()
  })

  it('rejects the 429 as before when no challenge container is set', async ({
    client,
    fetchMock,
  }) => {
    fetchMock.mockResolvedValue(rateLimitedResponse(429, 0))

    await expect(client.fetch('/vessels/abc/tracks')).rejects.toMatchObject({ status: 429 })
  })

  it('ignores a clear from a container that was already replaced', async ({
    client,
    fetchMock,
  }) => {
    const replaced = document.createElement('div')
    client.setRateLimitChallengeContainer(replaced)
    client.setRateLimitChallengeContainer(document.createElement('div'))
    client.clearRateLimitChallengeContainer(replaced)
    fetchMock
      .mockResolvedValueOnce(rateLimitedResponse(429, 0))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(rateLimitedResponse(200, 10))

    // Still enabled: the request is parked and retried instead of rejected
    await expect(client.fetch('/vessels/abc/tracks')).resolves.toEqual({ ok: true })
  })

  it('rejects parked requests when the container is removed mid-challenge', async ({
    client,
    fetchMock,
  }) => {
    vi.mocked(renderRateLimitChallenge).mockReturnValueOnce(new Promise(() => {}))
    const container = document.createElement('div')
    client.setRateLimitChallengeContainer(container)
    fetchMock.mockResolvedValueOnce(rateLimitedResponse(429, 0))

    const request = client.fetch('/vessels/abc/tracks')
    await vi.waitFor(() => expect(client.getRateLimitChallengeState()).toBe('solving'))

    client.clearRateLimitChallengeContainer(container)
    await expect(request).rejects.toMatchObject({ status: 429 })
    expect(client.getRateLimitChallengeState()).toBe('idle')
  })

  it('moves a running challenge to a new container', async ({ client, fetchMock }) => {
    vi.mocked(renderRateLimitChallenge).mockReturnValueOnce(new Promise(() => {}))
    const previous = document.createElement('div')
    const next = document.createElement('div')
    client.setRateLimitChallengeContainer(previous)
    fetchMock
      .mockResolvedValueOnce(rateLimitedResponse(429, 0))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(rateLimitedResponse(200, 10))

    const request = client.fetch('/vessels/abc/tracks')
    await vi.waitFor(() => expect(client.getRateLimitChallengeState()).toBe('solving'))

    client.setRateLimitChallengeContainer(next)
    client.clearRateLimitChallengeContainer(previous)
    await expect(request).resolves.toEqual({ ok: true })
    expect(vi.mocked(renderRateLimitChallenge)).toHaveBeenLastCalledWith(next, expect.anything())
  })
})
