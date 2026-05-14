import type { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { RouterContextProvider } from '@tanstack/react-router'
import { createStore as createJotaiStore, Provider as JotaiProvider } from 'jotai'
import type { Store as JotaiStore } from 'jotai/vanilla/store'
import { vi } from 'vitest'
import { page } from 'vitest/browser'
import type { RenderOptions } from 'vitest-browser-react'
import { render as vitestRender } from 'vitest-browser-react'

import { GFWAPI, GUEST_USER_TYPE } from '@globalfishingwatch/api-client'

import { fetchUserThunk } from 'features/user/user.slice'
import { setupRouterSync } from 'router/router-sync'

import type { AppStore } from '../store'
import { makeStore } from '../store'

import type { CreateTestRouterOptions, TestRouter } from './utils/router/createTestRouter'
import { createTestRouter } from './utils/router/createTestRouter'

interface AppRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore
  jotaiStore?: JotaiStore
  authenticated?: boolean
  /** Override the TanStack Router used by the test wrapper. */
  router?: TestRouter
  /** Forwarded to `createTestRouter` when no `router` is provided. */
  routerOptions?: CreateTestRouterOptions
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
  const { store, jotaiStore, authenticated, router, routerOptions, ...renderOptions } =
    options || {}

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
        } else {
          throw new Error('Authentication requested but tokens not available')
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
    // Production wires routing in `routes/_app.tsx` via `setupRouterSync(router, store)`;
    // tests mirror that here so hooks like `useSearch`, `useRouter`, and
    // `useReplaceQueryParams` resolve against a real router, and so Redux
    // `state.location` stays in sync via `location/setLocation`.
    const routerToUse = router || createTestRouter(routerOptions)
    // Populate `router.state.matches` so route-aware hooks and `setupRouterSync`
    // see a loaded router. `App` reads search via `useSearch({ from: '/_app' })`
    // so tests do not need `<Matches />` / `matchContext` from `RouterProvider`.
    await routerToUse.load()
    setupRouterSync(routerToUse, storeToUse)

    // Ensure __next element exists for modals
    let rootElement = document.getElementById('__next')
    if (!rootElement) {
      rootElement = document.createElement('div')
      rootElement.id = '__next'
      document.body.appendChild(rootElement)
    }

    function Wrapper({ children }: { children: ReactNode }) {
      return (
        // Order: router outside Redux so hooks can read both contexts.
        <RouterContextProvider router={routerToUse as any}>
          <Provider store={storeToUse}>
            <JotaiProvider store={jotaiStoreToUse}>{children}</JotaiProvider>
          </Provider>
        </RouterContextProvider>
      )
    }

    const rendered = vitestRender(ui, {
      wrapper: Wrapper,
      container: rootElement,
      ...renderOptions,
    })

    return { ...rendered, router: routerToUse }
  })
}

// Re-export everything else from vitest-browser-react
export * from 'vitest-browser-react'
