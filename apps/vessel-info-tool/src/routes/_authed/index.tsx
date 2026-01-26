import { createFileRoute, Link, redirect } from '@tanstack/react-router'

import { UserPermissionValues } from '@/utils/source'
import { loginRedirect } from '@/server/auth'

export const Route = createFileRoute('/_authed/')({
  beforeLoad: ({ context }) => {
    console.log('🚀 ~ entered _authed route with context:', context)
    if (!context.user || Object.keys(context.user).length === 0) {
      loginRedirect()
    }

    return { user: context.user }
  },
  component: VesselsIndexComponent,
})

function VesselsIndexComponent() {
  const { user } = Route.useRouteContext()

  if (!user?.permissions) {
    return null
  }

  return user.permissions?.find(
    (p) => p.value.includes('public-bra') || p.value.includes('private-bra')
  )
    ? redirect({ to: `/$source`, params: { source: 'brazil' }, replace: true })
    : redirect({ to: `/$source`, params: { source: 'panama' }, replace: true })

  // ) : (
  //   <div>
  //     Looks like you have access to more than one registry! Select which to view.
  //     {Object.values(UserPermissionValues).map((value) => (
  //       <div key={value}>
  //         <Link to={`/$source`} params={{ source: value }}>
  //           {value.charAt(0).toUpperCase() + value.slice(1)} Registry
  //         </Link>
  //       </div>
  //     ))}
  //   </div>
  // )
}
