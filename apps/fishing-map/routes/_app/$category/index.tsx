import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { lowerCase } from 'es-toolkit'

import type { WorkspaceCategoryDescriptionKey } from 'router/router.meta'
import { getWorkspaceHead } from 'router/router.meta'

const WorkspacesList = lazy(() => import('features/workspaces-list/WorkspacesList'))

export const Route = createFileRoute('/_app/$category/')({
  component: WorkspacesList,
  head: ({ params }) =>
    getWorkspaceHead(lowerCase(params.category || '') as WorkspaceCategoryDescriptionKey),
})
