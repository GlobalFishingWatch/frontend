import { createFileRoute } from '@tanstack/react-router'

import User from 'features/user/User'
import { getRouteHead, getTFunction } from 'router/router.meta'

export const Route = createFileRoute('/_app/user')({
  component: User,
  head: ({ matches }) => {
    const t = getTFunction(matches)
    return getRouteHead({ category: t('user.title'), t })
  },
})
