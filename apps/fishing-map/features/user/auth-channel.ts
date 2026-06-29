export const AUTH_CHANNEL_NAME = 'gfw-auth'
export const LOGIN_MESSAGE = 'LOGIN_SUCCESS'
export const LOGOUT_MESSAGE = 'LOGOUT'

// Per-document id so a tab can ignore its own LOGOUT echo
export const TAB_ID = `${Date.now()}-${Math.random()}`

export type AuthChannelMessage =
  | { type: typeof LOGIN_MESSAGE; user?: unknown }
  | { type: typeof LOGOUT_MESSAGE; senderId: string }

function postAuthMessage(message: AuthChannelMessage) {
  if (typeof BroadcastChannel === 'undefined') return
  const channel = new BroadcastChannel(AUTH_CHANNEL_NAME)
  channel.postMessage(message)
  channel.close()
}

export function broadcastLogin(user: unknown) {
  postAuthMessage({ type: LOGIN_MESSAGE, user })
}

export function broadcastLogout() {
  postAuthMessage({ type: LOGOUT_MESSAGE, senderId: TAB_ID })
}
