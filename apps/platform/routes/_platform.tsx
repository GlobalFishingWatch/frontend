import { Provider } from 'react-redux'
import { createFileRoute } from '@tanstack/react-router'

import { useAppStore } from 'features/app/app-store.hooks'
import PlatformLayout from 'features/layouts/PlatformLayout'
import { validateRootSearchParams } from 'router/routes.search'

import '@globalfishingwatch/timebar/timebar-settings.css'
import '@globalfishingwatch/ui-components/base.css'

function PlatformShell() {
  const { store, serverState } = useAppStore()
  return (
    <Provider store={store} serverState={serverState}>
      <PlatformLayout />
    </Provider>
  )
}

export const Route = createFileRoute('/_platform')({
  component: PlatformShell,
  validateSearch: validateRootSearchParams,
})
