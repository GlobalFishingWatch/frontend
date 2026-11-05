import { beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMock = vi.fn()

vi.mock('@globalfishingwatch/api-client', () => ({
  GFWAPI: {
    token: 'token',
    fetch: (url: string, options: unknown) => fetchMock(url, options),
  },
}))
// Stands in for the parsed track: `length` is the geometry count parseTrack returns (0 for an
// empty response body).
const { parsed } = vi.hoisted(() => ({ parsed: { length: 0 } }))
vi.mock('@loaders.gl/core', () => ({
  parse: (_buffer: ArrayBuffer, _loader: unknown, options: any) => ({
    ...parsed,
    timestampBase: options?.['vessel-tracks']?.timestampBase,
  }),
}))

const { fetchWithGFWAPI, getTileErrorMessage } = await import('./api')

const trackLayer = { props: { loaders: [{ id: 'vessel-tracks' }], loadOptions: {} } }

const trackResponse = (timestampBase?: string) =>
  ({
    headers: new Headers(timestampBase ? { 'timestamp-base': timestampBase } : {}),
    arrayBuffer: async () => new ArrayBuffer(0),
  }) as unknown as Response

describe('fetchWithGFWAPI track timestampBase', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    parsed.length = 1
  })

  it('passes the header base to the loader', async () => {
    fetchMock.mockResolvedValue(trackResponse('1735689600000'))
    const track = (await fetchWithGFWAPI('/track', { layer: trackLayer })) as any
    expect(track.timestampBase).toBe(1735689600000)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('logs when a chunk carrying data has no header', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockResolvedValue(trackResponse())
    const track = (await fetchWithGFWAPI('/track', { layer: trackLayer })) as any
    expect(track.timestampBase).toBeUndefined()
    expect(error).toHaveBeenCalledWith(expect.stringContaining('Missing timestamp-base header'))
    error.mockRestore()
  })

  it('stays quiet for an empty chunk, which has no header by design', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    parsed.length = 0
    fetchMock.mockResolvedValue(trackResponse())
    await fetchWithGFWAPI('/track', { layer: trackLayer })
    expect(error).not.toHaveBeenCalled()
    error.mockRestore()
  })
})

describe('getTileErrorMessage', () => {
  it('skips 404s and keeps other messages', () => {
    expect(getTileErrorMessage(new Error('404 Not Found'))).toBeUndefined()
    expect(getTileErrorMessage(new Error('500 Boom'))).toBe('500 Boom')
  })
})

describe('fetchWithGFWAPI errors', () => {
  it('rethrows an HTTP failure as an Error carrying the status', async () => {
    const response = new Response(null, { status: 404, statusText: 'Not Found' })
    fetchMock.mockRejectedValue(response)
    const error = (await fetchWithGFWAPI('/tile').catch((e) => e)) as Error & { status: number }
    expect(error).toBeInstanceOf(Error)
    // user tile layers skip empty tiles with error.message.includes('404')
    expect(error.message).toBe('404 Not Found')
    expect(error.status).toBe(404)
    expect(error.cause).toBe(response)
  })

  it('passes other rejections through untouched', async () => {
    const abort = new DOMException('aborted', 'AbortError')
    fetchMock.mockRejectedValue(abort)
    await expect(fetchWithGFWAPI('/tile')).rejects.toBe(abort)
  })
})
