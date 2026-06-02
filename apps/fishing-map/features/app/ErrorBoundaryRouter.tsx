import { useMemo } from 'react'
import { Provider } from 'react-redux'

import { makeStore } from 'store'

import ErrorBoundaryUI from './ErrorBoundaryUI'

export function RouterErrorBoundary({ error }: { error: Error }) {
  const store = useMemo(() => makeStore(), [])
  return (
    <Provider store={store}>
      <ErrorBoundaryUI error={error} />
    </Provider>
  )
}
