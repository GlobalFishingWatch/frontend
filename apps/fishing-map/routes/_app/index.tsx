import { createFileRoute } from '@tanstack/react-router'

import Workspace from 'features/workspace/Workspace'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute('/_app/')({
  component: Workspace,
  head: () => getRouteHead(),
})
