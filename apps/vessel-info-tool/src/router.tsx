import { createRouter as createTanStackRouter } from '@tanstack/react-router'

import { DefaultCatchBoundary } from './features/router/DefaultCatchBoundary'
import { NotFound } from './features/router/NotFound'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: {},
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
