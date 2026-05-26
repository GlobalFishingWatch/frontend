import { Suspense, useEffect, useMemo } from 'react'
import { Provider } from 'react-redux'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { HINTS } from 'data/config'
import App from 'features/app/App'
import { fetchUserGuideContent } from 'features/cms/content.queries'
import { hydrateHintsDismissed } from 'features/help/hints.slice'
import i18n from 'features/i18n/i18n'
import { setupRouterSync } from 'router/router-sync'
import { validateRootSearchParams } from 'router/routes.search'
import type { AppStore } from 'store'
import { makeStore } from 'store'
import type { Locale } from 'types'

import 'utils/polyfills'

import '@globalfishingwatch/timebar/timebar-settings.css'
import '@globalfishingwatch/ui-components/base.css'

function AppLayout() {
  const router = useRouter()
  const store = useMemo(() => {
    const store = makeStore()
    setupRouterSync(router, store)
    return store as AppStore
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
  loaderDeps: ({ search }) => ({
    sidePanelContent: search.sidePanelContent,
  }),
  // Only userGuide content is loaded server-side; dataset info is fetched client-side
  loader: async ({ deps }) => {
    const { sidePanelContent } = deps
    if (sidePanelContent !== 'userGuide') {
      return { status: 'success' as const, data: [], meta: undefined }
    }
    try {
      const response = await fetchUserGuideContent({ locale: i18n.language as Locale })

      if (!response || !response.data || response.data.length === 0) {
        return {
          status: 'empty',
          data: [],
          meta: response?.meta,
        }
      }

      return {
        status: 'success',
        data: response.data,
        meta: response.meta,
      }
    } catch (error) {
      console.error('Strapi fetch error:', error)
      return {
        status: 'error',
        data: [],
        error: error instanceof Error ? error.message : 'Failed to connect to Strapi',
      }
    }
  },
})
