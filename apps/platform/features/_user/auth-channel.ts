export const AUTH_CHANNEL_NAME = 'gfw-auth'
export const LOGIN_MESSAGE = 'LOGIN_SUCCESS'
export const LOGOUT_MESSAGE = 'LOGOUT'

export const SETTINGS_UPDATED_MESSAGE = 'gfw:settings-updated'
export const SESSION_ENDED_MESSAGE = 'gfw:session-ended'

// Per-document id so a tab can ignore its own LOGOUT echo
export const TAB_ID = `${Date.now()}-${Math.random()}`

const POPUP_WIDTH = 500
const POPUP_HEIGHT = 750

export function openAuthPopup(url: string, name: string) {
  const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2
  const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2
  return window.open(
    url,
    name,
    `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top}`
  )
}

export type AuthChannelMessage =
  { type: typeof LOGIN_MESSAGE; user?: unknown } | { type: typeof LOGOUT_MESSAGE; senderId: string }

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
