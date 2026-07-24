import { useCallback, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { useNavigate } from '@tanstack/react-router'
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type UIMessage,
} from 'ai'
import { useSetAtom } from 'jotai'
import { AGENT_BASE_URL } from 'queries/chat-api'

import { GFWAPI } from '@globalfishingwatch/api-client'

import { navigateToolInputSchema } from 'features/content-panel/chat/navigate-tool'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { timerangeState } from 'features/timebar/timebar.hooks'
import { selectUserId } from 'features/user/selectors/user.permissions.selectors'
import type { QueryParams } from 'types'

export const MAP_URL_CONTEXT_PREFIX = '\n\n[current map url:'

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
  const setTimerange = useSetAtom(timerangeState)
  const setMapViewState = useSetMapCoordinates()

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
    onFinish: () => onFinished?.(),
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
        await routerNavigate({
          to: navigation.to,
          params: navigation.params ?? {},
          search: { ...navigation.search, sidePanelContent: 'chat' },
        } as unknown as Parameters<typeof routerNavigate>[0])

        const { start, end, latitude, longitude, zoom } = (navigation.search ?? {}) as QueryParams
        if (start && end) {
          setTimerange({ start, end })
        }
        if (latitude || longitude || zoom) {
          setMapViewState({ latitude, longitude, zoom })
        }
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

  return { messages, status, loading, error, sendMessage }
}
