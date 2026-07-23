import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getToolName, isToolUIPart, type UIMessage } from 'ai'
import cx from 'classnames'

import { Icon, IconButton, Popover, Spinner, TextArea } from '@globalfishingwatch/ui-components'

import { useChatAgentSession, useChatConversations } from 'features/content-panel/chat/chat.hooks'
import ContentMarkdown from 'features/content-panel/ContentMarkdown'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'
import LoginLink from 'features/user/LoginLink'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'

import styles from './ChatContent.module.css'

const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
function formatUpdatedAt(updatedAt: string) {
  const diffMs = new Date(updatedAt).getTime() - Date.now()
  if (!Number.isFinite(diffMs)) return ''
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

type TFunction = ReturnType<typeof useTranslation>['t']

function prettify(name: string): string {
  const spaced = name.replace(/[_-]+/g, ' ').trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

// Friendly, translated copy for the agent's known tools — everything else
// falls back to a prettified (untranslated) version of the raw tool name.
function toolActionLabel(t: TFunction, name: string): string {
  switch (name) {
    case 'navigate':
      return t((t) => t.agent.toolNavigate)
    case 'run_skill_script':
      return t((t) => t.agent.toolRunSkillScript)
    case 'load_skill':
      return t((t) => t.agent.toolLoadSkill)
    case 'read_skill_resource':
      return t((t) => t.agent.toolReadSkillResource)
    case 'bash':
      return t((t) => t.agent.toolBash)
    case 'gfw_region-id-lookup':
      return t((t) => t.agent.toolRegionLookup)
    default:
      return prettify(name)
  }
}

function toolStateLabel(t: TFunction, state?: string): string | undefined {
  switch (state) {
    case 'input-streaming':
      return t((t) => t.agent.toolStateStarting)
    case 'input-available':
      return t((t) => t.agent.toolStateRunning)
    case 'output-available':
      return t((t) => t.agent.toolStateDone)
    case 'output-error':
      return t((t) => t.agent.toolStateFailed)
    default:
      return undefined
  }
}

function toolLabel(t: TFunction, name: string, state?: string): string {
  const action = toolActionLabel(t, name)
  const stateLabel = toolStateLabel(t, state)
  return stateLabel ? `${action} (${stateLabel})` : action
}

function MessageParts({ message }: { message: UIMessage }) {
  const { t } = useTranslation()
  return (
    <>
      {(message.parts ?? []).map((part, idx) => {
        if (part.type === 'text') {
          const text = part.text
          if (!text) return null
          if (message.role === 'assistant') {
            return <ContentMarkdown key={idx}>{text}</ContentMarkdown>
          }
          // Strip the injected map-url context from the user bubble display.
          const display = text.replace(/\n\n\[current map url: [^\]]+\]$/, '')
          return <span key={idx}>{display}</span>
        }
        if (isToolUIPart(part)) {
          const name = getToolName(part)
          const label = toolLabel(t, name, part.state)
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
  activate: () => void
  refreshThreads: () => void
}

function ChatSession({ threadId, activate, refreshThreads }: SessionProps) {
  const { t } = useTranslation()
  const { messages, loading, error, historyError, send } = useChatAgentSession({
    threadId,
    activate,
    refreshThreads,
  })
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, loading])

  const onSend = async () => {
    const ok = await send(input)
    if (ok) setInput('')
  }

  return (
    <Fragment>
      <div className={styles.messages} ref={scrollRef}>
        {messages.length === 0 && !historyError && (
          <p className={styles.empty}>{t((t) => t.common.assistantPlaceholder)}</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cx(styles.message, roleClass(m.role))}>
            <MessageParts message={m} />
          </div>
        ))}
        {(error || historyError) && (
          <div className={cx(styles.message, styles.system, styles.error)}>
            {error?.message ?? historyError}
          </div>
        )}
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
              void onSend()
            }
          }}
        />
        <IconButton
          icon="arrow-right"
          type="border"
          disabled={loading || !input.trim()}
          onClick={() => void onSend()}
        />
      </div>
    </Fragment>
  )
}

function ChatLoginGate() {
  const { t } = useTranslation()
  return (
    <div className={styles.loginGate}>
      <p className={styles.empty}>{t((t) => t.common.assistantLogin)}</p>
      <LoginLink className={styles.loginLink} loginSource="assistant">
        {t((t) => t.common.login)}
      </LoginLink>
    </div>
  )
}

function ChatContent() {
  const { t } = useTranslation()
  const userData = useSelector(selectUserData)
  const isGuestUser = useSelector(selectIsGuestUser)
  const { closeSidePanel } = useSidePanel()
  const {
    conversations,
    threadsError,
    activeId,
    threadId,
    canUseChat,
    setActiveId,
    activate,
    deleteConversation,
    newConversation,
    refreshThreads,
  } = useChatConversations()
  const [historyOpen, setHistoryOpen] = useState(false)

  const history = useMemo(
    () => (
      <ul className={styles.historyList}>
        {threadsError && <li className={styles.historyEmpty}>{threadsError}</li>}
        {!threadsError && conversations.length === 0 && (
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
    [conversations, threadsError, activeId, t, setActiveId, deleteConversation]
  )

  return (
    <div className={styles.chat}>
      <div className={styles.header}>
        <Icon icon="sparks" />
        <span className={styles.title}>{t((t) => t.common.assistant)}</span>
        {canUseChat && (
          <Fragment>
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
          </Fragment>
        )}
        <IconButton
          type="border"
          icon="close"
          tooltip={t((t) => t.common.close)}
          onClick={closeSidePanel}
        />
      </div>

      {!userData ? (
        <div className={styles.loginGate}>
          <Spinner />
        </div>
      ) : isGuestUser || !canUseChat ? (
        <ChatLoginGate />
      ) : (
        <ChatSession
          key={threadId}
          threadId={threadId}
          activate={activate}
          refreshThreads={refreshThreads}
        />
      )}
    </div>
  )
}

export default ChatContent
