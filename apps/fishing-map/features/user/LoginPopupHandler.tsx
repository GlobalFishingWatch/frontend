import { usePopupLoginCallback } from 'features/user/user.hooks'

// Rendered INSTEAD of <App /> inside an SSO login popup (see _app.tsx). It only exchanges
// the access token, broadcasts the session to the opener, and closes the window — none of
// App's map/workspace/analytics hooks mount, so the popup does zero unnecessary work.
function LoginPopupHandler() {
  usePopupLoginCallback()
  return null
}

export default LoginPopupHandler
