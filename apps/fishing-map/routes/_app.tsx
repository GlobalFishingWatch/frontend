import { Suspense, useEffect, useMemo } from 'react'
import { Provider } from 'react-redux'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { HINTS } from 'data/config'
import App from 'features/app/App'
import { hydrateHintsDismissed } from 'features/help/hints.slice'
import { getAppRouterStore } from 'router/app-router-context'
import { setupRouterSync } from 'router/router-sync'
import { validateRootSearchParams } from 'router/routes.search'
import { makeStore } from 'store'

import 'utils/polyfills'

import '@globalfishingwatch/timebar/timebar-settings.css'
import '@globalfishingwatch/ui-components/base.css'

function AppLayout() {
  const router = useRouter()
  const store = useMemo(() => {
    // This allows us to inject a store into the router context for testing purposes
    const store = getAppRouterStore(router.options.context) ?? makeStore()
    setupRouterSync(router, store)
    return store
  }, [router])

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

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  validateSearch: validateRootSearchParams,
  // loaderDeps: ({ search }) => ({}),
  // loader: async ({ deps }) => { },
})
