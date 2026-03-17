import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { createStore as createJotaiStore, Provider as JotaiProvider } from 'jotai'
import type { Store as JotaiStore } from 'jotai/vanilla/store'
import { vi } from 'vitest'
import { page } from 'vitest/browser'
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

  return page.mark('render app', async () => {
    // Load authentication tokens if requested
    if (authenticated) {
      // Fetch tokens only once per test session
      try {
        const response = await fetch('/.auth/tokens.json').catch(() => null)
        if (response?.ok) {
          const tokens = await response.json()
          localStorage.setItem('GFW_API_USER_TOKEN', tokens?.token)
          localStorage.setItem('GFW_API_USER_REFRESH_TOKEN', tokens?.refreshToken)
        }
      } catch {
        console.warn('Authentication requested but tokens not available')
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
  })
}

// Re-export everything else from vitest-browser-react
export * from 'vitest-browser-react'
