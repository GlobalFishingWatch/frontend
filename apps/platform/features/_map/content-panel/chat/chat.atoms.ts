import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const CHAT_ACTIVE_THREAD_KEY = 'chatActiveThread'

export type ActiveThread = { id: string; isNew: boolean; isLoading: boolean }

/**
 * Lives here rather than in chat-threads.hooks so a component can start a new thread without
 * pulling the chat-api queries into its chunk.
 */
export const activeThreadAtom = atomWithStorage<ActiveThread>(
  CHAT_ACTIVE_THREAD_KEY,
  { id: typeof crypto !== 'undefined' ? crypto.randomUUID() : '', isNew: true, isLoading: false },
  createJSONStorage<ActiveThread>(() =>
    typeof window === 'undefined' ? (undefined as unknown as Storage) : sessionStorage
  ),
  { getOnInit: true }
)

export function newActiveThread(): ActiveThread {
  return { id: crypto.randomUUID(), isNew: true, isLoading: false }
}

/**
 * A question asked outside the chat (the onboarding modal), sent as soon as the session mounts.
 * Not persisted: a reload must not resend it.
 */
export const pendingPromptAtom = atom<string | null>(null)
