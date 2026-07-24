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
  const { activeThreadId, isNewThread, markThreadStarted } = useChatThreads()

  const { data: historyMessages, isFetching: historyFetching } = useGetThreadMessagesQuery(
    { threadId: activeThreadId, resourceId: String(userId) },
    { skip: isNewThread }
  )

  if (!isNewThread && historyFetching) {
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
      initialMessages={isNewThread ? [] : ((historyMessages as UIMessage[]) ?? [])}
      onSendMessage={() => {
        if (isNewThread) {
          markThreadStarted()
        }
      }}
    />
  )
}

export default ChatSession
