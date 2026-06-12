import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { getRouteHead, getTFunction } from 'router/router.meta'

export const Route = createFileRoute('/_app/user')({
  component: lazyRouteComponent(() => import('features/user/User')),
  head: ({ match }) => {
    const t = getTFunction(match)
    return getRouteHead({ category: t('user.title'), t })
  },
})
