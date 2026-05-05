import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'
import { lowerCase } from 'es-toolkit'

import { getRouteHead, getTFuntion } from 'router/router.meta'

export const Route = createFileRoute('/_app/$category/$workspaceId/')({
  component: lazyRouteComponent(() => import('features/workspace/Workspace')),
  head: ({ matches, params }) =>
    getRouteHead({
      category: lowerCase(params.category || ''),
      t: getTFuntion(matches),
    }),
})
