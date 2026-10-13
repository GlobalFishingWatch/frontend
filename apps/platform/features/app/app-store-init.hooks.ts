import { useEffect, useMemo } from 'react'
import { getRouteApi, useRouter } from '@tanstack/react-router'

import { getGuestUser } from '@globalfishingwatch/api-client'

import { HINTS } from 'data/map/config'
import {
  getPersistedHistoryNavigation,
  hydrateWorkspaceHistoryNavigation,
} from 'features/_map/workspace/workspace.slice'
import { setLoggedUser, setUserLanguage } from 'features/_user/user.slice'
import { hydrateHintsDismissed } from 'features/hints/hints.slice'
import { getActiveI18nLanguage } from 'features/i18n/i18n'
import { getAppRouterStore } from 'router/app-router-context'
import { setupRouterSync, syncInitialLocation } from 'router/router-sync'
import { makeStore } from 'store'
import type { Locale } from 'types'
import { getLocalStorageItem } from 'utils/dom'

const rootRoute = getRouteApi('__root__')

/**
 * Creates (or picks up) the Redux store and wires the router->Redux sync.
 *
 * Called by each shell layout rather than by a shared parent layout: the shells are siblings, so
 * exactly one runs per navigation and only one store is ever created. Keeping the logic here rather
 * than duplicating it matters because of the SSR constraint below.
 *
 * `syncInitialLocation` MUST stay inside the useMemo — i.e. synchronous during render, not in an
 * effect. Effects don't run during SSR, so an effect-only sync leaves the server render on the default
 * MAP location while the URL says otherwise, and that divergence (map shell vs not) is a hydration
 * mismatch. See router/router-sync.ts.
 */
export function useAppStore() {
  const router = useRouter()
  const { user } = rootRoute.useLoaderData()

  const { store, serverState } = useMemo(() => {
    // Lets tests inject a store through the router context.
    const store = getAppRouterStore(router.options.context) ?? makeStore()
    syncInitialLocation(router, store)
    store.dispatch(setUserLanguage(getActiveI18nLanguage() as Locale))
    store.dispatch(setLoggedUser(user || getGuestUser()))
    return { store, serverState: store.getState() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  useEffect(() => {
    const unsubscribe = setupRouterSync(router, store)
    return () => unsubscribe()
  }, [router, store])

  useEffect(() => {
    try {
      const hintsDismissed = JSON.parse(getLocalStorageItem(HINTS) || '{}')
      store.dispatch(hydrateHintsDismissed(hintsDismissed))
    } catch {
      // localStorage blocked or invalid JSON — start with no dismissed hints
    }
    store.dispatch(hydrateWorkspaceHistoryNavigation(getPersistedHistoryNavigation()))
  }, [store])

  return { store, serverState }
}
