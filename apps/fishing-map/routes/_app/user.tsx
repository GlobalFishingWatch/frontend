import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { getRouteHead, getTFunction } from 'router/router.meta'

export const Route = createFileRoute('/_app/user')({
  component: lazyRouteComponent(() => import('features/user/User')),
  head: ({ matches }) => {
    const t = getTFunction(matches)
    return getRouteHead({ category: t('user.title'), t })
  },
})
