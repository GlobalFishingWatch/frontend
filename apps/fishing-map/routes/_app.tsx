import { Suspense, useEffect, useMemo } from 'react'
import { Provider } from 'react-redux'
import { createFileRoute, getRouteApi, useRouter } from '@tanstack/react-router'

import { getGuestUser } from '@globalfishingwatch/api-client'

import { HINTS } from 'data/config'
import App from 'features/app/App'
import { hydrateHintsDismissed } from 'features/help/hints.slice'
import { getActiveI18nLanguage } from 'features/i18n/i18n'
import { setLoggedUser, setUserLanguage } from 'features/user/user.slice'
import {
  getPersistedHistoryNavigation,
  hydrateWorkspaceHistoryNavigation,
} from 'features/workspace/workspace.slice'
import { getAppRouterStore } from 'router/app-router-context'
import { setupRouterSync, syncInitialLocation } from 'router/router-sync'
import { validateRootSearchParams } from 'router/routes.search'
import { makeStore } from 'store'
import type { Locale } from 'types'

import 'utils/polyfills'

import '@globalfishingwatch/timebar/timebar-settings.css'
import '@globalfishingwatch/ui-components/base.css'

const rootRoute = getRouteApi('__root__')

function AppLayout() {
  const router = useRouter()
  const { user } = rootRoute.useLoaderData()

  const store = useMemo(() => {
    // This allows us to inject a store into the router context for testing purposes
    const store = getAppRouterStore(router.options.context) ?? makeStore()
    syncInitialLocation(router, store)
    store.dispatch(setUserLanguage(getActiveI18nLanguage() as Locale))
    store.dispatch(setLoggedUser(user || getGuestUser()))
    return store
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  useEffect(() => {
    const unsubscribe = setupRouterSync(router, store)
    return () => unsubscribe()
  }, [router, store])

  useEffect(() => {
    const hintsDismissed = JSON.parse(localStorage.getItem(HINTS) || '{}')
    store.dispatch(hydrateHintsDismissed(hintsDismissed))
    store.dispatch(hydrateWorkspaceHistoryNavigation(getPersistedHistoryNavigation()))
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
