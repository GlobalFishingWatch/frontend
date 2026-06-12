import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'
import { lowerCase } from 'es-toolkit'

import { getRouteHead, getTFunction } from 'router/router.meta'

export const Route = createFileRoute('/_app/$category/$workspaceId/')({
  component: lazyRouteComponent(() => import('features/workspace/Workspace')),
  head: ({ match, params }) =>
    getRouteHead({
      category: lowerCase(params.category || ''),
      t: getTFunction(match),
    }),
})
