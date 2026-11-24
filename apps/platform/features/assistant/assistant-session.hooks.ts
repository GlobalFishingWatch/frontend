import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import {
  DefaultChatTransport,
  getToolName,
  isToolUIPart,
  lastAssistantMessageIsCompleteWithToolCalls,
  type UIMessage,
} from 'ai'
import { useStore as useJotaiStore } from 'jotai'
import { AGENT_BASE_URL } from 'queries/assistant-api'

import { GFWAPI } from '@globalfishingwatch/api-client'

import { useAppStore } from 'features/app/app.hooks'
import {
  getAssistantRequestContext,
  isAssistantContextTool,
  runAssistantContextTool,
} from 'features/assistant/assistant-context'
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

/** Guards against a model that keeps asking: past this, the turn ends without the answer */
const MAX_CONTEXT_TOOL_CALLS_PER_TURN = 8

const isContextToolPart = (part: UIMessage['parts'][number]) =>
  isToolUIPart(part) && isAssistantContextTool(getToolName(part))

/**
 * Resend once every context tool call of the last step has its output. Only for context tools:
 * `navigate` runs on the server, so a turn that ends on it is already complete.
 */
function shouldSendContextToolOutputs({ messages }: { messages: UIMessage[] }) {
  if (!lastAssistantMessageIsCompleteWithToolCalls({ messages })) return false
  const parts = messages[messages.length - 1].parts
  const lastStep = parts.slice(parts.map((part) => part.type).lastIndexOf('step-start') + 1)
  return (
    lastStep.some(isContextToolPart) &&
    parts.filter(isContextToolPart).length <= MAX_CONTEXT_TOOL_CALLS_PER_TURN
  )
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
      // Every request, continuations too: after `navigate` the url and the page tools change.
      // Not in the message text: the agent adds it to the prompt without storing it.
      async prepareSendMessagesRequest({ messages, body }) {
        return {
          body: {
            ...body,
            requestContext: await getAssistantRequestContext(router.state.matches),
            messages: [messages[messages.length - 1]],
            memory: {
              resource: String(userId),
              thread: threadId,
            },
          },
        }
      },
    })
  }, [threadId, userId, router])

  const {
    messages,
    sendMessage: sendMessageToSession,
    addToolOutput,
    status,
    error,
  } = useChat<UIMessage>({
    id: threadId,
    messages: initialMessages,
    transport,
    onFinish: onFinished,
    // Context tools have no server `execute`: the run stops at the call and the page answers it
    onToolCall({ toolCall }) {
      const tool = toolCall.toolName
      if (!isAssistantContextTool(tool)) {
        return
      }
      const { toolCallId } = toolCall
      // Not awaited (AI SDK docs): addToolOutput waits for the stream job that runs onToolCall
      runAssistantContextTool(tool, router.state.matches, { reduxStore: store, jotaiStore })
        .then((output) => addToolOutput({ tool, toolCallId, output: output ?? null }))
        .catch((e) => {
          console.warn('assistant: context tool failed', tool, e)
          addToolOutput({ tool, toolCallId, state: 'output-error', errorText: String(e) })
        })
    },
    sendAutomaticallyWhen: shouldSendContextToolOutputs,
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
      if (!trimmed || loading) {
        return false
      }
      await sendMessageToSession({ text: trimmed })
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
