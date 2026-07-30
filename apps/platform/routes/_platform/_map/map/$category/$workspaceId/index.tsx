import { createFileRoute } from '@tanstack/react-router'
import { lowerCase } from 'es-toolkit'

import Workspace from 'features/_map/workspace/Workspace'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute('/_platform/_map/map/$category/$workspaceId/')({
  component: Workspace,
  head: ({ params }) =>
    getRouteHead({
      category: lowerCase(params.category || ''),
    }),
})
