import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Provider } from 'react-redux'
import { createFileRoute, getRouteApi, useRouter } from '@tanstack/react-router'

import { HINTS } from 'data/config'
import App from 'features/app/App'
import { hydrateHintsDismissed } from 'features/help/hints.slice'
import { setUserLanguage } from 'features/user/user.slice'
import { getAppRouterStore } from 'router/app-router-context'
import { setupRouterSync } from 'router/router-sync'
import { validateRootSearchParams } from 'router/routes.search'
import { makeStore } from 'store'
import type { Locale } from 'types'

import 'utils/polyfills'

import '@globalfishingwatch/timebar/timebar-settings.css'
import '@globalfishingwatch/ui-components/base.css'

const rootRoute = getRouteApi('__root__')

function AppLayout() {
  const router = useRouter()
  const { i18nState } = rootRoute.useLoaderData()
  const routerUnsubcribeRef = useRef<(() => void) | null>(null)

  const store = useMemo(() => {
    // This allows us to inject a store into the router context for testing purposes
    const store = getAppRouterStore(router.options.context) ?? makeStore()
    if (i18nState?.initialLanguage) {
      store.dispatch(setUserLanguage(i18nState.initialLanguage as Locale))
    }
    // eslint-disable-next-line react-hooks/refs
    routerUnsubcribeRef.current = setupRouterSync(router, store)
    return store
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  useEffect(() => {
    return () => routerUnsubcribeRef.current?.()
  }, [store])

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
