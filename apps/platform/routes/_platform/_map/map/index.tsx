import { createFileRoute } from '@tanstack/react-router'

import Workspace from 'features/map/workspace/Workspace'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute('/_platform/_map/map/')({
  component: Workspace,
  head: () => getRouteHead(),
})
