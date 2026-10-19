import { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useRouterState } from '@tanstack/react-router'
import { getToolName, isToolUIPart, type UIMessage } from 'ai'
import cx from 'classnames'
import type { TFunction } from 'i18next'
import { useAtom } from 'jotai'

import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'
import { TextArea } from '@globalfishingwatch/ui-components/textarea'

import { pendingPromptAtom } from 'features/assistant/assistant.atoms'
import type { FeedbackRating } from 'features/assistant/assistant-session.hooks'
import { getFeedbackState, useAssistantSession } from 'features/assistant/assistant-session.hooks'
import { useSetThreadLoading } from 'features/assistant/assistant-threads.hooks'
import {
  getNavigateToolAlternatives,
  getNavigateToolLinkProps,
  isNavigateToolViewActive,
  type NavigateToolNavigation,
  navigateToolOutputSchema,
  useNavigateToolState,
} from 'features/assistant/navigate-tool'
import ContentMarkdown from 'features/help/markdown/ContentMarkdown'

import styles from './Assistant.module.css'

function roleClass(role: UIMessage['role']): string {
  if (role === 'assistant') return styles.agent
  if (role === 'user') return styles.user
  return styles.system
}

function toolActionLabel(t: TFunction, name: string): string | undefined {
  switch (name) {
    case 'navigate':
      return t((t) => t.assistant.toolNavigate)
    case 'run_skill_script':
      return t((t) => t.assistant.toolRunSkillScript)
    case 'load_skill':
      return t((t) => t.assistant.toolLoadSkill)
    case 'read_skill_resource':
      return t((t) => t.assistant.toolReadSkillResource)
    case 'bash':
      return t((t) => t.assistant.toolBash)
    case 'gfw_region-id-lookup':
      return t((t) => t.assistant.toolRegionLookup)
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
      return t((t) => t.assistant.skillLayers)
    case 'areas.json':
      return t((t) => t.assistant.skillAreas)
    case 'filters.md':
      return t((t) => t.assistant.skillFilters)
    case 'query-params.md':
      return t((t) => t.assistant.skillQueryParams)
    case 'routes.md':
      return t((t) => t.assistant.skillRoutes)
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

function NavigateToolLink({
  navigation,
  label,
}: {
  navigation: NavigateToolNavigation
  label?: string
}) {
  const { t } = useTranslation()
  const { markExplicitSettings, applyNavigatePageState } = useNavigateToolState()
  const linkProps = getNavigateToolLinkProps(navigation)
  const isSameViewSearch = useRouterState({
    select: (s) => isNavigateToolViewActive(s.location.search, linkProps.viewSearch, navigation.to),
  })
  return (
    <Link
      to={linkProps.to as any}
      params={linkProps.params as any}
      search={linkProps.search as any}
      activeOptions={{ includeSearch: false }}
      onClick={() => {
        markExplicitSettings(navigation.search)
        applyNavigatePageState(navigation.search)
      }}
    >
      {({ isActive }) => {
        const isCurrentView = isActive && isSameViewSearch
        const text =
          label ??
          (isCurrentView
            ? t((t) => t.assistant.toolNavigation)
            : t((t) => t.assistant.toolNavigateBack))
        return (
          <span
            className={cx(styles.toolLink, {
              [styles.toolLinkBtn]: !label && !isCurrentView,
              [styles.toolLinkAlternative]: label,
            })}
          >
            {text}
          </span>
        )
      }}
    </Link>
  )
}

function NavigateToolLinks({ output }: { output: unknown }) {
  const { t } = useTranslation()
  const parsed = navigateToolOutputSchema.safeParse(output)
  if (!parsed.success) return null
  const alternatives = getNavigateToolAlternatives(parsed.data)
  return (
    <Fragment>
      <NavigateToolLink navigation={parsed.data.navigation} />
      {alternatives.length > 0 && (
        <div className={styles.toolAlternatives}>
          <span className={styles.toolAlternativesTitle}>
            {t((t) => t.assistant.toolAlternatives)}
          </span>
          {alternatives.map((alternative, i) => (
            <NavigateToolLink
              key={i}
              navigation={alternative.navigation}
              label={alternative.label}
            />
          ))}
        </div>
      )}
    </Fragment>
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
          return <span key={idx}>{text}</span>
        }
        if (part.type === 'reasoning') {
          if (!part.text) return null
          return (
            <details key={idx} className={styles.thinking}>
              <summary>{t((t) => t.assistant.thinking)}</summary>
              <div className={styles.thinkingBlock}>
                <ContentMarkdown variant="chat">{part.text}</ContentMarkdown>
              </div>
            </details>
          )
        }
        if (part.type === 'data-tripwire') {
          return (
            <div key={idx} className={styles.tripwire}>
              {tripwireReason(part) ?? t((t) => t.assistant.requestBlocked)}
            </div>
          )
        }
        if (isToolUIPart(part)) {
          const name = getToolName(part)
          if (name === 'navigate') {
            return <NavigateToolLinks key={idx} output={part.output} />
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
        tooltip={t((t) => t.assistant.feedbackUp)}
        onClick={() => {
          const reason = window.prompt(t((t) => t.assistant.feedbackUpReason))
          onRate('up', reason || '')
        }}
      />
      <IconButton
        icon="thumbs-down"
        size="small"
        className={cx({ [styles.feedbackActive]: rating === 'down' })}
        tooltip={t((t) => t.assistant.feedbackDown)}
        onClick={() => {
          // ponytail: native prompt, swap for a textarea popover if it needs styling
          const reason = window.prompt(t((t) => t.assistant.feedbackDownReason))
          if (reason === null) return
          onRate('down', reason)
        }}
      />
    </div>
  )
}

function AssistantMessages({
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

  const { messages, loading, error, sendMessage, sendFeedback } = useAssistantSession({
    threadId,
    userId,
    initialMessages,
    onFinished,
  })
  useSetThreadLoading(threadId, loading)

  const { ratings, questionIds, hiddenIds } = getFeedbackState(messages)

  const [input, setInput] = useState('')
  const [pendingPrompt, setPendingPrompt] = useAtom(pendingPromptAtom)
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
    setPendingPrompt(null)
    sendMessage(pendingPrompt)
    onSendMessage?.()
  }, [setPendingPrompt, pendingPrompt, sendMessage, onSendMessage])

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

export default AssistantMessages
