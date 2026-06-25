import { createRootRoute, Outlet } from '@tanstack/react-router'

function RootComponent() {
  return <Outlet />
}

export const Route = createRootRoute({
  component: RootComponent,
})
