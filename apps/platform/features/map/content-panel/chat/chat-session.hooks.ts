import { useCallback, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { useNavigate } from '@tanstack/react-router'
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type UIMessage,
} from 'ai'
import { AGENT_BASE_URL } from 'queries/map/chat-api'

import { GFWAPI } from '@globalfishingwatch/api-client'

import {
  getNavigateToolLinkProps,
  navigateToolInputSchema,
  useNavigateToolMapState,
} from 'features/map/content-panel/chat/navigate-tool'

export const MAP_URL_CONTEXT_PREFIX = '\n\n[current map url:'

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

async function chatFetchWithAuth(
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

type ChatSessionArgs = {
  threadId: string
  userId: number | string | undefined
  initialMessages: UIMessage[]
  onFinished?: () => void
}

export function useChatSession({ threadId, userId, initialMessages, onFinished }: ChatSessionArgs) {
  const routerNavigate = useNavigate()
  const { markExplicitSettings, applyNavigateMapState } = useNavigateToolMapState()

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: `${AGENT_BASE_URL}/chat`,
      fetch: chatFetchWithAuth,
      prepareSendMessagesRequest({ messages }) {
        return {
          body: {
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
    addToolOutput,
  } = useChat<UIMessage>({
    id: threadId,
    messages: initialMessages,
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onFinish: onFinished,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName !== 'navigate') {
        return
      }
      const reportNavigate = (output: { ok: boolean; detail: string }) =>
        addToolOutput({ tool: 'navigate', toolCallId: toolCall.toolCallId, output })

      const parsed = navigateToolInputSchema.safeParse(toolCall.input)
      if (!parsed.success) {
        reportNavigate({
          ok: false,
          detail: `Invalid navigate input: ${parsed.error.issues.map((i) => i.message).join('; ')}`,
        })
        return
      }
      const { navigation, path } = parsed.data
      try {
        markExplicitSettings(navigation.search)
        await routerNavigate(
          getNavigateToolLinkProps(navigation) as unknown as Parameters<typeof routerNavigate>[0]
        )
        applyNavigateMapState(navigation.search)
        reportNavigate({
          ok: true,
          detail: `Navigated via router to path: ${path ?? ''}`,
        })
      } catch (err) {
        reportNavigate({
          ok: false,
          detail: `TanStack Router navigate failed: ${String(err)}`,
        })
      }
    },
  })

  const loading = status === 'submitted' || status === 'streaming'

  // Inject the current map url as context so the agent knows the map state.
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return false
      const content = `${trimmed}${MAP_URL_CONTEXT_PREFIX} ${window.location.href}]`
      await sendMessageToSession({ text: content })
      return true
    },
    [loading, sendMessageToSession]
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
