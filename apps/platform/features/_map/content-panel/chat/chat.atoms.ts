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
