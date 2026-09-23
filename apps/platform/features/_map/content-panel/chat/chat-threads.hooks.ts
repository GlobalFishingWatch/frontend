import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useAtom, useSetAtom } from 'jotai'
import { useDeleteThreadMutation, useGetThreadsQuery } from 'queries/map/chat-api'

import { activeThreadAtom, newActiveThread } from 'features/_map/content-panel/chat/chat.atoms'
import { selectUserId } from 'features/_user/selectors/user.permissions.selectors'

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
  const {
    id: activeThreadId,
    isNew: activeThreadIsNew,
    isLoading: activeThreadIsLoading,
  } = activeThread

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
        setActiveThread(newActiveThread())
      }
      return deleteThreadMutation({ threadId: id, resourceId: String(userId) })
        .unwrap()
        .then((ok) => {
          if (!ok) {
            toast.error(t((t) => t.chat.couldNotDeleteConversation))
          }
        })
        .catch(() => {
          toast.error(t((t) => t.chat.couldNotDeleteConversation))
        })
    },
    [activeThreadId, deleteThreadMutation, userId, setActiveThread, t]
  )

  const newThread = useCallback(() => {
    setActiveThread(newActiveThread())
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
    activeThreadIsLoading,
    activeThreadIsNew,
    setActiveThreadId,
    markThreadStarted,
    deleteThread,
    newThread,
  }
}
