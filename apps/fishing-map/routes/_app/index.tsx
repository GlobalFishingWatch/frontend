import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { getRouteHead, getTFuntion } from 'router/router.meta'

export const Route = createFileRoute('/_app/')({
  component: lazyRouteComponent(() => import('features/workspace/Workspace')),
  head: ({ matches }) => getRouteHead({ t: getTFuntion(matches) }),
})
