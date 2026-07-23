import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useDeleteThreadMutation, useGetThreadsQuery } from 'queries/chat-api'

import { useSessionStorage } from '@globalfishingwatch/react-hooks'

import { selectUserId } from 'features/user/selectors/user.permissions.selectors'

const CHAT_ACTIVE_THREAD_KEY = 'chatActiveThreadId'

export function useChatThreads() {
  const { t } = useTranslation()
  const userId = useSelector(selectUserId)
  const [activeThreadId, setActiveThreadId] = useSessionStorage<string>(
    CHAT_ACTIVE_THREAD_KEY,
    crypto.randomUUID()
  )

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
        setActiveThreadId(crypto.randomUUID())
      }
      deleteThreadMutation({ threadId: id, resourceId: String(userId) })
        .unwrap()
        .then((ok) => {
          if (!ok) {
            toast.error(t((t) => t.chat.couldNotDeleteConversation))
          }
        })
    },
    [activeThreadId, deleteThreadMutation, userId, setActiveThreadId, t]
  )

  const newThread = useCallback(() => {
    setActiveThreadId(crypto.randomUUID())
  }, [setActiveThreadId])

  const activeThread = useMemo(
    () => threads.find((c) => c.id === activeThreadId) ?? null,
    [threads, activeThreadId]
  )

  return {
    threads,
    threadsError,
    threadsLoading,
    refreshThreads,
    activeThread,
    activeThreadId,
    setActiveThreadId,
    deleteThread,
    newThread,
  }
}
