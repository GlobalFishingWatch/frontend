import { MemorySessionStore } from './memory-session-store'
import type { SessionStore } from './session-store.types'

let store: SessionStore | null = null

export async function getSessionStore(): Promise<SessionStore> {
  if (store) return store
  if (process.env.FIRESTORE_SESSIONS_DB || process.env.FIRESTORE_EMULATOR_HOST) {
    const { FirestoreSessionStore } = await import('./firestore-session-store')
    store = new FirestoreSessionStore()
  } else {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        'Session store: FIRESTORE_SESSIONS_DB not set — using the in-memory store. Sessions will not survive restarts nor be shared across instances.'
      )
    }
    store = new MemorySessionStore()
  }
  return store
}

export * from './refresh-session'
export * from './session-store.types'
