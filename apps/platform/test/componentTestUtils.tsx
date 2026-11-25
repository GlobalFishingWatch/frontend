import type { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { createStore as createJotaiStore, Provider as JotaiProvider } from 'jotai'
import type { RenderOptions } from 'vitest-browser-react'
import { render as vitestRender } from 'vitest-browser-react'

import { getGuestUser } from '@globalfishingwatch/api-client'

import { setLoggedUser } from 'features/_user/user.slice'
import type { AppRouterContext } from 'router/app-router-context'

import type { AppStore } from '../store/store'
import { makeStore } from '../store/store'

import type { JotaiStore } from './appTestUtils'

// Kept apart from appTestUtils.tsx on purpose: that file imports the app router, and with it every
// route. A component spec importing from there would depend on the whole app.

export async function withGuestUser(store: AppStore) {
  store.dispatch(setLoggedUser(getGuestUser()))
  return store
}

export interface ComponentRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore
  jotaiStore?: JotaiStore
}

/**
 * Renders one component instead of the app: Redux, Jotai and a memory router whose only route
 * renders `ui`. For component tests next to the code.
 */
export async function renderComponent(ui: ReactNode, options: ComponentRenderOptions = {}) {
  const { store = makeStore(), jotaiStore = createJotaiStore(), ...renderOptions } = options

  const rootRoute = createRootRouteWithContext<AppRouterContext>()({ component: () => ui })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
    context: { store },
    defaultOnCatch: (error) => reportError(error),
  })
  await router.load()

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ReduxProvider store={store}>
        <JotaiProvider store={jotaiStore}>{children}</JotaiProvider>
      </ReduxProvider>
    )
  }

  const renderResult = await vitestRender(<RouterProvider router={router} />, {
    wrapper: Wrapper,
    ...renderOptions,
  })
  return Object.assign(renderResult, { router, store, jotaiStore })
}
