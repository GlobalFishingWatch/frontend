import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { getRouteHead, getTFuntion } from 'router/router.meta'

const Workspace = lazy(() => import('features/workspace/Workspace'))

export const Route = createFileRoute('/_app/')({
  component: Workspace,
  head: ({ matches }) => getRouteHead({ t: getTFuntion(matches) }),
})
