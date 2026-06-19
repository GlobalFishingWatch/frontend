import { createFileRoute } from '@tanstack/react-router'

import Workspace from 'features/workspace/Workspace'
import { getRouteHead, getTFunction } from 'router/router.meta'

export const Route = createFileRoute('/_app/')({
  component: Workspace,
  head: ({ matches }) => getRouteHead({ t: getTFunction(matches) }),
})
