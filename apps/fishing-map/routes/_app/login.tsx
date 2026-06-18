import { createFileRoute } from '@tanstack/react-router'

import LoginPopupHandler from 'features/user/LoginPopupHandler'

export const Route = createFileRoute('/_app/login')({
  component: LoginPopupHandler,
})
