import { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'
import { getToolName, isToolUIPart, type UIMessage } from 'ai'
import cx from 'classnames'
import type { TFunction } from 'i18next'

import { IconButton, Spinner, TextArea } from '@globalfishingwatch/ui-components'

import {
  selectPendingChatPrompt,
  setPendingChatPrompt,
} from 'features/_map/content-panel/chat/chat.slice'
import type { FeedbackRating } from 'features/_map/content-panel/chat/chat-session.hooks'
import {
  getFeedbackState,
  MAP_URL_CONTEXT_PREFIX,
  useChatSession,
} from 'features/_map/content-panel/chat/chat-session.hooks'
import { useSetThreadLoading } from 'features/_map/content-panel/chat/chat-threads.hooks'
import {
  getNavigateToolLinkProps,
  navigateToolInputSchema,
  useNavigateToolMapState,
} from 'features/_map/content-panel/chat/navigate-tool'
import ContentMarkdown from 'features/_map/content-panel/ContentMarkdown'
import { useAppDispatch } from 'features/app/app.hooks'

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

function NavigateToolLink({ input }: { input: unknown }) {
  const { t } = useTranslation()
  const { markExplicitSettings, applyNavigateMapState } = useNavigateToolMapState()
  const parsed = navigateToolInputSchema.safeParse(input)
  if (!parsed.success) return null
  const { navigation } = parsed.data
  return (
    <Link
      {...(getNavigateToolLinkProps(navigation) as any)}
      onClick={() => {
        markExplicitSettings(navigation.search)
        applyNavigateMapState(navigation.search)
      }}
    >
      {({ isActive }) => (
        <span className={cx(styles.toolLink, { [styles.toolLinkBtn]: !isActive })}>
          {isActive ? t((t) => t.chat.toolNavigation) : t((t) => t.chat.toolNavigateBack)}
        </span>
      )}
    </Link>
  )
}

type TripwireData = {
  reason?: string
}

function tripwireReason(part: UIMessage['parts'][number]): string | undefined {
  if (part.type !== 'data-tripwire') return undefined
  const data = (part as { data?: TripwireData }).data
  return data?.reason
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
            return (
              <ContentMarkdown key={idx} variant="chat">
                {text}
              </ContentMarkdown>
            )
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
                <ContentMarkdown variant="chat">{part.text}</ContentMarkdown>
              </div>
            </details>
          )
        }
        if (part.type === 'data-tripwire') {
          return (
            <div key={idx} className={styles.tripwire}>
              {tripwireReason(part) ?? t((t) => t.chat.requestBlocked)}
            </div>
          )
        }
        if (isToolUIPart(part)) {
          const name = getToolName(part)
          if (name === 'navigate') {
            return <NavigateToolLink key={idx} input={part.input} />
          }
          if (idx !== lastToolIdx) return null
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

function MessageFeedback({
  rating,
  onRate,
}: {
  rating?: FeedbackRating
  onRate: (rating: FeedbackRating, reason?: string) => void
}) {
  const { t } = useTranslation()
  return (
    <div className={styles.feedback}>
      <IconButton
        icon="thumbs-up"
        size="small"
        className={cx({ [styles.feedbackActive]: rating === 'up' })}
        tooltip={t((t) => t.chat.feedbackUp)}
        onClick={() => {
          const reason = window.prompt(t((t) => t.chat.feedbackUpReason))
          onRate('up', reason || '')
        }}
      />
      <IconButton
        icon="thumbs-down"
        size="small"
        className={cx({ [styles.feedbackActive]: rating === 'down' })}
        tooltip={t((t) => t.chat.feedbackDown)}
        onClick={() => {
          // ponytail: native prompt, swap for a textarea popover if it needs styling
          const reason = window.prompt(t((t) => t.chat.feedbackDownReason))
          if (reason === null) return
          onRate('down', reason)
        }}
      />
    </div>
  )
}

function ChatSessionMessages({
  threadId,
  userId,
  initialMessages,
  onSendMessage,
  onFinished,
}: {
  threadId: string
  userId: number | string | undefined
  initialMessages: UIMessage[]
  onSendMessage?: () => void
  onFinished?: () => void
}) {
  const { t } = useTranslation()

  const { messages, loading, error, sendMessage, sendFeedback } = useChatSession({
    threadId,
    userId,
    initialMessages,
    onFinished,
  })
  useSetThreadLoading(threadId, loading)

  const { ratings, questionIds, hiddenIds } = getFeedbackState(messages)

  const [input, setInput] = useState('')
  const dispatch = useAppDispatch()
  const pendingPrompt = useSelector(selectPendingChatPrompt)
  const sentPromptRef = useRef<string | null>(null)
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

  useEffect(() => {
    if (!pendingPrompt || sentPromptRef.current === pendingPrompt) return
    sentPromptRef.current = pendingPrompt
    dispatch(setPendingChatPrompt(null))
    sendMessage(pendingPrompt)
    onSendMessage?.()
  }, [dispatch, pendingPrompt, sendMessage, onSendMessage])

  const onSend = () => {
    setInput('')
    sendMessage(input)
    onSendMessage?.()
  }

  return (
    <Fragment>
      <div className={styles.messages} ref={scrollRef}>
        {loading && messages.length === 0 && <Spinner size="small" />}
        {!loading && messages.length === 0 && (
          <p className={styles.empty}>{t((t) => t.common.assistantPlaceholder)}</p>
        )}
        {messages.map((m) =>
          hiddenIds.has(m.id) ? null : (
            <div key={m.id} className={cx(styles.message, roleClass(m.role))}>
              <MessageParts message={m} />
              {m.role === 'assistant' && !loading && (
                <MessageFeedback
                  rating={ratings[m.id]}
                  onRate={(rating, reason) =>
                    sendFeedback({
                      answerId: m.id,
                      questionId: questionIds[m.id],
                      rating,
                      reason,
                    })
                  }
                />
              )}
            </div>
          )
        )}
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

export default ChatSessionMessages
