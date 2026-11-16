import { createFileRoute, redirect } from '@tanstack/react-router'
import { lowerCase } from 'es-toolkit'

import { WorkspaceCategory } from '@platform/config/map/workspaces'
import { ROUTE_PATHS } from '@platform/config/routes'

import WorkspacesList from 'features/_map/workspaces-list/WorkspacesList'
import type { WorkspaceCategoryDescriptionKey } from 'router/router.meta'
import { getWorkspaceHead } from 'router/router.meta'

export const Route = createFileRoute('/_platform/_map/map/$category/')({
  beforeLoad: ({ params, search }) => {
    if (params.category === WorkspaceCategory.FishingActivity) {
      throw redirect({ to: ROUTE_PATHS.MAP, search, replace: true })
    }
  },
  component: WorkspacesList,
  head: ({ params }) =>
    getWorkspaceHead(lowerCase(params.category || '') as WorkspaceCategoryDescriptionKey),
})
