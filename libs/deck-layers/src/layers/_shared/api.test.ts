import { beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMock = vi.fn()

vi.mock('@globalfishingwatch/api-client', () => ({
  GFWAPI: {
    token: 'token',
    fetch: (url: string, options: unknown) => fetchMock(url, options),
  },
}))
vi.mock('@loaders.gl/core', () => ({
  parse: (_buffer: ArrayBuffer, _loader: unknown, options: unknown) => options,
}))

const { fetchWithGFWAPI } = await import('./api')

const trackLayer = { props: { loaders: [{ id: 'vessel-tracks' }], loadOptions: {} } }

const trackResponse = (timestampBase?: string) =>
  ({
    headers: new Headers(timestampBase ? { 'timestamp-base': timestampBase } : {}),
    arrayBuffer: async () => new ArrayBuffer(0),
  }) as unknown as Response

describe('fetchWithGFWAPI track timestampBase', () => {
  beforeEach(() => fetchMock.mockReset())

  it('passes the header base to the loader', async () => {
    fetchMock.mockResolvedValue(trackResponse('1735689600000'))
    const options = (await fetchWithGFWAPI('/track', { layer: trackLayer })) as any
    expect(options['vessel-tracks'].timestampBase).toBe(1735689600000)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('refetches past the HTTP cache when the header is missing', async () => {
    fetchMock
      .mockResolvedValueOnce(trackResponse())
      .mockResolvedValueOnce(trackResponse('1735689600000'))
    const options = (await fetchWithGFWAPI('/track', { layer: trackLayer })) as any
    expect(options['vessel-tracks'].timestampBase).toBe(1735689600000)
    expect(fetchMock.mock.calls[1][1]).toMatchObject({ cache: 'reload' })
  })

  it('throws rather than parsing with a base of 0', async () => {
    fetchMock.mockResolvedValue(trackResponse())
    await expect(fetchWithGFWAPI('/track', { layer: trackLayer })).rejects.toThrow(
      'Missing timestamp-base header'
    )
  })
})
