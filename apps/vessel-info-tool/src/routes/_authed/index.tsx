import { createFileRoute, Link, redirect } from '@tanstack/react-router'

import { UserPermissionValues } from '@/utils/source'
import { loginRedirect } from '@/server/auth'

export const Route = createFileRoute('/_authed/')({
  beforeLoad: ({ context }) => {
    console.log('🚀 ~ entered _authed route with context:', context)
    if (!context.user) {
      loginRedirect()
    }

    return { user: context.user }
  },
  component: VesselsIndexComponent,
})

function VesselsIndexComponent() {
  const { user } = Route.useRouteContext()
  
  if (!user) {
    return null
  }
  
  return user.groups.length <= 1 ? (
    redirect({ to: `/$source`, params: { source: user.groups[0] }, replace: true })
  ) : (
    <div>
      Looks like you have access to more than one registry! Select which to view.
      {Object.values(UserPermissionValues).map((value) => (
        <div key={value}>
          <Link to={`/$source`} params={{ source: value }}>
            {value.charAt(0).toUpperCase() + value.slice(1)} Registry
          </Link>
        </div>
      ))}
    </div>
  )
}
