import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { Icon, IconButton, Popover, Spinner, TextArea } from '@globalfishingwatch/ui-components'

import { useChatAgent } from 'features/content-panel/chat.hooks'
import ContentMarkdown from 'features/content-panel/ContentMarkdown'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'

import styles from './ChatContent.module.css'

const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
function formatUpdatedAt(ts: number) {
  const diffMs = ts - Date.now()
  const minutes = Math.round(diffMs / 60000)
  if (Math.abs(minutes) < 60) return relativeTime.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return relativeTime.format(hours, 'hour')
  return relativeTime.format(Math.round(hours / 24), 'day')
}

function ChatContent() {
  const { t } = useTranslation()
  const { closeSidePanel } = useSidePanel()
  const {
    messages,
    loading,
    conversations,
    activeId,
    send,
    newConversation,
    selectConversation,
    deleteConversation,
  } = useChatAgent()
  const [input, setInput] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, loading])

  const onSend = () => {
    send(input)
    setInput('')
  }

  const history = (
    <ul className={styles.historyList}>
      {conversations.length === 0 && (
        <li className={styles.historyEmpty}>{t((t) => t.common.noConversations)}</li>
      )}
      {conversations.map((c) => (
        <li
          key={c.id}
          className={cx(styles.historyItem, { [styles.historyActive]: c.id === activeId })}
        >
          <button
            type="button"
            className={styles.historyButton}
            onClick={() => {
              selectConversation(c.id)
              setHistoryOpen(false)
            }}
          >
            <span className={styles.historyTitle}>{c.title}</span>
            <span className={styles.historyTime}>{formatUpdatedAt(c.updatedAt)}</span>
          </button>
          <IconButton
            icon="delete"
            size="small"
            tooltip={t((t) => t.common.delete)}
            onClick={() => deleteConversation(c.id)}
          />
        </li>
      ))}
    </ul>
  )

  return (
    <div className={styles.chat}>
      <div className={styles.header}>
        <Icon icon="sparks" />
        <span className={styles.title}>{t((t) => t.common.assistant)}</span>
        <Popover
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          onClickOutside={() => setHistoryOpen(false)}
          placement="bottom-end"
          content={history}
          className={styles.history}
        >
          <div className={styles.historyBtn}>
            <IconButton icon="history" tooltip={t((t) => t.common.history)} size="medium" />
          </div>
        </Popover>
        <IconButton
          icon="plus"
          tooltip={t((t) => t.common.newConversation)}
          onClick={newConversation}
          size="medium"
        />
        <IconButton
          type="border"
          icon="close"
          tooltip={t((t) => t.common.close)}
          onClick={closeSidePanel}
        />
      </div>

      <div className={styles.messages} ref={scrollRef}>
        {messages.length === 0 && (
          <p className={styles.empty}>{t((t) => t.common.assistantPlaceholder)}</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cx(styles.message, styles[m.role], { [styles.error]: m.error })}>
            {m.role === 'agent' ? <ContentMarkdown>{m.text}</ContentMarkdown> : m.text}
          </div>
        ))}
        {loading && <Spinner size="small" />}
      </div>

      <div className={styles.inputRow}>
        <TextArea
          className={styles.input}
          value={input}
          placeholder={t((t) => t.common.messageAssistant)}
          rows={1}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
          }}
        />
        <IconButton
          icon="arrow-right"
          type="border"
          disabled={loading || !input.trim()}
          onClick={onSend}
        />
      </div>
    </div>
  )
}

export default ChatContent
