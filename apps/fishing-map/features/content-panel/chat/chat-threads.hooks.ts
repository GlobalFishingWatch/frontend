import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { useDeleteThreadMutation, useGetThreadsQuery } from 'queries/chat-api'

import { selectUserId } from 'features/user/selectors/user.permissions.selectors'

const CHAT_ACTIVE_THREAD_KEY = 'chatActiveThread'

type ActiveThread = { id: string; isNew: boolean; isLoading: boolean }

const activeThreadAtom = atomWithStorage<ActiveThread>(
  CHAT_ACTIVE_THREAD_KEY,
  { id: typeof crypto !== 'undefined' ? crypto.randomUUID() : '', isNew: true, isLoading: false },
  createJSONStorage<ActiveThread>(() => sessionStorage),
  { getOnInit: true }
)

export function useThreadLoading(threadId: string) {
  const activeThread = useAtomValue(activeThreadAtom)
  return activeThread.id === threadId && activeThread.isLoading
}

export function useSetThreadLoading(threadId: string, loading: boolean) {
  const setActiveThread = useSetAtom(activeThreadAtom)
  useEffect(() => {
    setActiveThread((prev) => (prev.id === threadId ? { ...prev, isLoading: loading } : prev))
  }, [threadId, loading, setActiveThread])
}

export function useChatThreads() {
  const { t } = useTranslation()
  const userId = useSelector(selectUserId)
  const [activeThread, setActiveThread] = useAtom(activeThreadAtom)
  const { id: activeThreadId, isNew: isNewThread } = activeThread

  const {
    data: threads = [],
    error: threadsQueryError,
    isLoading: threadsLoading,
    refetch: refreshThreads,
  } = useGetThreadsQuery({ resourceId: String(userId) })

  const threadsError = threadsQueryError
    ? threadsQueryError instanceof Error
      ? threadsQueryError.message
      : 'Failed to load conversations'
    : null

  const [deleteThreadMutation] = useDeleteThreadMutation()

  const deleteThread = useCallback(
    (id: string) => {
      if (id === activeThreadId) {
        setActiveThread({ id: crypto.randomUUID(), isNew: true, isLoading: false })
      }
      deleteThreadMutation({ threadId: id, resourceId: String(userId) })
        .unwrap()
        .then((ok) => {
          if (!ok) {
            toast.error(t((t) => t.chat.couldNotDeleteConversation))
          }
        })
    },
    [activeThreadId, deleteThreadMutation, userId, setActiveThread, t]
  )

  const newThread = useCallback(() => {
    setActiveThread({ id: crypto.randomUUID(), isNew: true, isLoading: false })
  }, [setActiveThread])

  const setActiveThreadId = useCallback(
    (id: string) => {
      setActiveThread({ id, isNew: false, isLoading: false })
    },
    [setActiveThread]
  )

  const markThreadStarted = useCallback(() => {
    setActiveThread((prev) => ({ ...prev, isNew: false }))
  }, [setActiveThread])

  return {
    threads,
    threadsError,
    threadsLoading,
    refreshThreads,
    activeThreadId,
    isNewThread,
    setActiveThreadId,
    markThreadStarted,
    deleteThread,
    newThread,
  }
}
