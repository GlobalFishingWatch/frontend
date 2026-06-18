import { usePopupLoginCallback } from 'features/user/user.hooks'

// Skip mounting the entire <App /> and just manage the login
function LoginPopupHandler() {
  usePopupLoginCallback()
  return null
}

export default LoginPopupHandler
