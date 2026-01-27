import { logoutFn } from '@/server/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/logout')({
  preload: false,
  loader: () => logoutFn(),
})
