import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'
import { lowerCase } from 'es-toolkit'

import type { WorkspaceCategoryDescriptionKey } from 'router/router.meta'
import { getTFuntion, getWorkspaceHead } from 'router/router.meta'

export const Route = createFileRoute('/_app/$category/')({
  component: lazyRouteComponent(() => import('features/workspaces-list/WorkspacesList')),
  head: ({ matches, params }) =>
    getWorkspaceHead(
      lowerCase(params.category || '') as WorkspaceCategoryDescriptionKey,
      getTFuntion(matches)
    ),
})
