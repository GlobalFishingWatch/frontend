import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { getRouteHead, getTFuntion } from 'router/router.meta'

const User = lazy(() => import('features/user/User'))

export const Route = createFileRoute('/_app/user')({
  component: User,
  head: ({ matches }) => {
    const t = getTFuntion(matches)
    return getRouteHead({ category: t('user.title'), t })
  },
})
