import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { createStore as createJotaiStore, Provider as JotaiProvider } from 'jotai'
import type { Store as JotaiStore } from 'jotai/vanilla/store'
import { vi } from 'vitest'
import type { RenderOptions } from 'vitest-browser-react'
import { render as vitestRender } from 'vitest-browser-react'

import { GFWAPI, GUEST_USER_TYPE } from '@globalfishingwatch/api-client'

import { fetchUserThunk } from 'features/user/user.slice'

import type { AppStore } from '../store'
import { makeStore } from '../store'

interface AppRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore
  jotaiStore?: JotaiStore
  authenticated?: boolean
}

// Cache for authentication tokens (fetched once per test session)
let authTokensCache: { token?: string; refreshToken?: string } | null = null
let authTokensFetched = false

export async function withGuestUser(store: AppStore) {
  store.dispatch(
    fetchUserThunk.fulfilled({ id: 0, type: GUEST_USER_TYPE, permissions: [], groups: [] }, '', {
      guest: true,
    })
  )
  return store
}

export async function render(ui: ReactElement, options?: AppRenderOptions) {
  const { store, jotaiStore, authenticated, ...renderOptions } = options || {}

  // Load authentication tokens if requested
  if (authenticated) {
    // Fetch tokens only once per test session
    if (!authTokensFetched) {
      try {
        const response = await fetch('/.auth/tokens.json').catch(() => null)
        if (response?.ok) {
          authTokensCache = await response.json()
        }
      } catch {
        console.warn('Authentication requested but tokens not available')
      }
      authTokensFetched = true
    }

    // Use cached tokens
    if (authTokensCache?.token) {
      localStorage.setItem('GFW_API_USER_TOKEN', authTokensCache.token)
    }
    if (authTokensCache?.refreshToken) {
      localStorage.setItem('GFW_API_USER_REFRESH_TOKEN', authTokensCache.refreshToken)
    }

    // Mock logout to prevent invalidating shared auth tokens
    // This allows tests to call logout without affecting other tests
    vi.spyOn(GFWAPI, 'logout').mockImplementation(async () => {
      // Only clear localStorage, don't make the API call
      localStorage.removeItem('GFW_API_USER_TOKEN')
      localStorage.removeItem('GFW_API_USER_REFRESH_TOKEN')
      return true
    })
  } else {
    // Ensure no tokens are set for non-authenticated tests
    localStorage.removeItem('GFW_API_USER_TOKEN')
    localStorage.removeItem('GFW_API_USER_REFRESH_TOKEN')
  }

  const storeToUse = store || makeStore()
  const jotaiStoreToUse = jotaiStore || createJotaiStore()

  // Ensure __next element exists for modals
  let rootElement = document.getElementById('__next')
  if (!rootElement) {
    rootElement = document.createElement('div')
    rootElement.id = '__next'
    document.body.appendChild(rootElement)
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={storeToUse}>
        <JotaiProvider store={jotaiStoreToUse}>{children}</JotaiProvider>
      </Provider>
    )
  }

  return vitestRender(ui, { wrapper: Wrapper, container: rootElement, ...renderOptions })
}

// Re-export everything else from vitest-browser-react
export * from 'vitest-browser-react'
