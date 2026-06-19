import { createFileRoute } from '@tanstack/react-router'

import { t } from 'features/i18n/i18n'
import User from 'features/user/User'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute('/_app/user')({
  component: User,
  head: () => getRouteHead({ category: t((s) => s.user.title) }),
})
