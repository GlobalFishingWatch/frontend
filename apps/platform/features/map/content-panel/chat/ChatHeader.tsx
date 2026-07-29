import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { IconButton, Popover, Spinner } from '@globalfishingwatch/ui-components'

import { useChatThreads } from 'features/map/content-panel/chat/chat-threads.hooks'
import { useSidePanel } from 'features/map/content-panel/contentPanel.hooks'
import { getTimeAgo } from 'utils/dates'

import styles from './Chat.module.css'

function ChatHistoryItem({
  thread,
  active,
  disabled,
  loading,
  onSelect,
  onDelete,
}: {
  thread: { id: string; title: string; updatedAt: string }
  active: boolean
  disabled: boolean
  loading: boolean
  onSelect: () => void
  onDelete: () => Promise<unknown>
}) {
  const { t } = useTranslation()
  const [deleting, setDeleting] = useState(false)
  return (
    <li className={cx(styles.historyItem, { [styles.historyActive]: active })}>
      <button
        type="button"
        className={styles.historyButton}
        onClick={onSelect}
        disabled={disabled || deleting}
      >
        <span className={styles.historyTitle}>{thread.title || t((t) => t.common.assistant)}</span>
        <span className={styles.historyTime}>
          {getTimeAgo(getUTCDateTime(thread.updatedAt), t)}
        </span>
      </button>
      {loading && <Spinner size="tiny" />}
      <IconButton
        icon="delete"
        size="small"
        loading={deleting}
        disabled={deleting}
        tooltip={t((t) => t.common.delete)}
        onClick={() => {
          setDeleting(true)
          onDelete().finally(() => setDeleting(false))
        }}
      />
    </li>
  )
}

function ChatHeader() {
  const { t } = useTranslation()
  const [historyOpen, setHistoryOpen] = useState(false)
  const { closeSidePanel } = useSidePanel()

  const {
    threads,
    threadsError,
    threadsLoading,
    activeThreadId,
    activeThreadIsLoading,
    setActiveThreadId,
    deleteThread,
    newThread,
  } = useChatThreads()

  return (
    <div className={styles.header}>
      <label className={styles.title}>{t((t) => t.common.assistant)}</label>
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
                <ChatHistoryItem
                  key={c.id}
                  thread={c}
                  active={c.id === activeThreadId}
                  disabled={activeThreadIsLoading && c.id !== activeThreadId}
                  loading={activeThreadIsLoading && c.id === activeThreadId}
                  onSelect={() => {
                    setActiveThreadId(c.id)
                    setHistoryOpen(false)
                  }}
                  onDelete={() => deleteThread(c.id)}
                />
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
          disabled={activeThreadIsLoading}
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
