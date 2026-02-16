import { lazy, Suspense, useEffect } from 'react'
import { Provider } from 'react-redux'
import { createFileRoute } from '@tanstack/react-router'

import { getRouterRef } from 'router/router-ref'
import { setupRouterSync } from 'router/router-sync'
import { validateRootSearchParams } from 'router/routes.search'
import { makeStore } from 'store'

import 'utils/polyfills'
import 'features/i18n/i18n'

import '@globalfishingwatch/ui-components/base.css'
import '@globalfishingwatch/timebar/timebar-settings.css'

const App = lazy(() => import('features/app/App'))

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  validateSearch: validateRootSearchParams,
})

const store = makeStore()
function AppLayout() {
  useEffect(() => {
    setupRouterSync(getRouterRef(), store)
  }, [])

  return (
    <Provider store={store}>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </Provider>
  )
}
