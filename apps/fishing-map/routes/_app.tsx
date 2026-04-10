import { lazy, Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import ContentPanel from 'features/content/ContentPanel'
import { strapiApi } from 'features/content/loaders'
import { setupRouterSync } from 'router/router-sync'
import { validateRootSearchParams } from 'router/routes.search'
import type { AppStore } from 'store'
import { makeStore } from 'store'
import { htmlSafeParse } from 'utils/html-parser'

import 'utils/polyfills'

import '@globalfishingwatch/timebar/timebar-settings.css'
import '@globalfishingwatch/ui-components/base.css'

const App = lazy(() => import('features/app/App'))

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  validateSearch: validateRootSearchParams,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }) => {
    const { query, sidePanelId } = deps.search
    try {
      const response = await strapiApi.userGuide.getAllUserGuideSections()

      // Check if we got data
      if (!response || !response.data) {
        return {
          status: 'empty',
          data: [],
          meta: response?.meta,
          query,
        }
      }

      // Check if data array is empty
      if (response.data.length === 0) {
        return {
          status: 'empty',
          data: [],
          meta: response.meta,
          query,
        }
      }

      return {
        status: 'success',
        data: response.data,
        meta: response.meta,
        query,
      }
    } catch (error) {
      console.error('Strapi fetch error:', error)
      return {
        status: 'error',
        data: [],
        error: error instanceof Error ? error.message : 'Failed to connect to Strapi',
        query,
      }
    }
  },
})

function AppLayout() {
  const [store] = useState<AppStore>(() => makeStore())
  const router = useRouter()

  useEffect(() => {
    setupRouterSync(router, store)
  }, [router, store])

  return (
    <Provider store={store}>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </Provider>
  )
}
