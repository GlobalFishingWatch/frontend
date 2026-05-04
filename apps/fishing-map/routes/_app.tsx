import { lazy, Suspense, useState } from 'react'
import { Provider } from 'react-redux'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { HINTS } from 'data/config'
import { hydrateHintsDismissed } from 'features/help/hints.slice'
import { setupRouterSync } from 'router/router-sync'
import { validateRootSearchParams } from 'router/routes.search'
import type { AppStore } from 'store'
import { makeStore } from 'store'

import 'utils/polyfills'

import '@globalfishingwatch/ui-components/base.css'
import '@globalfishingwatch/timebar/timebar-settings.css'

const App = lazy(() => import('features/app/App'))º

function AppLayout() {
  const router = useRouter()
  const [store] = useState<AppStore>(() => {
    const s = makeStore()
    setupRouterSync(router, s)
    return s
  })

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
})
