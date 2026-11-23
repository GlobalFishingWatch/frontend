import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { type UIMessage } from 'ai'
import { useGetThreadMessagesQuery } from 'queries/assistant-api'

import { Spinner } from '@globalfishingwatch/ui-components/spinner'

import { selectUserId } from 'features/_user/selectors/user.permissions.selectors'
import { useAssistantThreads } from 'features/assistant/assistant-threads.hooks'
import AssistantMessages from 'features/assistant/AssistantMessages'

import styles from './Assistant.module.css'

// The agent creates the thread and starts its title when the first message arrives; the title
// usually lands a couple of seconds later, well before the reply ends.
const TITLE_REFRESH_DELAY = 5000

function AssistantSession() {
  const userId = useSelector(selectUserId)
  const { activeThreadId, activeThreadIsNew, markThreadStarted, threadsLoading, refreshThreads } =
    useAssistantThreads()

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
    <AssistantMessages
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

export default AssistantSession
