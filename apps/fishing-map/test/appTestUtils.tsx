import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import type { RenderOptions } from 'vitest-browser-react'
import { render as vitestRender } from 'vitest-browser-react'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'

import { fetchUserThunk } from 'features/user/user.slice'

import type { AppStore } from '../store'
import { makeStore } from '../store'

interface AppRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore
}

export async function withGuestUser(store: AppStore) {
  store.dispatch(
    fetchUserThunk.fulfilled(
      { id: 0, type: GUEST_USER_TYPE, permissions: [], groups: [] },
      '',
      { guest: true }
    )
  )
  return store
}

export function render(ui: ReactElement, options?: AppRenderOptions) {
  const { store, ...renderOptions } = options || {}

  const storeToUse = store || makeStore()

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={storeToUse}>{children}</Provider>
  }

  return vitestRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything else from vitest-browser-react
export * from 'vitest-browser-react'
