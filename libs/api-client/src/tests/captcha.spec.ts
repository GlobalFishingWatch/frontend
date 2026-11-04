import { describe, expect, vi } from 'vitest'

import { isCaptchaError, isSessionError } from '../utils/errors'
import { processStatus } from '../utils/parse'
import { renderCaptchaChallenge } from '../utils/turnstile'

import { it } from './helpers'

vi.mock('../utils/turnstile', () => ({
  renderCaptchaChallenge: vi.fn(() => Promise.resolve('turnstile-token')),
}))

const tokensResponse = () =>
  new Response(JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }), {
    status: 200,
  })

// A widget nobody solves, it only settles when GFWAPI aborts it
const pendingChallenge = (_: HTMLElement, { signal }: { signal: AbortSignal }) =>
  new Promise<string>((_, reject) =>
    signal.addEventListener('abort', () => reject(signal.reason), { once: true })
  )

const captchaRejected = () =>
  new Response(JSON.stringify({ error: 'invalid captcha' }), { status: 401 })

describe('captcha', () => {
  it('sends a fresh token when retrying after a token refresh', async ({
    client,
    fetchMock,
    storage,
  }) => {
    storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')
    vi.mocked(renderCaptchaChallenge)
      .mockResolvedValueOnce('token-1')
      .mockResolvedValueOnce('refresh-token-captcha')
      .mockResolvedValueOnce('token-2')
    client.setCaptchaContainer(document.createElement('div'))
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'expired' }), { status: 401 }))
      .mockResolvedValueOnce(tokensResponse())
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))

    await expect(client.fetch('/protected', { captcha: 'some-action' })).resolves.toEqual({
      ok: true,
    })
    const tokens = fetchMock.mock.calls.map(([, init]) => init.headers['x-captcha-token'])
    expect(tokens).toEqual(['token-1', 'refresh-token-captcha', 'token-2'])
    expect(vi.mocked(renderCaptchaChallenge)).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ action: 'some-action' })
    )
    expect(client.getCaptchaChallengeState()).toEqual({ status: 'idle' })
  })

  it('does not retry a protected request on 5xx', async ({ client, fetchMock }) => {
    client.setCaptchaContainer(document.createElement('div'))
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'captcha verification unavailable' }), { status: 503 })
    )

    await expect(client.fetch('/protected', { captcha: 'some-action' })).rejects.toMatchObject({
      status: 503,
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('sends no token without a container, nor on unprotected requests', async ({
    client,
    fetchMock,
  }) => {
    fetchMock.mockImplementation(async () => new Response('{}', { status: 200 }))

    await client.fetch('/protected', { captcha: 'some-action' })
    client.setCaptchaContainer(document.createElement('div'))
    await client.fetch('/unprotected')

    expect(fetchMock.mock.calls.map(([, init]) => init.headers['x-captcha-token'])).toEqual([
      undefined,
      undefined,
    ])
  })

  it('does not refresh the session when the gateway rejects the captcha', async ({
    client,
    fetchMock,
    storage,
  }) => {
    storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')
    client.setCaptchaContainer(document.createElement('div'))
    fetchMock.mockResolvedValueOnce(captchaRejected())

    await expect(client.fetch('/protected', { captcha: 'some-action' })).rejects.toMatchObject({
      status: 401,
      message: 'invalid captcha',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('sends the refresh token captcha to the reload endpoint', async ({
    client,
    fetchMock,
    storage,
  }) => {
    storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')
    client.setCaptchaContainer(document.createElement('div'))
    fetchMock.mockResolvedValueOnce(tokensResponse())

    await client.refreshAPIToken()

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toContain('/auth/tokens/reload')
    expect(init.headers).toMatchObject({
      'refresh-token': 'refresh',
      'x-captcha-token': 'turnstile-token',
    })
    expect(vi.mocked(renderCaptchaChallenge)).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ action: 'refresh-token' })
    )
  })

  it('hands the captcha token to the refreshStrategy', async ({ client }) => {
    const refreshStrategy = vi.fn(async () => ({ token: 't', refreshToken: 'r' }))
    client.configure({ refreshStrategy })
    client.setCaptchaContainer(document.createElement('div'))

    await client.refreshAPIToken()

    expect(refreshStrategy).toHaveBeenCalledWith('turnstile-token')
  })

  it('keeps the session when the refresh captcha is rejected', async ({
    client,
    fetchMock,
    storage,
  }) => {
    storage.setItem('GFW_API_USER_TOKEN', 'expired')
    storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')
    const sessionInvalidateStrategy = vi.fn()
    client.configure({ sessionInvalidateStrategy })
    client.setCaptchaContainer(document.createElement('div'))
    fetchMock
      .mockResolvedValueOnce(new Response('{}', { status: 401 }))
      .mockResolvedValueOnce(captchaRejected())

    await expect(client.fetch('/me')).rejects.toMatchObject({ status: 401 })
    expect(sessionInvalidateStrategy).not.toHaveBeenCalled()
    expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBe('refresh')
    expect(isSessionError({ status: 401, message: 'invalid captcha' })).toBe(false)
  })

  it('cancelling a widget rejects its request and frees the queue', async ({
    client,
    fetchMock,
  }) => {
    vi.mocked(renderCaptchaChallenge).mockImplementationOnce(pendingChallenge)
    client.setCaptchaContainer(document.createElement('div'))
    fetchMock.mockImplementation(async () => new Response('{}', { status: 200 }))

    const cancelled = client.fetch('/protected', { captcha: 'some-action' })
    const next = client.fetch('/protected', { captcha: 'some-action' })
    await vi.waitFor(() => expect(client.getCaptchaChallengeState().status).toBe('solving'))
    client.cancelCaptcha()

    await expect(cancelled).rejects.toThrow('GFWAPI: captcha cancelled')
    await expect(next).resolves.toEqual({})
    expect(fetchMock.mock.calls.map(([, init]) => init.headers['x-captcha-token'])).toEqual([
      'turnstile-token',
    ])
  })

  it('an aborted request gives up its widget', async ({ client, fetchMock }) => {
    vi.mocked(renderCaptchaChallenge).mockImplementationOnce(pendingChallenge)
    client.setCaptchaContainer(document.createElement('div'))
    const controller = new AbortController()

    const request = client.fetch('/protected', {
      captcha: 'some-action',
      signal: controller.signal,
    })
    await vi.waitFor(() => expect(client.getCaptchaChallengeState().status).toBe('solving'))
    controller.abort()

    await expect(request).rejects.toThrow()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(client.getCaptchaChallengeState()).toEqual({ status: 'idle' })
  })

  it('sends the request without a token when the container goes away mid-solve', async ({
    client,
    fetchMock,
  }) => {
    vi.mocked(renderCaptchaChallenge).mockImplementationOnce(pendingChallenge)
    const container = document.createElement('div')
    client.setCaptchaContainer(container)
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 200 }))

    const request = client.fetch('/protected', { captcha: 'some-action' })
    await vi.waitFor(() => expect(client.getCaptchaChallengeState().status).toBe('solving'))
    client.clearCaptchaContainer(container)

    await expect(request).resolves.toEqual({})
    expect(fetchMock.mock.calls[0][1].headers['x-captcha-token']).toBeUndefined()
  })

  it.for([
    { name: 'the widget fails', status: undefined },
    { name: 'the gateway cannot verify it', status: 503 },
  ])(
    'does not retry the token reload when $name',
    async ({ status }, { client, fetchMock, storage }) => {
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')
      client.setCaptchaContainer(document.createElement('div'))
      if (status) {
        fetchMock.mockResolvedValue(
          new Response(JSON.stringify({ error: 'captcha verification unavailable' }), { status })
        )
      } else {
        vi.mocked(renderCaptchaChallenge).mockRejectedValueOnce(new Error('Turnstile error 110200'))
      }

      await expect(client.refreshAPIToken()).rejects.toBeDefined()
      expect(vi.mocked(renderCaptchaChallenge)).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledTimes(status ? 1 : 0)
    }
  )

  it('solves the refresh captcha before taking the cross-tab lock', async ({ client }) => {
    const order: string[] = []
    vi.mocked(renderCaptchaChallenge).mockImplementationOnce(async () => {
      order.push('captcha')
      return 'turnstile-token'
    })
    vi.stubGlobal('navigator', {
      locks: {
        request: (_: string, run: () => Promise<unknown>) => {
          order.push('lock')
          return run()
        },
      },
    })
    client.configure({ refreshStrategy: async () => ({ token: 't', refreshToken: 'r' }) })
    client.setCaptchaContainer(document.createElement('div'))

    await client.refreshAPIToken()

    expect(order).toEqual(['captcha', 'lock'])
  })

  it('reads the error of a 5xx body, so a 503 captcha answer is recognized', async () => {
    const response = new Response(JSON.stringify({ error: 'captcha verification unavailable' }), {
      status: 503,
      statusText: 'Service Unavailable',
    })

    const error = await processStatus(response).catch((e) => e)

    expect(error).toMatchObject({ status: 503, message: 'captcha verification unavailable' })
    expect(isCaptchaError(error)).toBe(true)
  })
})
