import { createFileRoute } from '@tanstack/react-router'

import LoginPopupHandler from 'features/_user/LoginPopupHandler'

export const Route = createFileRoute('/login')({
  component: LoginPopupHandler,
})
