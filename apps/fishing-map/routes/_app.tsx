import { Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import App from 'features/app/App'
import { fetchSidePanelContent } from 'features/content/content.queries'
import i18n from 'features/i18n/i18n'
import { setupRouterSync } from 'router/router-sync'
import { validateRootSearchParams } from 'router/routes.search'
import type { AppStore } from 'store'
import { makeStore } from 'store'

import 'utils/polyfills'

import '@globalfishingwatch/timebar/timebar-settings.css'
import '@globalfishingwatch/ui-components/base.css'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  validateSearch: validateRootSearchParams,
  loaderDeps: ({ search }) => ({
    sidePanelContent: search.sidePanelContent,
    // For datasets, sidePanelId determines which item to fetch.
    // For userGuide, we always fetch all sections and select client-side.
    sidePanelId: search.sidePanelContent === 'datasets' ? search.sidePanelId : undefined,
  }),
  loader: async ({ deps }) => {
    const { sidePanelId, sidePanelContent } = deps
    try {
      const response = await fetchSidePanelContent(sidePanelContent, sidePanelId, i18n.language)

      if (!response || !response.data) {
        return {
          status: 'empty',
          data: [],
          meta: response?.meta,
        }
      }

      if (response.data.length === 0) {
        return {
          status: 'empty',
          data: [],
          meta: response.meta,
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
