import { createRouter as createTanStackRouter } from '@tanstack/react-router'

import { DefaultCatchBoundary } from './features/router/DefaultCatchBoundary'
import { NotFound } from './features/router/NotFound'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
    context: {
      user: { name: 'John Doe' },
    },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
