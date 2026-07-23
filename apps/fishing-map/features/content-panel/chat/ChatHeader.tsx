import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { Icon, IconButton, Popover } from '@globalfishingwatch/ui-components'

import { useChatThreads } from 'features/content-panel/chat/chat-threads.hooks'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'
import { getTimeAgo } from 'utils/dates'

import styles from './Chat.module.css'

function ChatHeader() {
  const { t } = useTranslation()
  const [historyOpen, setHistoryOpen] = useState(false)
  const { closeSidePanel } = useSidePanel()

  const {
    threads,
    threadsError,
    threadsLoading,
    activeThreadId,
    setActiveThreadId,
    deleteThread,
    newThread,
  } = useChatThreads()

  return (
    <div className={styles.header}>
      <Icon icon="sparks" />
      <span className={styles.title}>{t((t) => t.common.assistant)}</span>
      <Fragment>
        <Popover
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          onClickOutside={() => setHistoryOpen(false)}
          placement="bottom-end"
          content={
            <ul className={styles.historyList}>
              {threadsError && <li className={styles.historyEmpty}>{threadsError}</li>}
              {!threadsError && threads.length === 0 && (
                <li className={styles.historyEmpty}>{t((t) => t.common.noConversations)}</li>
              )}
              {threads.map((c) => (
                <li
                  key={c.id}
                  className={cx(styles.historyItem, {
                    [styles.historyActive]: c.id === activeThreadId,
                  })}
                >
                  <button
                    type="button"
                    className={styles.historyButton}
                    onClick={() => {
                      setActiveThreadId(c.id)
                      setHistoryOpen(false)
                    }}
                  >
                    <span className={styles.historyTitle}>
                      {c.title || t((t) => t.common.assistant)}
                    </span>
                    <span className={styles.historyTime}>
                      {getTimeAgo(getUTCDateTime(c.updatedAt), t)}
                    </span>
                  </button>
                  <IconButton
                    icon="delete"
                    size="small"
                    tooltip={t((t) => t.common.delete)}
                    onClick={() => deleteThread(c.id)}
                  />
                </li>
              ))}
            </ul>
          }
          className={styles.history}
        >
          <div className={styles.historyBtn}>
            <IconButton
              icon="history"
              loading={threadsLoading}
              tooltip={t((t) => t.common.history)}
              size="medium"
            />
          </div>
        </Popover>
        <IconButton
          icon="plus"
          tooltip={t((t) => t.common.newConversation)}
          onClick={newThread}
          size="medium"
        />
      </Fragment>
      <IconButton
        type="border"
        icon="close"
        tooltip={t((t) => t.common.close)}
        onClick={closeSidePanel}
      />
    </div>
  )
}

export default ChatHeader
