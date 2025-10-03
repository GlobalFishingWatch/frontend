import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { UserPermissionValues } from '@/utils/source'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components'

export const loginFn = createServerFn({ method: 'POST' }).handler(async () => {
  const user = await GFWAPI.fetchUser()
  console.log('🚀 ~ user:', user)
  if (!user) {
    throw redirect({ to: '/login' })
  }

  const userGroups = user?.permissions.filter(
    (p) => p.type === 'user-group' && p.value in UserPermissionValues
  )
  console.log('🚀 ~ userGroups:', userGroups)

  if (userGroups?.length === 1) {
    const group = userGroups[0].value
    throw redirect({ to: '/$source', params: { source: group } })
  } else if (userGroups?.length > 1) {
    throw redirect({ to: '/' })
  }
  // const session = await useAppSession()
  // await session.update({
  //   user: user,
  // })
})

export const Route = createFileRoute('/_auth')({
  //component: () => <LoginWrapper />,
  beforeLoad: () => {
    loginFn()
  },
  pendingComponent: () => <Spinner />,
  component: () => <Outlet />,
})
