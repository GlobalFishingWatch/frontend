import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { createStore as createJotaiStore, Provider as JotaiProvider } from 'jotai'
import type { Store as JotaiStore } from 'jotai/vanilla/store'
import type { RenderOptions } from 'vitest-browser-react'
import { render as vitestRender } from 'vitest-browser-react'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'

import { fetchUserThunk } from 'features/user/user.slice'

import type { AppStore } from '../store'
import { makeStore } from '../store'

interface AppRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore
  jotaiStore?: JotaiStore
}

export async function withGuestUser(store: AppStore) {
  store.dispatch(
    fetchUserThunk.fulfilled({ id: 0, type: GUEST_USER_TYPE, permissions: [], groups: [] }, '', {
      guest: true,
    })
  )
  return store
}

export function render(ui: ReactElement, options?: AppRenderOptions) {
  const { store, jotaiStore, ...renderOptions } = options || {}

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
