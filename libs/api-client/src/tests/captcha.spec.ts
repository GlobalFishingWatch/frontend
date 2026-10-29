import { describe, expect, vi } from 'vitest'

import { isSessionError } from '../utils/errors'
import { renderCaptchaChallenge } from '../utils/turnstile'

import { it } from './helpers'

vi.mock('../utils/turnstile', () => ({
  renderCaptchaChallenge: vi.fn(() => Promise.resolve('turnstile-token')),
}))

const tokensResponse = () =>
  new Response(JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }), {
    status: 200,
  })

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
})
