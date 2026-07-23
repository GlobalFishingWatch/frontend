import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { UIMessage } from 'ai'
import { useGetThreadMessagesQuery } from 'queries/chat-api'

import { usePrevious } from '@globalfishingwatch/react-hooks'

import { useChatSession } from 'features/content-panel/chat/chat-session.hooks'
import type { useChatThreads } from 'features/content-panel/chat/chat-threads.hooks'
import { selectUserId } from 'features/user/selectors/user.permissions.selectors'

type ChatSessionArgs = Pick<ReturnType<typeof useChatThreads>, 'activeThreadId' | 'refreshThreads'>

export function useChatThreadMessages({ activeThreadId, refreshThreads }: ChatSessionArgs) {
  const userId = useSelector(selectUserId)

  const {
    messages,
    sendMessage: sendMessageToSession,
    status,
    error,
    setMessages,
  } = useChatSession({
    activeThreadId,
    userId,
  })

  // Refresh titles after a completed send/stream, not after history hydrate.
  const prevStatus = usePrevious(status)
  const loading = status === 'submitted' || status === 'streaming'

  const { data: history, error: historyQueryError } = useGetThreadMessagesQuery({
    threadId: activeThreadId,
    resourceId: String(userId),
  })
  const historyError = historyQueryError
    ? historyQueryError instanceof Error
      ? historyQueryError.message
      : 'Failed to load history'
    : null

  const lastThreadId = useRef(activeThreadId)
  useEffect(() => {
    if (lastThreadId.current !== activeThreadId) {
      lastThreadId.current = activeThreadId
      setMessages([])
    }
  }, [activeThreadId, setMessages])

  useEffect(() => {
    if (
      !historyError &&
      status === 'ready' &&
      history &&
      history.length > 0 &&
      messages.length === 0
    ) {
      setMessages(history as UIMessage[])
    }
  }, [history, historyError, setMessages, status, messages.length])

  useEffect(() => {
    const wasBusy = prevStatus === 'submitted' || prevStatus === 'streaming'
    if (wasBusy && status === 'ready' && messages.length > 0) {
      refreshThreads()
    }
  }, [prevStatus, status, messages.length, refreshThreads])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return false
      const content = `${trimmed}\n\n[current map url: ${window.location.href}]`
      await sendMessageToSession({ text: content })
      return true
    },
    [loading, sendMessageToSession]
  )

  return { messages, loading, error, historyError, sendMessage }
}
