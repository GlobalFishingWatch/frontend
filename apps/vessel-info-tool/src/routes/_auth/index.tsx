import { createFileRoute, Link, redirect } from '@tanstack/react-router'

import { getTokens } from '@/server/auth'
import { UserPermissionValues } from '@/utils/source'

export const Route = createFileRoute('/_auth/')({
  beforeLoad: async ({ search }) => {
    const user = await getTokens()

    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    // Pass user to child routes
    return { user }
  },
  component: VesselsIndexComponent,
})

function VesselsIndexComponent() {
  return (
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
