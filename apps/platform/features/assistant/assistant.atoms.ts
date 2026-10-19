import { atom, atomWithStorage, createJSONStorage } from 'jotai'

const ASSISTANT_ACTIVE_THREAD_KEY = 'assistantActiveThread'

export type ActiveThread = { id: string; isNew: boolean; isLoading: boolean }

/**
 * Lives here rather than in assistant-threads.hooks so a component can start a new thread without
 * pulling the assistant-api queries into its chunk.
 */
export const activeThreadAtom = atomWithStorage<ActiveThread>(
  ASSISTANT_ACTIVE_THREAD_KEY,
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
 * A question asked outside the assistant (the onboarding modal), sent as soon as the session
 * mounts. Not persisted: a reload must not resend it.
 */
export const pendingPromptAtom = atom<string | null>(null)
