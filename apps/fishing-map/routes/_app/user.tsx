import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'

const User = lazy(() => import('features/user/User'))

export const Route = createFileRoute('/_app/user')({
  component: User,
  head: () => getRouteHead({ category: t((tr) => tr.user.title) }),
})
