import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useChatThreads } from 'features/content-panel/chat/chat-threads.hooks'
import ChatHeader from 'features/content-panel/chat/ChatHeader'
import ChatSession from 'features/content-panel/chat/ChatSession'
import LoginLink from 'features/user/LoginLink'
import { selectIsGFWUser, selectIsGuestUser } from 'features/user/selectors/user.selectors'

import styles from './Chat.module.css'

function ChatContainer() {
  const { t } = useTranslation()
  const isGuestUser = useSelector(selectIsGuestUser)
  const isGFWUser = useSelector(selectIsGFWUser)
  const { threadsError } = useChatThreads()

  if (isGuestUser) {
    return (
      <div className={styles.loginGate}>
        <p className={styles.empty}>{t((t) => t.common.assistantLogin)}</p>
        <LoginLink className={styles.loginLink} loginSource="assistant">
          {t((t) => t.common.login)}
        </LoginLink>
      </div>
    )
  }

  if (!isGFWUser) {
    return null
  }

  return (
    <div className={styles.chat}>
      <ChatHeader />
      {threadsError ? <div className={styles.error}>{threadsError}</div> : <ChatSession />}
    </div>
  )
}

export default ChatContainer
