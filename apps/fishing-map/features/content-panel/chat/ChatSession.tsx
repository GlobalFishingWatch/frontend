import { useState } from 'react'
import { useSelector } from 'react-redux'
import { type UIMessage } from 'ai'
import { useGetThreadMessagesQuery } from 'queries/chat-api'

import { Spinner } from '@globalfishingwatch/ui-components'

import { useChatThreads } from 'features/content-panel/chat/chat-threads.hooks'
import ChatSessionMessages from 'features/content-panel/chat/ChatSessionMessages'
import { selectUserId } from 'features/user/selectors/user.permissions.selectors'

import styles from './Chat.module.css'

function ChatSession() {
  const userId = useSelector(selectUserId)
  const { activeThreadId, activeThreadIsNew, markThreadStarted } = useChatThreads()

  const [startedThreadId, setStartedThreadId] = useState<string | null>(null)
  const skipHistory = activeThreadIsNew || startedThreadId === activeThreadId

  const {
    data: historyMessages,
    isLoading: historyLoading,
    isFetching: historyFetching,
  } = useGetThreadMessagesQuery(
    { threadId: activeThreadId, resourceId: String(userId) },
    { skip: skipHistory }
  )

  if (!skipHistory && (historyLoading || historyFetching)) {
    return (
      <div className={styles.messages}>
        <Spinner size="small" />
      </div>
    )
  }

  return (
    <ChatSessionMessages
      key={activeThreadId}
      userId={userId}
      threadId={activeThreadId}
      initialMessages={skipHistory ? [] : ((historyMessages as UIMessage[]) ?? [])}
      onFinished={() => {
        if (activeThreadIsNew) {
          setStartedThreadId(activeThreadId)
          markThreadStarted()
        }
      }}
    />
  )
}

export default ChatSession
