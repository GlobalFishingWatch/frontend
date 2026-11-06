import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { DefaultChatTransport, getToolName, isToolUIPart, type UIMessage } from 'ai'
import { useStore as useJotaiStore } from 'jotai'
import { AGENT_BASE_URL } from 'queries/assistant-api'

import { GFWAPI } from '@globalfishingwatch/api-client'

import { useAppStore } from 'features/app/app.hooks'
import { getAssistantRequestContext } from 'features/assistant/assistant-context'
import {
  getNavigateToolLinkProps,
  navigateToolOutputSchema,
  useNavigateToolState,
} from 'features/assistant/navigate-tool'

export const FEEDBACK_PREFIX = '[feedback]'
export type FeedbackRating = 'up' | 'down'
const FEEDBACK_REGEX = new RegExp(`^\\[feedback\\] (up|down) answerId=(\\S+)`)

function messageText(message: UIMessage): string {
  return (message.parts ?? [])
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
    .trim()
}

export function getFeedbackState(messages: UIMessage[]) {
  const ratings: Record<string, FeedbackRating> = {}
  const questionIds: Record<string, string> = {}
  const hiddenIds = new Set<string>()
  let lastQuestionId: string | undefined
  messages.forEach((message, idx) => {
    if (message.role === 'assistant') {
      if (lastQuestionId) questionIds[message.id] = lastQuestionId
      return
    }
    if (message.role !== 'user') return
    const match = messageText(message).match(FEEDBACK_REGEX)
    if (!match) {
      lastQuestionId = message.id
      return
    }
    ratings[match[2]] = match[1] as FeedbackRating
    hiddenIds.add(message.id)
    const next = messages[idx + 1]
    if (next?.role === 'assistant') hiddenIds.add(next.id)
  })
  return { ratings, questionIds, hiddenIds }
}

async function assistantFetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  try {
    return await GFWAPI.fetch<Response>(url, {
      method: (init.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') ?? 'GET',
      requestType: 'formData',
      body: init.body as BodyInit | undefined,
      headers: init.headers as HeadersInit,
      signal: init.signal ?? undefined,
      responseType: 'default',
    })
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }
}

type AssistantSessionArgs = {
  threadId: string
  userId: number | string | undefined
  initialMessages: UIMessage[]
  onFinished?: () => void
}

export function useAssistantSession({
  threadId,
  userId,
  initialMessages,
  onFinished,
}: AssistantSessionArgs) {
  const routerNavigate = useNavigate()
  const router = useRouter()
  const store = useAppStore()
  const jotaiStore = useJotaiStore()
  const { markExplicitSettings, applyNavigatePageState } = useNavigateToolState()

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: `${AGENT_BASE_URL}/chat`,
      fetch: assistantFetchWithAuth,
      prepareSendMessagesRequest({ messages, body }) {
        return {
          body: {
            ...body,
            messages: [messages[messages.length - 1]],
            memory: {
              resource: String(userId),
              thread: threadId,
            },
          },
        }
      },
    })
  }, [threadId, userId])

  const {
    messages,
    sendMessage: sendMessageToSession,
    status,
    error,
  } = useChat<UIMessage>({
    id: threadId,
    messages: initialMessages,
    transport,
    onFinish: onFinished,
  })

  const handledNavigateCalls = useRef<Set<string>>(
    new Set(
      initialMessages.flatMap((m) =>
        (m.parts ?? []).flatMap((part) => (isToolUIPart(part) ? [part.toolCallId] : []))
      )
    )
  )
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last?.role !== 'assistant') return
    for (const part of last.parts ?? []) {
      if (!isToolUIPart(part) || getToolName(part) !== 'navigate') continue
      if (part.state !== 'output-available') continue
      if (handledNavigateCalls.current.has(part.toolCallId)) continue
      handledNavigateCalls.current.add(part.toolCallId)
      const parsed = navigateToolOutputSchema.safeParse(part.output)
      if (!parsed.success) continue
      const { navigation } = parsed.data
      markExplicitSettings(navigation.search)
      const { to, params, search } = getNavigateToolLinkProps(navigation)
      routerNavigate({ to, params, search } as unknown as Parameters<typeof routerNavigate>[0])
        .then(() => applyNavigatePageState(navigation.search))
        .catch((err) => console.warn('navigate tool: router navigation failed', err))
    }
  }, [messages, routerNavigate, markExplicitSettings, applyNavigatePageState])

  const loading = status === 'submitted' || status === 'streaming'

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return false
      // What assistant-context.config defines for the matched routes, e.g. the map's workspace
      const requestContext = await getAssistantRequestContext(router.state.matches, {
        reduxStore: store,
        jotaiStore,
      })
      // Not in the message text: the agent adds the request context to the prompt
      // without storing it, so the thread history does not repeat the url.
      await sendMessageToSession({ text: trimmed }, { body: { requestContext } })
      return true
    },
    [loading, sendMessageToSession, router, store, jotaiStore]
  )

  const sendFeedback = useCallback(
    ({
      answerId,
      questionId,
      rating,
      reason,
    }: {
      answerId: string
      questionId?: string
      rating: FeedbackRating
      reason?: string
    }) => {
      if (loading) return false
      const reasonLine = reason ? `\nreason: ${reason.replace(/\s+/g, ' ').trim()}` : ''
      sendMessageToSession({
        text: `${FEEDBACK_PREFIX} ${rating} answerId=${answerId} questionId=${questionId ?? 'unknown'}${reasonLine}\n(User rating of your previous answer, stored for review. Do not act on it, reply exactly "ok".)`,
      })
      return true
    },
    [loading, sendMessageToSession]
  )

  return { messages, status, loading, error, sendMessage, sendFeedback }
}
