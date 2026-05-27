import type { ReactNode } from 'react'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { createStore as createJotaiStore, Provider as JotaiProvider } from 'jotai'
import type { Store as JotaiStore } from 'jotai/vanilla/store'
import { vi } from 'vitest'
import { page } from 'vitest/browser'
import type { RenderOptions } from 'vitest-browser-react'
import { render as vitestRender } from 'vitest-browser-react'

import { GFWAPI, GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import { PATH_BASENAME, ROOT_DOM_ELEMENT } from 'data/config'
import { fetchUserThunk } from 'features/user/user.slice'
import type { AppRouterContext } from 'router/app-router-context'
import type { LocationState } from 'router/location.slice'
import { ROUTE_PATHS } from 'router/routes.utils'

import { getCreateRouterOptions } from '../router'
import type { AppStore } from '../store'
import { makeStore } from '../store'

export interface AppRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore
  jotaiStore?: JotaiStore
  authenticated?: boolean
}

function buildInitialHref(location: LocationState): string {
  const search = stringifyWorkspace(location.query)
  const pathname = location.pathname?.startsWith(PATH_BASENAME)
    ? location.pathname
    : `${PATH_BASENAME}${location.to === ROUTE_PATHS.HOME ? '/' : location.pathname || '/'}`
  return `${pathname}${search ? `?${search}` : ''}`
}

function seedBrowserHistory(location?: LocationState) {
  if (!location || typeof window === 'undefined') return
  window.history.replaceState(null, '', buildInitialHref(location))
}

export async function withGuestUser(store: AppStore) {
  store.dispatch(
    fetchUserThunk.fulfilled({ id: 0, type: GUEST_USER_TYPE, permissions: [], groups: [] }, '', {
      guest: true,
    })
  )
  return store
}

export async function render(options: AppRenderOptions = {}) {
  const { store, jotaiStore, authenticated, ...renderOptions } = options

  return page.mark('render app', async () => {
    if (authenticated) {
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

      vi.spyOn(GFWAPI, 'logout').mockImplementation(async () => {
        localStorage.removeItem('GFW_API_USER_TOKEN')
        localStorage.removeItem('GFW_API_USER_REFRESH_TOKEN')
        return true
      })
    } else {
      localStorage.removeItem('GFW_API_USER_TOKEN')
      localStorage.removeItem('GFW_API_USER_REFRESH_TOKEN')
    }

    const storeToUse = store || makeStore()
    const jotaiStoreToUse = jotaiStore || createJotaiStore()

    const location = storeToUse.getState().location
    // HOME is always the initial route — seeding is for the search params (lat/lng/zoom),
    // not the pathname. Without this, the router boots at bare /map/ and setupRouterSync
    // overwrites location.query from the URL, dropping the fixture's viewport.
    seedBrowserHistory(location)

    const router = createRouter({
      ...getCreateRouterOptions(),
      // Inject the store into the router context for integration tests
      context: { store: storeToUse } satisfies AppRouterContext,
    })

    let rootElement = document.getElementById(ROOT_DOM_ELEMENT)
    if (!rootElement) {
      rootElement = document.createElement('div')
      rootElement.id = ROOT_DOM_ELEMENT
      document.body.appendChild(rootElement)
    }

    function Wrapper({ children }: { children: ReactNode }) {
      return <JotaiProvider store={jotaiStoreToUse}>{children}</JotaiProvider>
    }

    const renderResult = await vitestRender(<RouterProvider router={router} />, {
      wrapper: Wrapper,
      container: rootElement,
      ...renderOptions,
    })

    return Object.assign(renderResult, { router, store: storeToUse })
  })
}

export * from 'vitest-browser-react'
