import type { MockInstance } from 'vitest'
import { expect, vi } from 'vitest'
import { page } from 'vitest/browser'

import type { GFW_API_CLASS } from '@globalfishingwatch/api-client'
import { GFWAPI } from '@globalfishingwatch/api-client'

type GFWFetchSpy = MockInstance<GFW_API_CLASS['fetch']>

const assertRequestReceived = vi.defineHelper(
  (spy: GFWFetchSpy, matchingCallIndices: number[]) => {
    expect(matchingCallIndices.length).toBeGreaterThan(0)
    return Promise.all(
      matchingCallIndices.map((i) => spy.mock.results[i]?.value).filter(Boolean)
    )
  }
)

export class GFWAPITestUtils {
  private fetchSpy: GFWFetchSpy

  constructor() {
    this.fetchSpy = vi.spyOn(GFWAPI, 'fetch')
  }

  async waitForRequest(urlFilter: string, options?: { timeout?: number }) {
    const spy = this.fetchSpy

    await page.mark(`waitForRequest: ${urlFilter}`, async () => {
      await vi.waitFor(
        async () => {
          const matchingCalls = spy.mock.calls
            .map((_, i) => i)
            .filter((i) => {
              const [url] = spy.mock.calls[i]
              return typeof url === 'string' && url.includes(urlFilter)
            })

          await assertRequestReceived(spy, matchingCalls)
        },
        { timeout: options?.timeout ?? 15000 }
      )
    })
  }
}
