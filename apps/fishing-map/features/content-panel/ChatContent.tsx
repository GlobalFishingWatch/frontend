import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { UIMessage } from '@tanstack/ai-react'
import cx from 'classnames'

import { Icon, IconButton, Popover, Spinner, TextArea } from '@globalfishingwatch/ui-components'

import {
  TITLE_MAX,
  useChatAgentSession,
  useChatConversations,
} from 'features/content-panel/chat.hooks'
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

function roleClass(role: UIMessage['role']): string {
  if (role === 'assistant') return styles.agent
  if (role === 'user') return styles.user
  return styles.system
}

function MessageParts({ message }: { message: UIMessage }) {
  return (
    <>
      {(message.parts ?? []).map((part, idx) => {
        if (part.type === 'text') {
          const text = part.content
          if (!text) return null
          if (message.role === 'assistant') {
            return <ContentMarkdown key={idx}>{text}</ContentMarkdown>
          }
          // Strip the injected map-url context from the user bubble display.
          const display = text.replace(/\n\n\[current map url: [^\]]+\]$/, '')
          return <span key={idx}>{display}</span>
        }
        if (part.type === 'tool-call') {
          const label = part.name === 'navigate' ? 'Changing view' : `${part.name} (${part.state})`
          return (
            <p key={idx} className={styles.toolChip}>
              {label}
            </p>
          )
        }
        return null
      })}
    </>
  )
}

type SessionProps = {
  threadId: string
  initialMessages: UIMessage[]
  titleSeed: string
  persistConversation: (messages: UIMessage[], title: string) => void
  activate: () => void
}

function ChatSession({
  threadId,
  initialMessages,
  titleSeed,
  persistConversation,
  activate,
}: SessionProps) {
  const { t } = useTranslation()
  const { messages, loading, error, send, addToolApprovalResponse, pendingApprovals } =
    useChatAgentSession({
      threadId,
      initialMessages,
      titleSeed,
      persistConversation,
      activate,
    })
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, loading, pendingApprovals])

  const onSend = () => {
    void send(input)
    setInput('')
  }

  return (
    <>
      <div className={styles.messages} ref={scrollRef}>
        {messages.length === 0 && (
          <p className={styles.empty}>{t((t) => t.common.assistantPlaceholder)}</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cx(styles.message, roleClass(m.role))}>
            <MessageParts message={m} />
          </div>
        ))}
        {error && (
          <div className={cx(styles.message, styles.system, styles.error)}>{error.message}</div>
        )}
        {pendingApprovals.map((p) => (
          <div key={p.approval.id} className={cx(styles.message, styles.system, styles.approval)}>
            <span>
              Tool <code>{p.name}</code> requires approval.
            </span>
            <span className={styles.approvalActions}>
              <button
                type="button"
                className={styles.approvalBtn}
                onClick={() =>
                  void addToolApprovalResponse({ id: p.approval.id, approved: true })
                }
              >
                Approve
              </button>
              <button
                type="button"
                className={styles.approvalBtn}
                onClick={() =>
                  void addToolApprovalResponse({ id: p.approval.id, approved: false })
                }
              >
                Deny
              </button>
            </span>
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
    </>
  )
}

function ChatContent() {
  const { t } = useTranslation()
  const { closeSidePanel } = useSidePanel()
  const {
    conversations,
    activeId,
    activeConversation,
    threadId,
    setActiveId,
    persistConversation,
    activate,
    deleteConversation,
    newConversation,
  } = useChatConversations()
  const [historyOpen, setHistoryOpen] = useState(false)

  const initialMessages = activeConversation?.messages ?? []
  const titleSeed = activeConversation?.title ?? ''

  const history = useMemo(
    () => (
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
                setActiveId(c.id)
                setHistoryOpen(false)
              }}
            >
              <span className={styles.historyTitle}>{c.title || t((t) => t.common.assistant)}</span>
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
    ),
    [conversations, activeId, t, setActiveId, deleteConversation]
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

      <ChatSession
        key={threadId}
        threadId={threadId}
        initialMessages={initialMessages}
        titleSeed={titleSeed.slice(0, TITLE_MAX)}
        persistConversation={persistConversation}
        activate={activate}
      />
    </div>
  )
}

export default ChatContent
