import { createFileRoute } from '@tanstack/react-router'
import { lowerCase } from 'es-toolkit'

import Workspace from 'features/workspace/Workspace'
import { getRouteHead, getTFunction } from 'router/router.meta'

export const Route = createFileRoute('/_app/$category/$workspaceId/')({
  component: Workspace,
  head: ({ matches, params }) =>
    getRouteHead({
      category: lowerCase(params.category || ''),
      t: getTFunction(matches),
    }),
})
