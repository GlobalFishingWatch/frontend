import { createFileRoute } from '@tanstack/react-router'
import { lowerCase } from 'es-toolkit'

import WorkspacesList from 'features/workspaces-list/WorkspacesList'
import type { WorkspaceCategoryDescriptionKey } from 'router/router.meta'
import { getTFunction, getWorkspaceHead } from 'router/router.meta'

export const Route = createFileRoute('/_app/$category/')({
  component: WorkspacesList,
  head: ({ matches, params }) =>
    getWorkspaceHead(
      lowerCase(params.category || '') as WorkspaceCategoryDescriptionKey,
      getTFunction(matches)
    ),
})
