import { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getToolName, isToolUIPart, type UIMessage } from 'ai'
import cx from 'classnames'

import { IconButton, Spinner, TextArea } from '@globalfishingwatch/ui-components'

import { useChatThreadMessages } from 'features/content-panel/chat/chat.hooks'
import { useChatThreads } from 'features/content-panel/chat/chat-threads.hooks'
import ContentMarkdown from 'features/content-panel/ContentMarkdown'

import styles from './Chat.module.css'

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
      return t((t) => t.chat.toolNavigate)
    case 'run_skill_script':
      return t((t) => t.chat.toolRunSkillScript)
    case 'load_skill':
      return t((t) => t.chat.toolLoadSkill)
    case 'read_skill_resource':
      return t((t) => t.chat.toolReadSkillResource)
    case 'bash':
      return t((t) => t.chat.toolBash)
    case 'gfw_region-id-lookup':
      return t((t) => t.chat.toolRegionLookup)
    default:
      return prettify(name)
  }
}

function toolStateLabel(t: TFunction, state?: string): string | undefined {
  switch (state) {
    case 'input-streaming':
      return t((t) => t.chat.toolStateStarting)
    case 'input-available':
      return t((t) => t.chat.toolStateRunning)
    case 'output-available':
      return t((t) => t.chat.toolStateDone)
    case 'output-error':
      return t((t) => t.chat.toolStateFailed)
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
  const parts = message.parts ?? []
  // Tool chips are transient progress. Show only the last one in the message so
  // the reader sees just the latest activity (parts aren't array-adjacent — the
  // SDK interleaves step-start parts — so collapse by "is this the last tool").
  let lastToolIdx = -1
  parts.forEach((part, idx) => {
    if (isToolUIPart(part)) lastToolIdx = idx
  })
  return (
    <Fragment>
      {parts.map((part, idx) => {
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
        if (part.type === 'reasoning') {
          if (!part.text) return null
          return (
            <details key={idx} className={styles.thinking}>
              <summary>{t((t) => t.chat.thinking)}</summary>
              <div className={styles.thinkingBlock}>
                <ContentMarkdown>{part.text}</ContentMarkdown>
              </div>
            </details>
          )
        }
        if (isToolUIPart(part)) {
          if (idx !== lastToolIdx) return null
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
    </Fragment>
  )
}

function ChatSession() {
  const { t } = useTranslation()
  const { activeThreadId, refreshThreads } = useChatThreads()
  const { messages, loading, error, historyError, sendMessage } = useChatThreadMessages({
    activeThreadId,
    refreshThreads,
  })
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const textarea = inputRowRef.current?.querySelector('textarea')
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [input])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, loading])

  const onSend = () => {
    setInput('')
    sendMessage(input)
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

      <div className={styles.inputRow} ref={inputRowRef}>
        <TextArea
          className={styles.input}
          value={input}
          placeholder={t((t) => t.common.messageAssistant)}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !loading) {
              e.preventDefault()
              onSend()
            }
          }}
        />
        <IconButton
          icon="arrow-right"
          type="border"
          disabled={loading || !input.trim()}
          onClick={() => onSend()}
        />
      </div>
    </Fragment>
  )
}

export default ChatSession
