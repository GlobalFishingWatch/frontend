import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { lowerCase } from 'es-toolkit'

import { getRouteHead, getTFuntion } from 'router/router.meta'

const Workspace = lazy(() => import('features/workspace/Workspace'))

export const Route = createFileRoute('/_app/$category/$workspaceId/')({
  component: Workspace,
  head: ({ matches, params }) =>
    getRouteHead({
      category: lowerCase(params.category || ''),
      t: getTFuntion(matches),
    }),
})
