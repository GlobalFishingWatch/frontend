import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { useDeleteThreadMutation, useGetThreadsQuery } from 'queries/chat-api'

import { selectUserId } from 'features/user/selectors/user.permissions.selectors'

const CHAT_ACTIVE_THREAD_KEY = 'chatActiveThreadId'

const activeThreadIdAtom = atomWithStorage<string>(
  CHAT_ACTIVE_THREAD_KEY,
  typeof crypto !== 'undefined' ? crypto.randomUUID() : '',
  createJSONStorage<string>(() => sessionStorage),
  { getOnInit: true }
)

export function useChatThreads() {
  const { t } = useTranslation()
  const userId = useSelector(selectUserId)
  const [activeThreadId, setActiveThreadId] = useAtom(activeThreadIdAtom)

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

  // const activeThread = useMemo(
  //   () => threads.find((c) => c.id === activeThreadId) ?? null,
  //   [threads, activeThreadId]
  // )

  return {
    threads,
    threadsError,
    threadsLoading,
    refreshThreads,
    // activeThread,
    activeThreadId,
    setActiveThreadId,
    deleteThread,
    newThread,
  }
}
