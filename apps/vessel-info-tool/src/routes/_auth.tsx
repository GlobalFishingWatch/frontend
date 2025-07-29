import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const isAuthenticated = () => {
  return false
}

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },

  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}
