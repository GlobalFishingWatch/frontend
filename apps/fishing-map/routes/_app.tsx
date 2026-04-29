import { Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { HINTS } from 'data/config'
import App from 'features/app/App'
import { hydrateHintsDismissed } from 'features/help/hints.slice'
import { setupRouterSync } from 'router/router-sync'
import { validateRootSearchParams } from 'router/routes.search'
import type { AppStore } from 'store'
import { makeStore } from 'store'

import 'utils/polyfills'

import '@globalfishingwatch/ui-components/base.css'
import '@globalfishingwatch/timebar/timebar-settings.css'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  validateSearch: validateRootSearchParams,
})

function AppLayout() {
  const [store] = useState<AppStore>(() => makeStore())
  const router = useRouter()

  useEffect(() => {
    setupRouterSync(router, store)
  }, [router, store])

  useEffect(() => {
    const hintsDismissed = JSON.parse(localStorage.getItem(HINTS) || '{}')
    store.dispatch(hydrateHintsDismissed(hintsDismissed))
  }, [store])

  return (
    <Provider store={store}>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </Provider>
  )
}
