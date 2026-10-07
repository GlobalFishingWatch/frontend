import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { type UIMessage } from 'ai'
import { useGetThreadMessagesQuery } from 'queries/map/chat-api'

import { Spinner } from '@globalfishingwatch/ui-components'

import { useChatThreads } from 'features/_map/content-panel/chat/chat-threads.hooks'
import ChatSessionMessages from 'features/_map/content-panel/chat/ChatSessionMessages'
import { selectUserId } from 'features/_user/selectors/user.permissions.selectors'

import styles from './Chat.module.css'

// The agent creates the thread and starts its title when the first message arrives; the title
// usually lands a couple of seconds later, well before the reply ends.
const TITLE_REFRESH_DELAY = 5000

function ChatSession() {
  const userId = useSelector(selectUserId)
  const { activeThreadId, activeThreadIsNew, markThreadStarted, threadsLoading, refreshThreads } =
    useChatThreads()

  const [startedThreadId, setStartedThreadId] = useState<string | null>(null)

  const titleRefreshTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(titleRefreshTimeout.current), [])
  const skipHistory = activeThreadIsNew || startedThreadId === activeThreadId

  const {
    data: historyMessages,
    isLoading: historyLoading,
    isFetching: historyFetching,
  } = useGetThreadMessagesQuery(
    { threadId: activeThreadId, resourceId: String(userId) },
    { skip: skipHistory }
  )

  if (threadsLoading || (!skipHistory && (historyLoading || historyFetching))) {
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
      onSendMessage={() => {
        if (activeThreadIsNew) {
          clearTimeout(titleRefreshTimeout.current)
          titleRefreshTimeout.current = setTimeout(refreshThreads, TITLE_REFRESH_DELAY)
        }
      }}
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
