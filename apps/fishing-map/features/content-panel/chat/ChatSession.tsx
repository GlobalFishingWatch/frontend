import { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getToolName, isToolUIPart, type UIMessage } from 'ai'
import cx from 'classnames'
import type { TFunction } from 'i18next'
import { useGetThreadMessagesQuery, useGetThreadsQuery } from 'queries/chat-api'

import { IconButton, Spinner, TextArea } from '@globalfishingwatch/ui-components'

import {
  MAP_URL_CONTEXT_PREFIX,
  useChatSession,
} from 'features/content-panel/chat/chat-session.hooks'
import ContentMarkdown from 'features/content-panel/ContentMarkdown'
import { selectUserId } from 'features/user/selectors/user.permissions.selectors'

import styles from './Chat.module.css'

function roleClass(role: UIMessage['role']): string {
  if (role === 'assistant') return styles.agent
  if (role === 'user') return styles.user
  return styles.system
}

function toolActionLabel(t: TFunction, name: string): string | undefined {
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
      return undefined
  }
}

function toolStateLabel(t: TFunction, state?: string): string | undefined {
  switch (state) {
    case 'input-available':
      return '…'
    case 'output-available':
      return '✓'
    case 'output-error':
      return '✗'
    default:
      return undefined
  }
}

function skillResourceLabel(t: TFunction, basename: string): string | undefined {
  switch (basename) {
    case 'layers.md':
      return t((t) => t.chat.skillLayers)
    case 'areas.json':
      return t((t) => t.chat.skillAreas)
    case 'filters.md':
      return t((t) => t.chat.skillFilters)
    case 'query-params.md':
      return t((t) => t.chat.skillQueryParams)
    case 'routes.md':
      return t((t) => t.chat.skillRoutes)
    default:
      return undefined
  }
}

const SKILL_RESOURCE_FILES = [
  'layers.md',
  'areas.json',
  'filters.md',
  'query-params.md',
  'routes.md',
]

function toolDetail(t: TFunction, input: unknown): string | undefined {
  if (!input || typeof input !== 'object') return undefined
  const serialised = JSON.stringify(input)
  const match = SKILL_RESOURCE_FILES.find((file) => serialised.includes(file))
  return match ? skillResourceLabel(t, match) : undefined
}

function MessageParts({ message }: { message: UIMessage }) {
  const { t } = useTranslation()
  const parts = message.parts ?? []
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
          const display = text.split(MAP_URL_CONTEXT_PREFIX)[0]
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
          const detail = toolDetail(t, part.input)
          const action = detail ?? toolActionLabel(t, name)
          const stateLabel = toolStateLabel(t, part.state)
          if (!action) {
            return null
          }
          return (
            <p key={idx} className={styles.toolChip}>
              {stateLabel ? `${action} ${stateLabel || ''}` : action}
            </p>
          )
        }
        return null
      })}
    </Fragment>
  )
}

function ChatSessionMessages({
  threadId,
  userId,
  initialMessages,
}: {
  threadId: string
  userId: number | string | undefined
  initialMessages: UIMessage[]
}) {
  const { t } = useTranslation()

  const { messages, loading, error, sendMessage } = useChatSession({
    threadId,
    userId,
    initialMessages,
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
        {loading && messages.length === 0 && <Spinner size="small" />}
        {!loading && messages.length === 0 && (
          <p className={styles.empty}>{t((t) => t.common.assistantPlaceholder)}</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cx(styles.message, roleClass(m.role))}>
            <MessageParts message={m} />
          </div>
        ))}
        {error && (
          <div className={cx(styles.message, styles.system, styles.error)}>{error?.message}</div>
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

function ChatSession({ threadId }: { threadId: string }) {
  const userId = useSelector(selectUserId)

  const { data: threads = [] } = useGetThreadsQuery({ resourceId: String(userId) })
  const threadExists = threads.some((thr) => thr.id === threadId)

  const { data: historyMessages, isFetching: historyFetching } = useGetThreadMessagesQuery(
    { threadId, resourceId: String(userId) },
    { skip: !threadExists }
  )

  if (historyFetching) {
    return (
      <div className={styles.messages}>
        <Spinner size="small" />
      </div>
    )
  }

  return (
    <ChatSessionMessages
      key={threadId}
      threadId={threadId}
      userId={userId}
      initialMessages={(historyMessages as UIMessage[]) ?? []}
    />
  )
}

export default ChatSession
