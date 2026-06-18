import { Spinner } from '@globalfishingwatch/ui-components'

import { usePopupLoginCallback } from 'features/user/user.hooks'

// Skip mounting the entire <App /> and just manage the login
function LoginPopupHandler() {
  usePopupLoginCallback()
  return <Spinner />
}

export default LoginPopupHandler
