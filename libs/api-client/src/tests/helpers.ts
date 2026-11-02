/* eslint-disable react-hooks/rules-of-hooks, no-empty-pattern -- vitest fixture `use` and its `{}` context, not React */
import type { Mock, TestAPI } from 'vitest'
import { it as base, vi } from 'vitest'

import { GFW_API_CLASS } from '../api-client'

export const createApiClient = (overrides: ConstructorParameters<typeof GFW_API_CLASS>[0] = {}) =>
  new GFW_API_CLASS({
    debug: false,
    baseUrl: 'https://api.example.com',
    version: 'v3',
    ...overrides,
  })

// Minimal cookie jar: keeps only the `name=value` part of each write, so the
// attributes createCookieTokenStorage appends (path, max-age, …) are dropped
export const stubCookieDocument = (initial = '') => {
  let jar = initial
  vi.stubGlobal('document', {
    get cookie() {
      return jar
    },
    set cookie(value: string) {
      jar = value.split(';')[0]
    },
  })
}

type ApiClientFixtures = {
  storage: Storage
  fetchMock: Mock
  client: GFW_API_CLASS
}

// `storage` and `fetchMock` are auto fixtures: every test gets an in-memory localStorage and a
// mocked fetch, even when it does not destructure them, so no test can reach the network.
// The stubs are reverted by `unstubGlobals` in vitest.config.mts.
export const it: TestAPI<ApiClientFixtures> = base.extend<ApiClientFixtures>({
  storage: [
    async ({}, use) => {
      const storage: Record<string, string> = {}
      vi.stubGlobal('localStorage', {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, value: string) => {
          storage[key] = value
        },
        removeItem: (key: string) => {
          delete storage[key]
        },
        clear: () => {
          Object.keys(storage).forEach((k) => delete storage[k])
        },
        length: 0,
        key: () => null,
      })
      await use(globalThis.localStorage)
    },
    { auto: true },
  ],
  fetchMock: [
    // `use` is annotated because Mock is callable, which defeats vitest's fixture-type inference
    async ({}, use: (fetchMock: Mock) => Promise<void>) => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)
      await use(fetchMock)
    },
    { auto: true },
  ],
  // Depends on both stubs so the constructor never sees the real globals
  client: async ({ storage: _storage, fetchMock: _fetchMock }, use) => {
    await use(createApiClient())
  },
})
