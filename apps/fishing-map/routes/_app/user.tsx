import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { getRouteHead, getTFuntion } from 'router/router.meta'

export const Route = createFileRoute('/_app/user')({
  component: lazyRouteComponent(() => import('features/user/User')),
  head: ({ matches }) => {
    const t = getTFuntion(matches)
    return getRouteHead({ category: t('user.title'), t })
  },
})
