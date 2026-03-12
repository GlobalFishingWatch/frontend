import { lazy, Suspense, useEffect } from 'react'
import { Provider } from 'react-redux'
import { createFileRoute, useRouter } from '@tanstack/react-router'

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
  const router = useRouter()

  useEffect(() => {
    setupRouterSync(router, store)
  }, [router])

  return (
    <Provider store={store}>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </Provider>
  )
}
